
export type PlanType = 'FREE' | 'PRO' | 'DIAMOND';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  originalAvatar?: string;
  plan: PlanType;
  provider: 'google' | 'facebook' | 'email';
}

export interface LedgerTransaction {
    id: string;
    type: 'MINING' | 'REWARD_AD' | 'GAME_WIN' | 'REFERRAL' | 'CASHOUT' | 'AIRDROP' | 'TOURNAMENT_DONATION' | 'HOUSE_COMMISSION' | 'TOURNAMENT_CREATE' | 'TOURNAMENT_REFUND' | 'ITEM_BUY' | 'GAME_FEE' | 'RAFFLE_WIN' | 'RAFFLE_ENTRY';
    amount: number;
    timestamp: number;
    hash: string;
    blockIndex: number;
    status: 'VERIFIED' | 'PENDING';
}

export interface UserCard { id: string; name: string; imageUrl: string; rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'GOLDEN'; element: 'FIRE' | 'WATER' | 'CYBER' | 'VOID'; stats: { atk: number; def: number; spd: number }; description: string; value: number; mintCost: number; mintDate: number; originalOwnerId: string; signature: string; integrityHash: string; isVerified?: boolean; }
export interface UserAd { id: string; title: string; description: string; imageUrl: string; targetUrl: string; budget: number; spent: number; impressions: number; clicks: number; status: 'ACTIVE' | 'PAUSED' | 'PENDING_MODERATION' | 'REJECTED' | 'COMPLETED'; cpm: number; }
export interface ChatMessage { id: string; sender: 'user' | 'ai' | 'other'; senderName?: string; senderId?: string; text: string; timestamp: number; groundingChunks?: any[]; isReported?: boolean; }
export interface TournamentRoom { id: number; name?: string; players: number; spectators: number; maxPlayers: number; status: 'OPEN' | 'WAITING' | 'FULL' | 'PLAYING'; gameType: string; creatorId?: string; entryFee?: number; isCustom?: boolean; }
export interface ActiveTournamentState { joinedRoomId: number | null; isReady: boolean; gameType: string | null; isSpectating: boolean; lives: number; }
export interface NewsItem { id: string; title: string; summary: string; tags: string[]; engagement: number; imageUrl: string; }

export interface UserState {
  balance: number;
  salsaBalance: number;
  monthlyBonus: number;
  lastBonusResetMonth: number;
  streak: number;
  plan: PlanType; 
  isPro: boolean; 
  backgroundMode: boolean;
  runnerModeEnabled: boolean;
  referralCount: number;
  unlockedNfts: string[]; 
  inventoryCards: UserCard[]; 
  theme: 'DEFAULT' | 'YELLOW' | 'HALO' | 'GIRL'; 
  language: 'ES' | 'EN'; 
  notificationsEnabled: boolean;
  tasksCompleted: number;
  seasonLevel: number;
  seasonXp: number;
  hasSeasonPass: boolean;
  myAds: UserAd[];
  is18Verified: boolean;
  chatHistory: ChatMessage[];
  joinedForums: string[]; 
  adsWatchedToday: number;
  lastAdWatchTimestamp: number;
  ledger: LedgerTransaction[];
  friends: string[];        
  blockedUsers: string[];   
  chatMode: 'GLOBAL' | 'FRIENDS'; 
  lifetimePro: boolean;
  subscriptions: any[];
  isCreator: boolean;
  is2FAEnabled: boolean;
  twoFactorMethod: 'EMAIL' | 'SMS';
  twoFactorPhone?: string;
}

// Tipo de dato neutral para gráficas de la bóveda/neurales
export interface NeuralDataPoint {
  time: string;
  speed: number;
}

export interface SeasonLevel {
  level: number;
  freeReward: string;
  premiumReward: string;
  type: string;
  isClaimed: boolean;
}

export interface Forum {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  createdAt: number;
  memberCount: number;
  maxMembers: number;
  airdropAmount: number;
  pot: number;
  views: number;
  tags: string[];
}
