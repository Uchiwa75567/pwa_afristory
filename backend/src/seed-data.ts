import bcrypt from 'bcryptjs';
import type {
  AthleteRecord,
  ContentSnapshot,
  CultureRecord,
  MedalRowRecord,
  PartnerOfferRecord,
  PlaceRecord,
  PostRecord,
  RewardMissionRecord,
  SportEventRecord,
  StoryRecord,
  TrendRecord,
  UserRecord,
} from './types';

export const demoPassword = 'AfriStory2026!';

const portraitUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=320&q=80',
];

const coverUrls = [
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524492449090-1f5f6a1a86d9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
];

const baseTime = new Date().toISOString();
const demoPasswordHash = bcrypt.hashSync(demoPassword, 10);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '')
    .slice(0, 24);
}

function createAvatarUrl(index: number): string {
  return portraitUrls[index % portraitUrls.length];
}

function createCoverUrl(index: number): string {
  return coverUrls[index % coverUrls.length];
}

function buildUser(profile: {
  id: string;
  name: string;
  email: string;
  country: string;
  bio: string;
  points: number;
  streak: number;
  followers: number;
  following: number;
  badges: string[];
  avatarIndex: number;
}): UserRecord {
  return {
    ...profile,
    handle: `@${slugify(profile.name) || 'afristory'}`,
    passwordHash: demoPasswordHash,
    avatarSeed: profile.name,
    avatarUrl: createAvatarUrl(profile.avatarIndex),
    joinedAt: baseTime,
    updatedAt: baseTime,
  };
}

export function createSeedUsers(): UserRecord[] {
  return [
    buildUser({
      id: 'user-awa-diop',
      name: 'Awa Diop',
      email: 'demo@afristory.app',
      country: 'Sénégal',
      bio: 'Supporter JOJ Dakar 2026, créatrice de contenu et ambassadrice de la culture africaine.',
      points: 320,
      streak: 7,
      followers: 1240,
      following: 168,
      badges: ['Ambassadeur JOJ', 'Explorateur Dakar', 'Créateur actif'],
      avatarIndex: 0,
    }),
    buildUser({
      id: 'user-ibrahima-ba',
      name: 'Ibrahima Ba',
      email: 'ibrahima.ba@afristory.app',
      country: 'Sénégal',
      bio: 'Photographe terrain, il couvre les épreuves et les coulisses du stade.',
      points: 280,
      streak: 4,
      followers: 860,
      following: 104,
      badges: ['Terrain', 'Storyteller'],
      avatarIndex: 1,
    }),
    buildUser({
      id: 'user-nia-mensah',
      name: 'Nia Mensah',
      email: 'nia.mensah@afristory.app',
      country: 'Ghana',
      bio: 'Curatrice food et musique, elle relie saveurs et rythmes du continent.',
      points: 412,
      streak: 11,
      followers: 1980,
      following: 288,
      badges: ['Curatrice', 'Culture pop', 'Top voice'],
      avatarIndex: 2,
    }),
    buildUser({
      id: 'user-youssouf-keita',
      name: 'Youssouf Keita',
      email: 'youssouf.keita@afristory.app',
      country: 'Mali',
      bio: 'Ancien judoka, il anime les débats sur la discipline et les performances.',
      points: 196,
      streak: 3,
      followers: 530,
      following: 90,
      badges: ['Sport focus'],
      avatarIndex: 3,
    }),
    buildUser({
      id: 'user-mariam-kone',
      name: 'Mariam Koné',
      email: 'mariam.kone@afristory.app',
      country: "Côte d'Ivoire",
      bio: 'Styliste digitale, elle transforme les couleurs du continent en contenu visuel.',
      points: 355,
      streak: 6,
      followers: 1710,
      following: 210,
      badges: ['Design', 'Moodboard'],
      avatarIndex: 4,
    }),
    buildUser({
      id: 'user-amara-diallo',
      name: 'Amara Diallo',
      email: 'amara.diallo@afristory.app',
      country: 'Mali',
      bio: 'Coordinateur communauté, il réagit vite aux tendances et aux besoins des membres.',
      points: 265,
      streak: 5,
      followers: 940,
      following: 134,
      badges: ['Community'],
      avatarIndex: 5,
    }),
    buildUser({
      id: 'user-fatou-ndiaye',
      name: 'Fatou Ndiaye',
      email: 'fatou.ndiaye@afristory.app',
      country: 'Sénégal',
      bio: 'Journaliste mobile-first, elle aime les formats courts et les données utiles.',
      points: 388,
      streak: 9,
      followers: 1520,
      following: 190,
      badges: ['Journalisme', 'Data'],
      avatarIndex: 6,
    }),
    buildUser({
      id: 'user-salif-traore',
      name: 'Salif Traoré',
      email: 'salif.traore@afristory.app',
      country: 'Burkina Faso',
      bio: 'Créateur vidéo, il couvre les coulisses, les déplacements et les rencontres.',
      points: 240,
      streak: 2,
      followers: 610,
      following: 78,
      badges: ['Video', 'Mobile'],
      avatarIndex: 7,
    }),
  ];
}

