import { randomUUID } from 'node:crypto';
import { ensureDatabase, pool } from './db';
import type {
  CommentRecord,
  ContentSnapshot,
  PostRecord,
  RewardMissionRecord,
  UserRecord,
} from './types';

interface InternalPost extends PostRecord {
  likedByUserIds?: string[];
}

interface InternalMission extends RewardMissionRecord {
  completedByUserIds?: string[];
}

interface InternalContentSnapshot extends Omit<ContentSnapshot, 'posts' | 'missions'> {
  posts: InternalPost[];
  missions: InternalMission[];
}

interface ContentMutationResult<T> {
  item: T;
  awardedPoints?: number;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function getStatePayload(state: unknown): InternalContentSnapshot {
  const payload = state as InternalContentSnapshot | undefined;
  return {
    stories: Array.isArray(payload?.stories) ? payload!.stories : [],
    events: Array.isArray(payload?.events) ? payload!.events : [],
    medals: Array.isArray(payload?.medals) ? payload!.medals : [],
    athletes: Array.isArray(payload?.athletes) ? payload!.athletes : [],
    cultures: Array.isArray(payload?.cultures) ? payload!.cultures : [],
    missions: Array.isArray(payload?.missions) ? payload!.missions : [],
    offers: Array.isArray(payload?.offers) ? payload!.offers : [],
    places: Array.isArray(payload?.places) ? payload!.places : [],
    trends: Array.isArray(payload?.trends) ? payload!.trends : [],
    posts: Array.isArray(payload?.posts) ? payload!.posts : [],
  };
}

async function readState(): Promise<InternalContentSnapshot> {
  await ensureDatabase();
  const result = await pool.query<{ payload: unknown }>(
    'SELECT payload FROM app_state WHERE id = $1 LIMIT 1',
    ['main'],
  );

  if (!result.rows[0]) {
    throw new Error('Snapshot de contenu introuvable.');
  }

  return getStatePayload(result.rows[0].payload);
}

async function writeState(state: InternalContentSnapshot): Promise<void> {
  await ensureDatabase();
  await pool.query(
    'UPDATE app_state SET payload = $2, updated_at = NOW() WHERE id = $1',
    ['main', JSON.stringify(state)],
  );
}

function projectPost(post: InternalPost, userId: string | null): PostRecord {
  const likedByMe = userId ? Boolean(post.likedByUserIds?.includes(userId)) : false;
  const { likedByUserIds: _likedByUserIds, ...publicPost } = post;
  return {
    ...publicPost,
    likedByMe,
  };
}

function projectMission(mission: InternalMission, userId: string | null): RewardMissionRecord {
  const completed = userId ? Boolean(mission.completedByUserIds?.includes(userId)) : false;
  const { completedByUserIds: _completedByUserIds, ...publicMission } = mission;
  return {
    ...publicMission,
    completed,
  };
}

function projectSnapshot(state: InternalContentSnapshot, userId: string | null): ContentSnapshot {
  return {
    stories: clone(state.stories),
    events: clone(state.events),
    medals: clone(state.medals),
    athletes: clone(state.athletes),
    cultures: clone(state.cultures),
    missions: state.missions.map((mission) => projectMission(mission, userId)),
    offers: clone(state.offers),
    places: clone(state.places),
    trends: clone(state.trends),
    posts: state.posts.map((post) => projectPost(post, userId)),
  };
}

function createPostRecord(input: {
  author: string;
  handle: string;
  country: string;
  accent: string;
  content: string;
  tags: string[];
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel?: string;
  avatarUrl: string;
}): InternalPost {
  return {
    id: `post-${randomUUID()}`,
    author: input.author,
    handle: input.handle,
    country: input.country,
    accent: input.accent,
    time: 'À l’instant',
    content: input.content.trim(),
    tags: input.tags,
    likes: 0,
    shares: 0,
    comments: [],
    likedByMe: false,
    mediaType: input.mediaType,
    mediaUrl: input.mediaUrl,
    mediaLabel: input.mediaLabel,
    avatarUrl: input.avatarUrl,
    likedByUserIds: [],
  };
}

export async function getContentSnapshot(userId: string | null): Promise<ContentSnapshot> {
  const state = await readState();
  return projectSnapshot(state, userId);
}

export async function createPost(input: {
  author: string;
  handle: string;
  country: string;
  accent: string;
  content: string;
  tags: string[];
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel?: string;
  avatarUrl: string;
}, userId: string | null): Promise<PostRecord> {
  const state = await readState();
  const post = createPostRecord(input);

  state.posts = [post, ...state.posts];
  await writeState(state);

  return projectPost(post, userId);
}

export async function toggleLike(
  postId: string,
  userId: string,
): Promise<PostRecord | undefined> {
  const state = await readState();
  const index = state.posts.findIndex((post) => post.id === postId);
  if (index < 0) {
    return undefined;
  }

  const post = state.posts[index];
  const likedByUserIds = new Set(post.likedByUserIds ?? []);
  if (likedByUserIds.has(userId)) {
    likedByUserIds.delete(userId);
    post.likes = Math.max(post.likes - 1, 0);
  } else {
    likedByUserIds.add(userId);
    post.likes += 1;
  }

  post.likedByUserIds = [...likedByUserIds];
  state.posts[index] = post;
  await writeState(state);

  return projectPost(post, userId);
}

export async function incrementShare(postId: string, userId: string | null): Promise<PostRecord | undefined> {
  const state = await readState();
  const index = state.posts.findIndex((post) => post.id === postId);
  if (index < 0) {
    return undefined;
  }

  const post = state.posts[index];
  post.shares += 1;
  state.posts[index] = post;
  await writeState(state);

  return projectPost(post, userId);
}

export async function addComment(
  postId: string,
  comment: CommentRecord,
  userId: string | null,
): Promise<PostRecord | undefined> {
  const state = await readState();
  const index = state.posts.findIndex((post) => post.id === postId);
  if (index < 0) {
    return undefined;
  }

  const post = state.posts[index];
  post.comments = [comment, ...post.comments];
  state.posts[index] = post;
  await writeState(state);

  return projectPost(post, userId);
}

export async function claimMission(
  missionId: string,
  userId: string,
): Promise<ContentMutationResult<RewardMissionRecord> | undefined> {
  const state = await readState();
  const index = state.missions.findIndex((mission) => mission.id === missionId);
  if (index < 0) {
    return undefined;
  }

  const mission = state.missions[index];
  const completedByUserIds = new Set(mission.completedByUserIds ?? []);
  if (completedByUserIds.has(userId)) {
    return {
      item: projectMission(mission, userId),
      awardedPoints: 0,
    };
  }

  completedByUserIds.add(userId);
  mission.completedByUserIds = [...completedByUserIds];
  state.missions[index] = mission;
  await writeState(state);

  return {
    item: projectMission(mission, userId),
    awardedPoints: mission.points,
  };
}

export async function resetContent(): Promise<void> {
  throw new Error('Reset complet non exposé par l’API.');
}

export function createComment(author: UserRecord, text: string): CommentRecord {
  return {
    author: author.name,
    text: text.trim(),
    time: 'À l’instant',
    avatarUrl: author.avatarUrl,
  };
}
