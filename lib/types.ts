export interface User {
  userId: string;
  walletAddress: string;
  farcasterUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Creator {
  creatorId: string;
  walletAddress: string;
  farcasterUserId?: string;
  bio?: string;
  socialLinks?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TippingRule {
  ruleId: string;
  creatorId: string;
  triggerType: 'like' | 'mention' | 'follow' | 'custom';
  triggerValue: string;
  amount: number;
  token: 'SOL' | string; // SOL or SPL token address
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tip {
  tipId: string;
  senderWalletAddress: string;
  receiverWalletAddress: string;
  amount: number;
  token: 'SOL' | string;
  transactionHash: string;
  timestamp: Date;
  ruleId?: string;
}

export interface TipFormData {
  amount: number;
  token: 'SOL' | string;
  recipient: string;
  message?: string;
}

export interface RuleFormData {
  triggerType: 'like' | 'mention' | 'follow' | 'custom';
  triggerValue: string;
  amount: number;
  token: 'SOL' | string;
}
