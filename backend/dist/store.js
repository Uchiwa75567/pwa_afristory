"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.toPublicUser = toPublicUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = require("node:crypto");
const db_1 = require("./db");
function slugify(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/(^\.|\.$)/g, '')
        .slice(0, 24);
}
function createHandle(name) {
    return `@${slugify(name) || 'afristory'}`;
}
function createAvatarUrl(seed) {
    return `https://i.pravatar.cc/320?u=${encodeURIComponent(seed || 'afristory')}`;
}
function normalizeUser(row) {
    return {
        id: row.id,
        name: row.name,
        handle: row.handle,
        email: row.email,
        passwordHash: row.password_hash,
        country: row.country,
        bio: row.bio,
        avatarSeed: row.avatar_seed,
        avatarUrl: row.avatar_url,
        points: row.points,
        streak: row.streak,
        followers: row.followers,
        following: row.following,
        badges: Array.isArray(row.badges) ? row.badges : [],
        joinedAt: row.joined_at,
        updatedAt: row.updated_at,
    };
}
function createPublicUser(user) {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
}
async function readUsersQuery(queryText, values) {
    await (0, db_1.ensureDatabase)();
    const result = await db_1.pool.query(queryText, values);
    return result.rows;
}
async function findUserByEmail(email) {
    const rows = await readUsersQuery('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase()]);
    return rows[0] ? normalizeUser(rows[0]) : undefined;
}
async function findUserById(id) {
    const rows = await readUsersQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return rows[0] ? normalizeUser(rows[0]) : undefined;
}
async function createUser(payload) {
    await (0, db_1.ensureDatabase)();
    const now = new Date().toISOString();
    const user = {
        id: (0, node_crypto_1.randomUUID)(),
        name: payload.name.trim(),
        handle: createHandle(payload.name),
        email: payload.email.toLowerCase(),
        passwordHash: await bcryptjs_1.default.hash(payload.password, 10),
        country: payload.country.trim(),
        bio: 'Bienvenue sur AFRISTORY. Partagez, explorez et gagnez des points autour des JOJ Dakar 2026.',
        avatarSeed: payload.name.trim(),
        avatarUrl: createAvatarUrl(payload.name.trim()),
        points: 120,
        streak: 1,
        followers: 42,
        following: 18,
        badges: ['Nouveau membre', 'Explorateur'],
        joinedAt: now,
        updatedAt: now,
    };
    await db_1.pool.query(`
      INSERT INTO users (
        id, name, handle, email, password_hash, country, bio, avatar_seed, avatar_url,
        points, streak, followers, following, badges, joined_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16
      )
    `, [
        user.id,
        user.name,
        user.handle,
        user.email,
        user.passwordHash,
        user.country,
        user.bio,
        user.avatarSeed,
        user.avatarUrl,
        user.points,
        user.streak,
        user.followers,
        user.following,
        JSON.stringify(user.badges),
        user.joinedAt,
        user.updatedAt,
    ]);
    return user;
}
async function updateUser(id, patch) {
    await (0, db_1.ensureDatabase)();
    const current = await findUserById(id);
    if (!current) {
        return undefined;
    }
    const nextName = patch.name?.trim() || current.name;
    const nextUser = {
        ...current,
        name: nextName,
        handle: patch.name ? createHandle(nextName) : current.handle,
        country: patch.country?.trim() || current.country,
        bio: patch.bio?.trim() || current.bio,
        avatarSeed: patch.avatarSeed?.trim() || nextName,
        avatarUrl: patch.avatarUrl?.trim() || current.avatarUrl || createAvatarUrl(patch.avatarSeed?.trim() || nextName),
        points: typeof patch.points === 'number' ? patch.points : current.points,
        streak: typeof patch.streak === 'number' ? patch.streak : current.streak,
        followers: typeof patch.followers === 'number' ? patch.followers : current.followers,
        following: typeof patch.following === 'number' ? patch.following : current.following,
        badges: Array.isArray(patch.badges) && patch.badges.length > 0 ? patch.badges : current.badges,
        updatedAt: new Date().toISOString(),
    };
    await db_1.pool.query(`
      UPDATE users
      SET
        name = $2,
        handle = $3,
        country = $4,
        bio = $5,
        avatar_seed = $6,
        avatar_url = $7,
        points = $8,
        streak = $9,
        followers = $10,
        following = $11,
        badges = $12,
        updated_at = $13
      WHERE id = $1
    `, [
        nextUser.id,
        nextUser.name,
        nextUser.handle,
        nextUser.country,
        nextUser.bio,
        nextUser.avatarSeed,
        nextUser.avatarUrl,
        nextUser.points,
        nextUser.streak,
        nextUser.followers,
        nextUser.following,
        JSON.stringify(nextUser.badges),
        nextUser.updatedAt,
    ]);
    return nextUser;
}
function toPublicUser(user) {
    return createPublicUser(user);
}
