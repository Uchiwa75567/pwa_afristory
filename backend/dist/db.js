"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.ensureDatabase = ensureDatabase;
const pg_1 = require("pg");
const seed_data_1 = require("./seed-data");
const connectionString = process.env['DATABASE_URL'] ??
    (process.env['PGHOST'] && process.env['PGDATABASE'] && process.env['PGUSER']
        ? `postgresql://${encodeURIComponent(process.env['PGUSER'] ?? '')}:${encodeURIComponent(process.env['PGPASSWORD'] ?? '')}@${process.env['PGHOST']}:${process.env['PGPORT'] ?? '5432'}/${process.env['PGDATABASE']}`
        : undefined);
exports.pool = new pg_1.Pool({
    connectionString,
    ssl: process.env['PGSSLMODE'] === 'disable' || process.env['DATABASE_SSL'] === 'false'
        ? undefined
        : {
            rejectUnauthorized: false,
        },
});
let initialization = null;
function buildUsersInsert(users) {
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
    const values = [];
    const placeholders = users
        .map((user, index) => {
        const offset = index * columns.length;
        values.push(user.id, user.name, user.handle, user.email, user.passwordHash, user.country, user.bio, user.avatarSeed, user.avatarUrl, user.points, user.streak, user.followers, user.following, JSON.stringify(user.badges), user.joinedAt, user.updatedAt);
        return `(${columns.map((_, columnIndex) => `$${offset + columnIndex + 1}`).join(', ')})`;
    })
        .join(', ');
    return {
        text: `INSERT INTO users (${columns.join(', ')}) VALUES ${placeholders}`,
        values,
    };
}
async function seedUsersIfNeeded() {
    const result = await exports.pool.query('SELECT COUNT(*)::int AS count FROM users');
    if ((result.rows[0]?.count ?? 0) > 0) {
        return;
    }
    const users = (0, seed_data_1.createSeedUsers)();
    if (users.length === 0) {
        return;
    }
    const insert = buildUsersInsert(users);
    await exports.pool.query(insert.text, insert.values);
}
async function seedContentIfNeeded() {
    const result = await exports.pool.query('SELECT COUNT(*)::int AS count FROM app_state');
    if ((result.rows[0]?.count ?? 0) > 0) {
        return;
    }
    const users = (0, seed_data_1.createSeedUsers)();
    const snapshot = (0, seed_data_1.createSeedSnapshot)(users);
    await exports.pool.query('INSERT INTO app_state (id, payload, updated_at) VALUES ($1, $2, NOW())', ['main', JSON.stringify(snapshot)]);
}
async function ensureDatabase() {
    if (!initialization) {
        initialization = (async () => {
            await exports.pool.query('SELECT 1');
            await exports.pool.query(`
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
            await exports.pool.query(`
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
