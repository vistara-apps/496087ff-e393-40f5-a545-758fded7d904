export const SUPPORTED_TOKENS = [
  { symbol: 'SOL', name: 'Solana', decimals: 9 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'USDT', name: 'Tether USD', decimals: 6 },
] as const;

export const TRIGGER_TYPES = [
  { value: 'like', label: 'Like a post' },
  { value: 'mention', label: 'Mention in post' },
  { value: 'follow', label: 'New follower' },
  { value: 'custom', label: 'Custom trigger' },
] as const;

export const DEFAULT_TIP_AMOUNTS = [0.001, 0.005, 0.01, 0.05, 0.1] as const;

export const PLATFORM_FEE_PERCENTAGE = 2; // 2% platform fee

export const MAX_TIP_AMOUNT = 10; // Maximum tip amount in SOL
export const MIN_TIP_AMOUNT = 0.001; // Minimum tip amount in SOL
