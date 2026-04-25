"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const db_1 = require("./db");
const content_store_1 = require("./content-store");
const store_1 = require("./store");
const PORT = Number(process.env['PORT'] ?? 3000);
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'afristory-dev-secret';
const TOKEN_TTL = '30d';
const FRONTEND_DIST = (0, node_path_1.join)(__dirname, '..', '..', 'dist', 'afristory', 'browser');
const FRONTEND_INDEX = (0, node_path_1.join)(FRONTEND_DIST, 'index.html');
const authHeaderSchema = zod_1.z.string().regex(/^Bearer\s+/i);
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
    country: zod_1.z.string().min(2).max(80),
});
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80).optional(),
    country: zod_1.z.string().min(2).max(80).optional(),
    bio: zod_1.z.string().max(240).optional(),
    avatarSeed: zod_1.z.string().max(120).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    points: zod_1.z.number().int().min(0).optional(),
    streak: zod_1.z.number().int().min(0).optional(),
    followers: zod_1.z.number().int().min(0).optional(),
    following: zod_1.z.number().int().min(0).optional(),
    badges: zod_1.z.array(zod_1.z.string().min(1).max(64)).max(12).optional(),
});
function createToken(user) {
    return jsonwebtoken_1.default.sign({
        sub: user.id,
        email: user.email,
        country: user.country,
    }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}
function createAuthResponse(user, token = createToken(user)) {
    return {
        token,
        user: (0, store_1.toPublicUser)(user),
    };
}
function sanitizeEmail(value) {
    return value.trim().toLowerCase();
}
function authenticate(req) {
    const rawHeader = req.headers.authorization;
    if (!rawHeader || !authHeaderSchema.safeParse(rawHeader).success) {
        return null;
    }
    const token = rawHeader.replace(/^Bearer\s+/i, '').trim();
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = typeof payload.sub === 'string' ? payload.sub : null;
        if (!userId) {
            return null;
        }
        return { userId, token };
    }
    catch {
        return null;
    }
}
async function requireAuth(req, res, next) {
    const auth = authenticate(req);
    if (!auth) {
        res.status(401).json({ message: 'Authentification requise.' });
        return;
    }
    req.authContext = auth;
    next();
}
async function getCurrentUser(req) {
    const context = req.authContext ?? authenticate(req);
    if (!context) {
        return null;
    }
    const user = await (0, store_1.findUserById)(context.userId);
    return user ?? null;
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        app: 'AFRISTORY API',
        timestamp: new Date().toISOString(),
    });
});
app.get('/api/content', async (req, res) => {
    const auth = authenticate(req);
    const user = auth ? await (0, store_1.findUserById)(auth.userId) : null;
    const snapshot = await (0, content_store_1.getContentSnapshot)(user?.id ?? null);
    res.json(snapshot);
});
app.post('/api/content/posts', requireAuth, async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
        res.status(401).json({ message: 'Session invalide.' });
        return;
    }
    const postSchema = zod_1.z.object({
        content: zod_1.z.string().min(1).max(1000),
        tags: zod_1.z.array(zod_1.z.string().min(1).max(48)).min(1).max(8),
        accent: zod_1.z.string().min(4).max(32),
        mediaType: zod_1.z.enum(['image', 'video']).optional(),
        mediaUrl: zod_1.z.string().url().optional(),
        mediaLabel: zod_1.z.string().max(120).optional(),
    });
    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Données de publication invalides.',
            errors: parsed.error.flatten(),
        });
        return;
    }
    const post = await (0, content_store_1.createPost)({
        author: user.name,
        handle: user.handle,
        country: user.country,
        accent: parsed.data.accent,
        content: parsed.data.content,
        tags: parsed.data.tags,
        mediaType: parsed.data.mediaType,
        mediaUrl: parsed.data.mediaUrl,
        mediaLabel: parsed.data.mediaLabel,
        avatarUrl: user.avatarUrl,
    }, user.id);
    res.status(201).json(post);
});
app.post('/api/content/posts/:id/like', requireAuth, async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
        res.status(401).json({ message: 'Session invalide.' });
        return;
    }
    const postId = req.params['id'];
    if (!postId || Array.isArray(postId)) {
        res.status(400).json({ message: 'Identifiant de publication invalide.' });
        return;
    }
    const post = await (0, content_store_1.toggleLike)(postId, user.id);
    if (!post) {
        res.status(404).json({ message: 'Publication introuvable.' });
        return;
    }
    res.json(post);
});
app.post('/api/content/posts/:id/share', async (req, res) => {
    const auth = authenticate(req);
    const postId = req.params['id'];
    if (!postId || Array.isArray(postId)) {
        res.status(400).json({ message: 'Identifiant de publication invalide.' });
        return;
    }
    const post = await (0, content_store_1.incrementShare)(postId, auth?.userId ?? null);
    if (!post) {
        res.status(404).json({ message: 'Publication introuvable.' });
        return;
    }
    res.json(post);
});
app.post('/api/content/posts/:id/comments', requireAuth, async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
        res.status(401).json({ message: 'Session invalide.' });
        return;
    }
    const commentSchema = zod_1.z.object({
        text: zod_1.z.string().min(1).max(500),
    });
    const parsed = commentSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Commentaire invalide.',
            errors: parsed.error.flatten(),
        });
        return;
    }
    const postId = req.params['id'];
    if (!postId || Array.isArray(postId)) {
        res.status(400).json({ message: 'Identifiant de publication invalide.' });
        return;
    }
    const post = await (0, content_store_1.addComment)(postId, (0, content_store_1.createComment)(user, parsed.data.text), user.id);
    if (!post) {
        res.status(404).json({ message: 'Publication introuvable.' });
        return;
    }
    res.json(post);
});
app.post('/api/content/missions/:id/claim', requireAuth, async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
        res.status(401).json({ message: 'Session invalide.' });
        return;
    }
    const missionId = req.params['id'];
    if (!missionId || Array.isArray(missionId)) {
        res.status(400).json({ message: 'Identifiant de mission invalide.' });
        return;
    }
    const result = await (0, content_store_1.claimMission)(missionId, user.id);
    if (!result) {
        res.status(404).json({ message: 'Mission introuvable.' });
        return;
    }
    res.json(result);
});
app.post('/api/auth/register', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Données de création invalides.',
            errors: parsed.error.flatten(),
        });
        return;
    }
    const payload = parsed.data;
    const email = sanitizeEmail(payload.email);
    const existing = await (0, store_1.findUserByEmail)(email);
    if (existing) {
        res.status(409).json({ message: 'Un compte existe déjà avec cet e-mail.' });
        return;
    }
    const user = await (0, store_1.createUser)({
        ...payload,
        email,
    });
    res.status(201).json(createAuthResponse(user));
});
app.post('/api/auth/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Identifiants invalides.',
            errors: parsed.error.flatten(),
        });
        return;
    }
    const { email, password } = parsed.data;
    const user = await (0, store_1.findUserByEmail)(sanitizeEmail(email));
    if (!user) {
        res.status(401).json({ message: 'Identifiants incorrects.' });
        return;
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        res.status(401).json({ message: 'Identifiants incorrects.' });
        return;
    }
    res.json(createAuthResponse(user));
});
app.get('/api/auth/me', requireAuth, async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
        res.status(401).json({ message: 'Session invalide.' });
        return;
    }
    const token = req.authContext?.token ?? createToken(user);
    res.json(createAuthResponse(user, token));
});
app.patch('/api/auth/me', requireAuth, async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
        res.status(401).json({ message: 'Session invalide.' });
        return;
    }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Données de mise à jour invalides.',
            errors: parsed.error.flatten(),
        });
        return;
    }
    const updated = await (0, store_1.updateUser)(user.id, parsed.data);
    if (!updated) {
        res.status(404).json({ message: 'Utilisateur introuvable.' });
        return;
    }
    const token = createToken(updated);
    res.json(createAuthResponse(updated, token));
});
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ message: 'Route API introuvable.' });
        return;
    }
    next();
});
if ((0, node_fs_1.existsSync)(FRONTEND_INDEX)) {
    app.use(express_1.default.static(FRONTEND_DIST, {
        index: false,
        maxAge: '1y',
    }));
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            next();
            return;
        }
        res.sendFile(FRONTEND_INDEX);
    });
}
async function bootstrap() {
    await (0, db_1.ensureDatabase)();
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`AFRISTORY API running on http://localhost:${PORT}`);
    });
}
void bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start AFRISTORY API', error);
    process.exit(1);
});
