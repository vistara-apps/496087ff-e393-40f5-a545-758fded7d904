import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatSolAmount(amount: number): string {
  if (amount < 0.001) {
    return `${(amount * 1000000).toFixed(0)} μSOL`;
  }
  if (amount < 1) {
    return `${(amount * 1000).toFixed(2)} mSOL`;
  }
  return `${amount.toFixed(4)} SOL`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function validateSolanaAddress(address: string): boolean {
  try {
    // Basic Solana address validation (base58, 32-44 chars)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } catch {
    return false;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
