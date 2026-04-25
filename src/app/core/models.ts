export interface StoryItem {
  id: string;
  name: string;
  country: string;
  accent: string;
  viewed: boolean;
  meta: string;
  imageUrl: string;
}

export interface CommentItem {
  author: string;
  text: string;
  time: string;
  avatarUrl?: string;
}

export interface PostItem {
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
  comments: CommentItem[];
  likedByMe: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel?: string;
  avatarUrl?: string;
}

export interface SportEventItem {
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

export interface MedalRow {
  country: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
  accent: string;
}

export interface AthleteItem {
  id: string;
  name: string;
  country: string;
  sport: string;
  discipline: string;
  medals: number;
  accent: string;
  imageUrl: string;
}

export interface CultureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  accent: string;
  imageUrl: string;
}

export interface RewardMission {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  accent: string;
}

export interface PartnerOffer {
  id: string;
  brand: string;
  description: string;
  reward: string;
  accent: string;
}

export interface PlaceItem {
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

export interface TrendItem {
  label: string;
  posts: string;
}

export interface ContentSnapshot {
  stories: StoryItem[];
  events: SportEventItem[];
  medals: MedalRow[];
  athletes: AthleteItem[];
  cultures: CultureItem[];
  missions: RewardMission[];
  offers: PartnerOffer[];
  places: PlaceItem[];
  trends: TrendItem[];
  posts: PostItem[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
  country: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UpdateProfileInput {
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