function makeComment(author: string, text: string, time: string, avatarUrl: string) {
  return { author, text, time, avatarUrl };
}

function makePost(post: Omit<PostRecord, 'likedByMe' | 'comments'> & {
  likes: number;
  shares: number;
  comments: Array<{ author: string; text: string; time: string; avatarUrl: string }>;
  likedByUserIds?: string[];
}): PostRecord {
  return {
    ...post,
    likedByMe: false,
    comments: post.comments,
    likedByUserIds: post.likedByUserIds ?? [],
  };
}

export function createSeedSnapshot(users: UserRecord[]): ContentSnapshot {
  const demoUser = users[0];
  const userByName = new Map(users.map((user) => [user.name, user]));

  const stories: StoryRecord[] = [
    {
      id: 'story-1',
      name: 'Team Sénégal',
      country: 'Sénégal',
      accent: '#ffb84d',
      viewed: false,
      meta: 'Athlétisme',
      imageUrl: createCoverUrl(0),
    },
    {
      id: 'story-2',
      name: 'JOJ Vibes',
      country: 'Dakar',
      accent: '#47d1a4',
      viewed: false,
      meta: 'Highlights',
      imageUrl: createCoverUrl(1),
    },
    {
      id: 'story-3',
      name: 'Nairobi Motion',
      country: 'Kenya',
      accent: '#6ea8fe',
      viewed: true,
      meta: 'Culture',
      imageUrl: createCoverUrl(2),
    },
    {
      id: 'story-4',
      name: 'Abidjan Beats',
      country: "Côte d'Ivoire",
      accent: '#ff6b8b',
      viewed: false,
      meta: 'Music',
      imageUrl: createCoverUrl(3),
    },
    {
      id: 'story-5',
      name: 'Casablanca Craft',
      country: 'Maroc',
      accent: '#9b8cff',
      viewed: true,
      meta: 'Artisanat',
      imageUrl: createCoverUrl(4),
    },
    {
      id: 'story-6',
      name: 'Lagos Energy',
      country: 'Nigeria',
      accent: '#ff8f4d',
      viewed: false,
      meta: 'Communauté',
      imageUrl: createCoverUrl(5),
    },
    {
      id: 'story-7',
      name: 'Arena Pulse',
      country: 'Diamniadio',
      accent: '#00a859',
      viewed: false,
      meta: 'Live',
      imageUrl: createCoverUrl(6),
    },
    {
      id: 'story-8',
      name: 'Dakar Walks',
      country: 'Sénégal',
      accent: '#ffc800',
      viewed: true,
      meta: 'Explorer',
      imageUrl: createCoverUrl(7),
    },
  ];

  const events: SportEventRecord[] = [
    { id: 'event-1', sport: 'Athlétisme', phase: 'Finale 100m', teams: 'SEN vs RSA', time: '19:40', venue: 'Stade de Diamniadio', status: 'Live', score: '10.32 - 10.36', accent: '#ffb84d' },
    { id: 'event-2', sport: 'Basket 3x3', phase: 'Demi-finale', teams: 'KEN vs CIV', time: '20:10', venue: 'Arena Dakar', status: 'À venir', score: '22 min', accent: '#47d1a4' },
    { id: 'event-3', sport: 'Natation', phase: 'Séries 200m', teams: 'Group A', time: '18:20', venue: 'Piscine olympique', status: 'Terminé', score: '1:55.13', accent: '#6ea8fe' },
    { id: 'event-4', sport: 'Judo', phase: 'Quarts de finale', teams: 'MLI vs TUN', time: '21:00', venue: 'Arena Dakar', status: 'À venir', score: '4 combats', accent: '#ff6b8b' },
    { id: 'event-5', sport: 'Football', phase: 'Phase de groupes', teams: 'SEN vs GHA', time: '21:45', venue: 'Stade Lat-Dior', status: 'Live', score: '1-0', accent: '#9b8cff' },
  ];

  const medals: MedalRowRecord[] = [
    { country: 'Sénégal', flag: '🇸🇳', gold: 6, silver: 4, bronze: 3, accent: '#ffb84d' },
    { country: 'Égypte', flag: '🇪🇬', gold: 5, silver: 5, bronze: 2, accent: '#47d1a4' },
    { country: 'Afrique du Sud', flag: '🇿🇦', gold: 4, silver: 3, bronze: 5, accent: '#6ea8fe' },
    { country: 'Kenya', flag: '🇰🇪', gold: 3, silver: 4, bronze: 2, accent: '#ff6b8b' },
    { country: 'Maroc', flag: '🇲🇦', gold: 2, silver: 3, bronze: 4, accent: '#9b8cff' },
    { country: 'Nigeria', flag: '🇳🇬', gold: 2, silver: 2, bronze: 3, accent: '#ff8f4d' },
  ];

  const athletes: AthleteRecord[] = [
    {
      id: 'ath-1',
      name: 'Awa Diop',
      country: 'Sénégal',
      sport: 'Athlétisme',
      discipline: 'Sprint',
      medals: 3,
      accent: '#ffb84d',
      imageUrl: userByName.get('Awa Diop')?.avatarUrl ?? createAvatarUrl(0),
    },
    {
      id: 'ath-2',
      name: 'Nia Mensah',
      country: 'Ghana',
      sport: 'Natation',
      discipline: 'Papillon',
      medals: 2,
      accent: '#47d1a4',
      imageUrl: userByName.get('Nia Mensah')?.avatarUrl ?? createAvatarUrl(2),
    },
    {
      id: 'ath-3',
      name: 'Youssouf Keita',
      country: 'Mali',
      sport: 'Judo',
      discipline: '-66kg',
      medals: 1,
      accent: '#6ea8fe',
      imageUrl: userByName.get('Youssouf Keita')?.avatarUrl ?? createAvatarUrl(3),
    },
    {
      id: 'ath-4',
      name: 'Maya Ndlovu',
      country: 'Afrique du Sud',
      sport: 'Basket 3x3',
      discipline: 'Playmaker',
      medals: 4,
      accent: '#ff6b8b',
      imageUrl: createAvatarUrl(4),
    },
    {
      id: 'ath-5',
      name: 'Moussa Cisse',
      country: 'Sénégal',
      sport: 'Boxe',
      discipline: 'Mi-lourd',
      medals: 2,
      accent: '#9b8cff',
      imageUrl: createAvatarUrl(5),
    },
    {
      id: 'ath-6',
      name: 'Amina Hassan',
      country: 'Égypte',
      sport: 'Taekwondo',
      discipline: '-57kg',
      medals: 3,
      accent: '#00a859',
      imageUrl: createAvatarUrl(6),
    },
  ];

  const cultures: CultureRecord[] = [
    {
      id: 'culture-1',
      title: 'Langues vivantes',
      category: 'Paroles',
      description: 'Découvre des salutations en wolof, swahili, bambara et lingala.',
      accent: '#ffb84d',
      imageUrl: createCoverUrl(8),
    },
    {
      id: 'culture-2',
      title: 'Cuisine de rue',
      category: 'Saveurs',
      description: 'Thiéboudienne, jollof, injera, couscous et boissons locales.',
      accent: '#47d1a4',
      imageUrl: createCoverUrl(9),
    },
    {
      id: 'culture-3',
      title: 'Rythmes urbains',
      category: 'Musique',
      description: 'Afrobeats, mbalax, amapiano et fusion moderne du continent.',
      accent: '#6ea8fe',
      imageUrl: createCoverUrl(10),
    },
    {
      id: 'culture-4',
      title: 'Artisanat d’avenir',
      category: 'Création',
      description: 'Textiles, cuir, bijoux et design numérique inspirés du patrimoine.',
      accent: '#ff6b8b',
      imageUrl: createCoverUrl(11),
    },
    {
      id: 'culture-5',
      title: 'Tourisme Dakar',
      category: 'Explorer',
      description: 'Monuments, plages, îles et quartiers à vivre pendant les JOJ.',
      accent: '#9b8cff',
      imageUrl: createCoverUrl(4),
    },
    {
      id: 'culture-6',
      title: 'Histoires inspirantes',
      category: 'Mémoire',
      description: 'Jeunes talents, champions et figures qui font avancer le continent.',
      accent: '#ff8f4d',
      imageUrl: createCoverUrl(5),
    },
  ];

  const missions: RewardMissionRecord[] = [
    {
      id: 'reward-1',
      title: 'Connexion quotidienne',
      description: 'Reviens chaque jour pour faire grimper ton streak.',
      points: 50,
      completed: true,
      accent: '#ffb84d',
      completedByUserIds: [demoUser.id],
    },
    {
      id: 'reward-2',
      title: 'Publier un contenu',
      description: 'Partage une photo, un texte ou une vidéo sur ton fil.',
      points: 100,
      completed: false,
      accent: '#47d1a4',
      completedByUserIds: [],
    },
    {
      id: 'reward-3',
      title: 'Inviter un ami',
      description: 'Fais grandir la communauté AFRISTORY.',
      points: 150,
      completed: false,
      accent: '#6ea8fe',
      completedByUserIds: [],
    },
    {
      id: 'reward-4',
      title: 'Défi culturel',
      description: 'Découvre un contenu culturel et garde ton rythme.',
      points: 80,
      completed: true,
      accent: '#ff6b8b',
      completedByUserIds: [demoUser.id],
    },
    {
      id: 'reward-5',
      title: 'Story du jour',
      description: 'Regarde les stories du jour et interagis avec la communauté.',
      points: 40,
      completed: false,
      accent: '#9b8cff',
      completedByUserIds: [],
    },
  ];

  const offers: PartnerOfferRecord[] = [
    { id: 'offer-1', brand: 'Orange Money', description: 'Cashback sur les défis de la semaine.', reward: '5% de cashback', accent: '#ffb84d' },
    { id: 'offer-2', brand: 'Air Afrique', description: 'Remise sur les trajets vers Dakar et les sites JOJ.', reward: 'Jusqu’à -20%', accent: '#47d1a4' },
    { id: 'offer-3', brand: 'Mboa Food', description: 'Menus culturels partenaires dans les villes hôtes.', reward: 'Boisson offerte', accent: '#6ea8fe' },
    { id: 'offer-4', brand: 'Dakar Ride', description: 'Crédit mobilité pour rejoindre les sites sportifs.', reward: 'Trajet offert', accent: '#ff6b8b' },
  ];

  const places: PlaceRecord[] = [
    {
      id: 'place-1',
      name: 'Stade de Diamniadio',
      district: 'Diamniadio',
      category: 'Sport',
      description: 'Lieu central des grandes affiches et cérémonies JOJ.',
      hours: '08:00 - 23:00',
      transit: 'Train TER + navettes',
      accent: '#ffb84d',
      imageUrl: createCoverUrl(0),
    },
    {
      id: 'place-2',
      name: 'Monument de la Renaissance',
      district: 'Ouakam',
      category: 'Culture',
      description: 'Point de vue iconique et symbole fort de Dakar.',
      hours: '09:00 - 20:00',
      transit: 'Taxi / bus',
      accent: '#47d1a4',
      imageUrl: createCoverUrl(1),
    },
    {
      id: 'place-3',
      name: 'Lac Rose',
      district: 'Rufisque',
      category: 'Tourisme',
      description: 'Escapade naturelle à intégrer dans les parcours visiteurs.',
      hours: '06:00 - 18:00',
      transit: 'Navettes touristiques',
      accent: '#6ea8fe',
      imageUrl: createCoverUrl(2),
    },
    {
      id: 'place-4',
      name: 'Arena Dakar',
      district: 'Yoff',
      category: 'Sport',
      description: 'Basket, danse et événements communautaires au programme.',
      hours: '10:00 - 22:00',
      transit: 'Bus rapides',
      accent: '#ff6b8b',
      imageUrl: createCoverUrl(3),
    },
    {
      id: 'place-5',
      name: 'Village culture',
      district: 'Plateau',
      category: 'Culture',
      description: 'Expos, concerts et ateliers créatifs pour tous.',
      hours: '10:00 - 21:00',
      transit: 'À pied / taxi',
      accent: '#9b8cff',
      imageUrl: createCoverUrl(4),
    },
    {
      id: 'place-6',
      name: 'Corniche Ouest',
      district: 'Corniche',
      category: 'Tourisme',
      description: 'Promenade, restaurants et spots photo au bord de l’océan.',
      hours: 'Libre',
      transit: 'Taxi / marche',
      accent: '#ff8f4d',
      imageUrl: createCoverUrl(5),
    },
    {
      id: 'place-7',
      name: 'Marché Kermel',
      district: 'Plateau',
      category: 'Tourisme',
      description: 'Couleurs locales, artisanat et produits frais au coeur de la ville.',
      hours: '08:00 - 19:00',
      transit: 'Taxi / marche',
      accent: '#00a859',
      imageUrl: createCoverUrl(6),
    },
    {
      id: 'place-8',
      name: 'Maison des Arts',
      district: 'Mermoz',
      category: 'Culture',
      description: 'Expositions, performances et ateliers créatifs.',
      hours: '09:00 - 18:30',
      transit: 'Bus / taxi',
      accent: '#ffc800',
      imageUrl: createCoverUrl(7),
    },
  ];

  const trends: TrendRecord[] = [
    { label: '#JOJDakar2026', posts: '12.4K posts' },
    { label: '#CultureAfricaine', posts: '8.1K posts' },
    { label: '#TeamSénégal', posts: '5.7K posts' },
    { label: '#DakarExplorer', posts: '3.3K posts' },
    { label: '#PanAfrican', posts: '2.1K posts' },
  ];

  const posts: PostRecord[] = [
    makePost({
      id: 'post-1',
      author: 'Awa Diop',
      handle: '@awa.dakar',
      country: 'Sénégal',
      accent: '#ffb84d',
      time: 'il y a 2 min',
      content: 'Première médaille pour la piste de Diamniadio ! L’ambiance est incroyable et toute la ville vibre au rythme des JOJ Dakar 2026.',
      tags: ['#JOJDakar2026', '#Athlétisme', '#TeamSénégal'],
      likes: 324,
      shares: 41,
      comments: [
        makeComment('Nadia', 'Quelle énergie !', '1 min', createAvatarUrl(2)),
        makeComment('Moussa', 'On continue comme ça 🇸🇳', '45 s', createAvatarUrl(5)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(0),
      mediaLabel: 'Sprint final',
      avatarUrl: userByName.get('Awa Diop')?.avatarUrl ?? createAvatarUrl(0),
      likedByUserIds: [demoUser.id, 'user-nia-mensah'],
    }),
    makePost({
      id: 'post-2',
      author: 'Nia Mensah',
      handle: '@niaflow',
      country: 'Ghana',
      accent: '#47d1a4',
      time: 'il y a 18 min',
      content: 'La culture est aussi une victoire. Les stands de cuisine africaine et les performances live créent une expérience inoubliable.',
      tags: ['#CultureAfricaine', '#Food', '#LiveExperience'],
      likes: 198,
      shares: 26,
      comments: [
        makeComment('Koffi', 'Le jollof est incontournable.', '10 min', createAvatarUrl(3)),
        makeComment('Mariam', 'Les couleurs du stand sont incroyables.', '4 min', createAvatarUrl(4)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(3),
      mediaLabel: 'Saveurs du continent',
      avatarUrl: userByName.get('Nia Mensah')?.avatarUrl ?? createAvatarUrl(2),
      likedByUserIds: ['user-mariam-kone'],
    }),
    makePost({
      id: 'post-3',
      author: 'Maya Ndlovu',
      handle: '@maya.moves',
      country: 'Afrique du Sud',
      accent: '#6ea8fe',
      time: 'il y a 1 h',
      content: 'Je viens de débloquer mon premier badge AFRISTORY en participant à trois défis d’affilée. Le système de récompenses rend tout plus fun !',
      tags: ['#Rewards', '#Streak', '#Community'],
      likes: 146,
      shares: 18,
      comments: [
        makeComment('Aminata', 'Le badge est superbe.', '35 min', createAvatarUrl(6)),
        makeComment('Youssouf', 'J’y vais aussi.', '22 min', createAvatarUrl(3)),
      ],
      mediaType: 'video',
      mediaLabel: 'Challenge récompense',
      avatarUrl: createAvatarUrl(4),
      likedByUserIds: [demoUser.id],
    }),
    makePost({
      id: 'post-4',
      author: 'Youssouf Keita',
      handle: '@keita.km',
      country: 'Mali',
      accent: '#ff6b8b',
      time: 'il y a 3 h',
      content: 'J’adore voir les pays, les sports et les cultures se mélanger dans une même timeline. AFRISTORY a vraiment l’ADN d’un réseau social panafricain.',
      tags: ['#PanAfrican', '#SocialApp', '#Innovation'],
      likes: 231,
      shares: 37,
      comments: [
        makeComment('Binta', 'C’est exactement ça.', '2 h', createAvatarUrl(1)),
        makeComment('Amara', 'On a vraiment une belle direction produit.', '1 h', createAvatarUrl(5)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(5),
      mediaLabel: 'Timeline communautaire',
      avatarUrl: userByName.get('Youssouf Keita')?.avatarUrl ?? createAvatarUrl(3),
      likedByUserIds: ['user-fatou-ndiaye'],
    }),
    makePost({
      id: 'post-5',
      author: 'Mariam Koné',
      handle: '@mariah.k',
      country: "Côte d'Ivoire",
      accent: '#ff8f4d',
      time: 'il y a 4 h',
      content: 'Le thème visuel des JOJ Dakar 2026 est ultra fort. Orange, navy, gold et green donnent une vraie identité éditoriale.',
      tags: ['#DesignSystem', '#UIUX', '#Brand'],
      likes: 184,
      shares: 22,
      comments: [
        makeComment('Fatou', 'La hiérarchie visuelle est très propre.', '3 h', createAvatarUrl(6)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(8),
      mediaLabel: 'Moodboard design',
      avatarUrl: userByName.get('Mariam Koné')?.avatarUrl ?? createAvatarUrl(4),
      likedByUserIds: [demoUser.id, 'user-salif-traore'],
    }),
    makePost({
      id: 'post-6',
      author: 'Fatou Ndiaye',
      handle: '@fatou.data',
      country: 'Sénégal',
      accent: '#00a859',
      time: 'il y a 5 h',
      content: 'Les données doivent rester lisibles sur mobile. Une appli senior, c’est une appli où chaque bloc a une raison d’exister.',
      tags: ['#MobileFirst', '#Accessibility', '#SeniorFrontend'],
      likes: 219,
      shares: 29,
      comments: [
        makeComment('Awa', 'Exactement, la clarté d’abord.', '4 h', createAvatarUrl(0)),
        makeComment('Salif', 'Et les marges respirent bien.', '3 h', createAvatarUrl(7)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(9),
      mediaLabel: 'Principes UX',
      avatarUrl: userByName.get('Fatou Ndiaye')?.avatarUrl ?? createAvatarUrl(6),
      likedByUserIds: [demoUser.id],
    }),
    makePost({
      id: 'post-7',
      author: 'Ibrahima Ba',
      handle: '@ibra.ba',
      country: 'Sénégal',
      accent: '#6ea8fe',
      time: 'il y a 6 h',
      content: 'J’ai couvert la cérémonie d’ouverture avec une série de portraits. Les visages racontent mieux l’événement que les chiffres.',
      tags: ['#PhotoJournalism', '#OpeningCeremony', '#Portraits'],
      likes: 175,
      shares: 16,
      comments: [
        makeComment('Moussa', 'Le cadrage est impeccable.', '5 h', createAvatarUrl(5)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(10),
      mediaLabel: 'Portraits terrain',
      avatarUrl: userByName.get('Ibrahima Ba')?.avatarUrl ?? createAvatarUrl(1),
      likedByUserIds: [],
    }),
    makePost({
      id: 'post-8',
      author: 'Salif Traoré',
      handle: '@salif.clip',
      country: 'Burkina Faso',
      accent: '#9b8cff',
      time: 'il y a 7 h',
      content: 'Les clips courts autour des JOJ marchent fort. Une bonne capture vidéo et un bon rythme de montage font toute la différence.',
      tags: ['#Video', '#Creator', '#ShortForm'],
      likes: 158,
      shares: 13,
      comments: [
        makeComment('Maya', 'Le pacing est très propre.', '6 h', createAvatarUrl(4)),
      ],
      mediaType: 'video',
      mediaLabel: 'Clip social',
      avatarUrl: userByName.get('Salif Traoré')?.avatarUrl ?? createAvatarUrl(7),
      likedByUserIds: ['user-amara-diallo'],
    }),
    makePost({
      id: 'post-9',
      author: 'Amara Diallo',
      handle: '@amara.community',
      country: 'Mali',
      accent: '#ffb84d',
      time: 'il y a 8 h',
      content: 'Le plus fort dans AFRISTORY, c’est l’organisation. Un espace, des blocs clairs, des actions immédiates et un vrai sentiment de maîtrise.',
      tags: ['#ProductThinking', '#OrganizedUI', '#Community'],
      likes: 203,
      shares: 24,
      comments: [
        makeComment('Nia', 'La direction produit est solide.', '7 h', createAvatarUrl(2)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(11),
      mediaLabel: 'Organisation produit',
      avatarUrl: userByName.get('Amara Diallo')?.avatarUrl ?? createAvatarUrl(5),
      likedByUserIds: [demoUser.id],
    }),
    makePost({
      id: 'post-10',
      author: 'Nia Mensah',
      handle: '@niaflow',
      country: 'Ghana',
      accent: '#47d1a4',
      time: 'il y a 9 h',
      content: 'Le fil social a besoin de respiration, d’images fortes et d’une navigation simple. Ici, on a enfin une expérience qui accompagne le geste naturel.',
      tags: ['#UX', '#Navigation', '#SocialFeed'],
      likes: 171,
      shares: 19,
      comments: [
        makeComment('Awa', 'L’ergonomie mobile est meilleure.', '8 h', createAvatarUrl(0)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(6),
      mediaLabel: 'Navigation mobile',
      avatarUrl: userByName.get('Nia Mensah')?.avatarUrl ?? createAvatarUrl(2),
      likedByUserIds: [],
    }),
    makePost({
      id: 'post-11',
      author: 'Moussa Cisse',
      handle: '@moussa.box',
      country: 'Sénégal',
      accent: '#ff6b8b',
      time: 'il y a 10 h',
      content: 'La boxe et les sports de combat attirent toujours une grosse audience quand on met bien en avant les images, les scoreboards et les temps forts.',
      tags: ['#Boxe', '#Highlights', '#Sport'],
      likes: 142,
      shares: 11,
      comments: [
        makeComment('Youssouf', 'Les temps forts sont essentiels.', '9 h', createAvatarUrl(3)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(7),
      mediaLabel: 'Temps fort',
      avatarUrl: createAvatarUrl(5),
      likedByUserIds: [],
    }),
    makePost({
      id: 'post-12',
      author: 'Amina Hassan',
      handle: '@amina.moves',
      country: 'Égypte',
      accent: '#00a859',
      time: 'il y a 12 h',
      content: 'Je suis venue pour le sport, je reste pour les rencontres, les plats, les sourires et la manière dont toute la plateforme raconte le continent.',
      tags: ['#PanAfrican', '#Food', '#Culture'],
      likes: 265,
      shares: 34,
      comments: [
        makeComment('Mariam', 'Le message est fort.', '11 h', createAvatarUrl(4)),
        makeComment('Fatou', 'C’est exactement l’esprit.', '10 h', createAvatarUrl(6)),
      ],
      mediaType: 'image',
      mediaUrl: createCoverUrl(2),
      mediaLabel: 'Réseau continental',
      avatarUrl: createAvatarUrl(6),
      likedByUserIds: [demoUser.id],
    }),
  ];

  return {
    stories,
    events,
    medals,
    athletes,
    cultures,
    missions,
    offers,
    places,
    trends,
    posts,
  };
}

export const createSeedContentSnapshot = createSeedSnapshot;
