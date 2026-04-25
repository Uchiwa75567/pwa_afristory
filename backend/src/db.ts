import { Pool } from 'pg';
import { createSeedSnapshot, createSeedUsers } from './seed-data';
import type { ContentSnapshot, UserRecord } from './types';

const connectionString =
  process.env['DATABASE_URL'] ??
  (process.env['PGHOST'] && process.env['PGDATABASE'] && process.env['PGUSER']
    ? `postgresql://${encodeURIComponent(process.env['PGUSER'] ?? '')}:${encodeURIComponent(
        process.env['PGPASSWORD'] ?? '',
      )}@${process.env['PGHOST']}:${process.env['PGPORT'] ?? '5432'}/${process.env['PGDATABASE']}`
    : undefined);

export const pool = new Pool({
  connectionString,
  ssl:
    process.env['PGSSLMODE'] === 'disable' || process.env['DATABASE_SSL'] === 'false'
      ? undefined
      : {
          rejectUnauthorized: false,
        },
});

let initialization: Promise<void> | null = null;

function buildUsersInsert(users: UserRecord[]): {
  text: string;
  values: Array<string | number | string[]>;
} {
  const columns = [
    'id',
    'name',
    'handle',
    'email',
    'password_hash',
    'country',
    'bio',
    'avatar_seed',
    'avatar_url',
    'points',
    'streak',
    'followers',
    'following',
    'badges',
    'joined_at',
    'updated_at',
  ];

  const values: Array<string | number | string[]> = [];
  const placeholders = users
    .map((user, index) => {
      const offset = index * columns.length;
      values.push(
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
      );
      return `(${columns.map((_, columnIndex) => `$${offset + columnIndex + 1}`).join(', ')})`;
    })
    .join(', ');

  return {
    text: `INSERT INTO users (${columns.join(', ')}) VALUES ${placeholders}`,
    values,
  };
}

async function seedUsersIfNeeded(): Promise<void> {
  const result = await pool.query<{ count: number }>('SELECT COUNT(*)::int AS count FROM users');
  if ((result.rows[0]?.count ?? 0) > 0) {
    return;
  }

  const users = createSeedUsers();
  if (users.length === 0) {
    return;
  }

  const insert = buildUsersInsert(users);
  await pool.query(insert.text, insert.values);
}

async function seedContentIfNeeded(): Promise<void> {
  const result = await pool.query<{ count: number }>('SELECT COUNT(*)::int AS count FROM app_state');
  if ((result.rows[0]?.count ?? 0) > 0) {
    return;
  }

  const users = createSeedUsers();
  const snapshot: ContentSnapshot = createSeedSnapshot(users);

  await pool.query(
    'INSERT INTO app_state (id, payload, updated_at) VALUES ($1, $2, NOW())',
    ['main', JSON.stringify(snapshot)],
  );
}

export async function ensureDatabase(): Promise<void> {
  if (!initialization) {
    initialization = (async () => {
      await pool.query('SELECT 1');

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          handle TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          country TEXT NOT NULL,
          bio TEXT NOT NULL,
          avatar_seed TEXT NOT NULL,
          avatar_url TEXT NOT NULL,
          points INTEGER NOT NULL DEFAULT 0,
          streak INTEGER NOT NULL DEFAULT 0,
          followers INTEGER NOT NULL DEFAULT 0,
          following INTEGER NOT NULL DEFAULT 0,
          badges JSONB NOT NULL DEFAULT '[]'::jsonb,
          joined_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_state (
          id TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await seedUsersIfNeeded();
      await seedContentIfNeeded();
    })();
  }

  return initialization;
}
