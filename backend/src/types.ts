export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
  country: string;
}

export interface UpdateProfilePayload {
  name?: string;
  country?: string;
  bio?: string;
  avatarSeed?: string;
  avatarUrl?: string;
  points?: number;
  streak?: number;
  followers?: number;
  following?: number;
  badges?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  country: string;
  bio: string;
  avatarSeed: string;
  avatarUrl: string;
  points: number;
  streak: number;
  followers: number;
  following: number;
  badges: string[];
  joinedAt: string;
  updatedAt: string;
}

export interface UserRecord extends UserProfile {
  passwordHash: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface CommentRecord {
  author: string;
  text: string;
  time: string;
  avatarUrl?: string;
}

export interface PostRecord {
  id: string;
  author: string;
  handle: string;
  country: string;
  accent: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  shares: number;
  comments: CommentRecord[];
  likedByMe: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel?: string;
  avatarUrl?: string;
  likedByUserIds?: string[];
}

export interface StoryRecord {
  id: string;
  name: string;
  country: string;
  accent: string;
  viewed: boolean;
  meta: string;
  imageUrl: string;
}

export interface SportEventRecord {
  id: string;
  sport: string;
  phase: string;
  teams: string;
  time: string;
  venue: string;
  status: 'Live' | 'À venir' | 'Terminé';
  score: string;
  accent: string;
}

export interface MedalRowRecord {
  country: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
  accent: string;
}

export interface AthleteRecord {
  id: string;
  name: string;
  country: string;
  sport: string;
  discipline: string;
  medals: number;
  accent: string;
  imageUrl: string;
}

export interface CultureRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  accent: string;
  imageUrl: string;
}

export interface RewardMissionRecord {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  accent: string;
  completedByUserIds?: string[];
}

export interface PartnerOfferRecord {
  id: string;
  brand: string;
  description: string;
  reward: string;
  accent: string;
}

export interface PlaceRecord {
  id: string;
  name: string;
  district: string;
  category: string;
  description: string;
  hours: string;
  transit: string;
  accent: string;
  imageUrl: string;
}

export interface TrendRecord {
  label: string;
  posts: string;
}

export interface ContentSnapshot {
  stories: StoryRecord[];
  events: SportEventRecord[];
  medals: MedalRowRecord[];
  athletes: AthleteRecord[];
  cultures: CultureRecord[];
  missions: RewardMissionRecord[];
  offers: PartnerOfferRecord[];
  places: PlaceRecord[];
  trends: TrendRecord[];
  posts: PostRecord[];
}
