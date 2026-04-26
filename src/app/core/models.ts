export type Tone =
  | 'orange'
  | 'navy'
  | 'gold'
  | 'green'
  | 'teal'
  | 'purple'
  | 'red'
  | 'surface';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  tone: Tone;
  exact?: boolean;
}

export interface QuickAction extends NavItem {
  subtitle: string;
}

export type ActivityAction = 'navigate' | 'toast';

export interface HomeActivity {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  tone: Tone;
  action: ActivityAction;
  route?: string;
  message?: string;
}

export interface ConnectTab {
  id: string;
  label: string;
  icon: string;
}

export interface ConnectPost {
  id: string;
  author: string;
  handle: string;
  city: string;
  language: string;
  accent: string;
  time: string;
  text: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  rewards: number;
  boosted: boolean;
  boostLabel?: string;
  likedByMe?: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel: string;
  mediaTone: Tone;
}

export interface LiveTab {
  id: string;
  label: string;
  icon: string;
}

export interface LiveProgramItem {
  id: string;
  time: string;
  icon: string;
  title: string;
  venue: string;
  badge: string;
  badgeTone: Tone;
  toast: string;
}

export interface MedalRow {
  rank: number;
  country: string;
  code: string;
  flag?: string;
  gold: number;
  silver: number;
  bronze: number;
  accent: string;
  highlighted?: boolean;
  toast: string;
}

export interface JambaarMission {
  id: string;
  icon: string;
  title: string;
  description: string;
  points: number;
  fcfa: number;
  peopleTouched: number;
  accent: string;
  done: boolean;
  toast: string;
}

export interface MarketTab {
  id: string;
  label: string;
}

export interface FeaturedArtisan {
  name: string;
  role: string;
  location: string;
  sales: number;
  rating: number;
  badge: string;
  accent: string;
  icon: string;
  toast: string;
}

export interface MarketProduct {
  id: string;
  icon: string;
  name: string;
  category: string;
  price: number;
  tone: Tone;
  accent: string;
  certified: boolean;
  paymentNote: string;
  toast: string;
}

export interface HeritageCard {
  id: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  tone: Tone;
  toast: string;
}

export interface AppSnapshot {
  points: number;
  missionsDone: number;
  peopleTouched: number;
  connectPosts: ConnectPost[];
  jambaarMissions: JambaarMission[];
  activityFeed: HomeActivity[];
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  country: string;
  points: number;
  streak: number;
  followers: number;
  following: number;
  badges: string[];
  avatarUrl?: string;
  bio?: string;
  email?: string;
  [key: string]: unknown;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  country: string;
}

export type UpdateProfileInput = Partial<UserProfile>;

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface PostComment {
  author: string;
  text: string;
  time: string;
  avatarUrl?: string;
  [key: string]: unknown;
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
  comments: PostComment[];
  likedByMe?: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface StoryItem {
  id: string;
  name: string;
  country: string;
  meta: string;
  accent: string;
  imageUrl?: string;
  viewed?: boolean;
  [key: string]: unknown;
}

export interface TrendItem {
  label: string;
  posts: string;
  [key: string]: unknown;
}

export interface SportEventItem {
  id: string;
  status: string;
  sport: string;
  phase: string;
  score: string;
  teams: string;
  time: string;
  venue: string;
  target?: string;
  [key: string]: unknown;
}

export interface AthleteItem {
  id: string;
  imageUrl?: string;
  name: string;
  country: string;
  sport: string;
  discipline: string;
  medals: number;
  accent?: string;
  [key: string]: unknown;
}

export interface CultureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  accent: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface RewardMission {
  id: string;
  title: string;
  description: string;
  points: number;
  accent: string;
  completed: boolean;
  reward?: string;
  [key: string]: unknown;
}

export interface PartnerOffer {
  id: string;
  brand: string;
  description: string;
  reward: string;
  accent: string;
  [key: string]: unknown;
}

export interface PlaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  district: string;
  hours: string;
  transit: string;
  accent: string;
  [key: string]: unknown;
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
