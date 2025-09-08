'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatAddress } from '@/lib/utils';
import { Wallet, Copy, ExternalLink } from 'lucide-react';

export function WalletConnection() {
  const { connected, publicKey, disconnect } = useWallet();

  if (!connected) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="w-6 h-6" />
            Connect Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary mb-6">
            Connect your Solana wallet to start tipping creators and managing your tipping rules.
          </p>
          <WalletMultiButton className="!bg-primary !text-white !rounded-lg !px-6 !py-3 !font-medium hover:!bg-blue-600 !transition-all !duration-200" />
        </CardContent>
      </Card>
    );
  }

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      // You could add a toast notification here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            size="lg"
            fallback={publicKey?.toString().slice(0, 2).toUpperCase()}
          />
          <div className="flex-1">
            <p className="font-medium text-text-primary">
              {formatAddress(publicKey?.toString() || '')}
            </p>
            <p className="text-sm text-text-secondary">Phantom Wallet</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAddress}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Explorer
          </Button>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={disconnect}
          className="w-full mt-3"
        >
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}
