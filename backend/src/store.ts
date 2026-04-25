import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import type { QueryResultRow } from 'pg';
import { ensureDatabase, pool } from './db';
import type { RegisterPayload, UpdateProfilePayload, UserProfile, UserRecord } from './types';

interface UserRow extends QueryResultRow {
  id: string;
  name: string;
  handle: string;
  email: string;
  password_hash: string;
  country: string;
  bio: string;
  avatar_seed: string;
  avatar_url: string;
  points: number;
  streak: number;
  followers: number;
  following: number;
  badges: string[];
  joined_at: string;
  updated_at: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '')
    .slice(0, 24);
}

function createHandle(name: string): string {
  return `@${slugify(name) || 'afristory'}`;
}

function createAvatarUrl(seed: string): string {
  return `https://i.pravatar.cc/320?u=${encodeURIComponent(seed || 'afristory')}`;
}

function normalizeUser(row: UserRow): UserRecord {
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

function createPublicUser(user: UserRecord): UserProfile {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

async function readUsersQuery<T extends QueryResultRow>(queryText: string, values: unknown[]): Promise<T[]> {
  await ensureDatabase();
  const result = await pool.query<T>(queryText, values);
  return result.rows;
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const rows = await readUsersQuery<UserRow>(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email.toLowerCase()],
  );

  return rows[0] ? normalizeUser(rows[0]) : undefined;
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  const rows = await readUsersQuery<UserRow>(
    'SELECT * FROM users WHERE id = $1 LIMIT 1',
    [id],
  );

  return rows[0] ? normalizeUser(rows[0]) : undefined;
}

export async function createUser(payload: RegisterPayload): Promise<UserRecord> {
  await ensureDatabase();

  const now = new Date().toISOString();
  const user: UserRecord = {
    id: randomUUID(),
    name: payload.name.trim(),
    handle: createHandle(payload.name),
    email: payload.email.toLowerCase(),
    passwordHash: await bcrypt.hash(payload.password, 10),
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

  await pool.query(
    `
      INSERT INTO users (
        id, name, handle, email, password_hash, country, bio, avatar_seed, avatar_url,
        points, streak, followers, following, badges, joined_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16
      )
    `,
    [
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
    ],
  );

  return user;
}

export async function updateUser(id: string, patch: UpdateProfilePayload): Promise<UserRecord | undefined> {
  await ensureDatabase();

  const current = await findUserById(id);
  if (!current) {
    return undefined;
  }

  const nextName = patch.name?.trim() || current.name;
  const nextUser: UserRecord = {
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

  await pool.query(
    `
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
    `,
    [
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
    ],
  );

  return nextUser;
}

export function toPublicUser(user: UserRecord): UserProfile {
  return createPublicUser(user);
}
