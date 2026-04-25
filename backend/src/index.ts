import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ensureDatabase,
} from './db';
import {
  addComment,
  claimMission,
  createComment,
  createPost as createContentPost,
  getContentSnapshot,
  incrementShare,
  toggleLike,
} from './content-store';
import type {
  AuthResponse,
  AuthCredentials,
  RegisterPayload,
  UpdateProfilePayload,
  UserRecord,
} from './types';
import { createUser, findUserByEmail, findUserById, toPublicUser, updateUser } from './store';

const PORT = Number(process.env['PORT'] ?? 3000);
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'afristory-dev-secret';
const TOKEN_TTL = '30d';
const FRONTEND_DIST = join(__dirname, '..', '..', 'dist', 'afristory', 'browser');
const FRONTEND_INDEX = join(FRONTEND_DIST, 'index.html');

const authHeaderSchema = z.string().regex(/^Bearer\s+/i);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  country: z.string().min(2).max(80),
});

const updateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  country: z.string().min(2).max(80).optional(),
  bio: z.string().max(240).optional(),
  avatarSeed: z.string().max(120).optional(),
  avatarUrl: z.string().url().optional(),
  points: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).optional(),
  followers: z.number().int().min(0).optional(),
  following: z.number().int().min(0).optional(),
  badges: z.array(z.string().min(1).max(64)).max(12).optional(),
});

interface AuthedRequest extends Request {
  authContext?: {
    userId: string;
    token: string;
  };
}

function createToken(user: UserRecord): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      country: user.country,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL },
  );
}

function createAuthResponse(user: UserRecord, token = createToken(user)): AuthResponse {
  return {
    token,
    user: toPublicUser(user),
  };
}

function sanitizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function authenticate(req: Request): { userId: string; token: string } | null {
  const rawHeader = req.headers.authorization;
  if (!rawHeader || !authHeaderSchema.safeParse(rawHeader).success) {
    return null;
  }

  const token = rawHeader.replace(/^Bearer\s+/i, '').trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) {
      return null;
    }

    return { userId, token };
  } catch {
    return null;
  }
}

async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = authenticate(req);
  if (!auth) {
    res.status(401).json({ message: 'Authentification requise.' });
    return;
  }

  (req as AuthedRequest).authContext = auth;
  next();
}

async function getCurrentUser(req: Request): Promise<UserRecord | null> {
  const context = (req as AuthedRequest).authContext ?? authenticate(req);
  if (!context) {
    return null;
  }

  const user = await findUserById(context.userId);
  return user ?? null;
}

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'AFRISTORY API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/content', async (req, res) => {
  const auth = authenticate(req);
  const user = auth ? await findUserById(auth.userId) : null;
  const snapshot = await getContentSnapshot(user?.id ?? null);
  res.json(snapshot);
});

app.post('/api/content/posts', requireAuth, async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ message: 'Session invalide.' });
    return;
  }

  const postSchema = z.object({
    content: z.string().min(1).max(1000),
    tags: z.array(z.string().min(1).max(48)).min(1).max(8),
    accent: z.string().min(4).max(32),
    mediaType: z.enum(['image', 'video']).optional(),
    mediaUrl: z.string().url().optional(),
    mediaLabel: z.string().max(120).optional(),
  });

  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Données de publication invalides.',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const post = await createContentPost(
    {
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
    },
    user.id,
  );

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

  const post = await toggleLike(postId, user.id);
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

  const post = await incrementShare(postId, auth?.userId ?? null);
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

  const commentSchema = z.object({
    text: z.string().min(1).max(500),
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

  const post = await addComment(postId, createComment(user, parsed.data.text), user.id);

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

  const result = await claimMission(missionId, user.id);
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

  const payload = parsed.data satisfies RegisterPayload;
  const email = sanitizeEmail(payload.email);
  const existing = await findUserByEmail(email);

  if (existing) {
    res.status(409).json({ message: 'Un compte existe déjà avec cet e-mail.' });
    return;
  }

  const user = await createUser({
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

  const { email, password } = parsed.data satisfies AuthCredentials;
  const user = await findUserByEmail(sanitizeEmail(email));

  if (!user) {
    res.status(401).json({ message: 'Identifiants incorrects.' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
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

  const token = (req as AuthedRequest).authContext?.token ?? createToken(user);
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

  const updated = await updateUser(user.id, parsed.data as UpdateProfilePayload);
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

if (existsSync(FRONTEND_INDEX)) {
  app.use(
    express.static(FRONTEND_DIST, {
      index: false,
      maxAge: '1y',
    }),
  );

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(FRONTEND_INDEX);
  });
}

async function bootstrap(): Promise<void> {
  await ensureDatabase();

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
