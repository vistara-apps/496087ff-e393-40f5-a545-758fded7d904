'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatSolAmount, formatAddress } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import type { Tip } from '@/lib/types';

interface TippingHistoryProps {
  tips: Tip[];
  userWalletAddress?: string;
}

export function TippingHistory({ tips, userWalletAddress }: TippingHistoryProps) {
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const sortedTips = [...tips].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTips.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary">No tips yet.</p>
            <p className="text-sm text-text-secondary mt-2">
              Start tipping creators or create auto-tipping rules to see activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTips.slice(0, 10).map((tip) => {
              const isSent = tip.senderWalletAddress === userWalletAddress;
              const otherAddress = isSent ? tip.receiverWalletAddress : tip.senderWalletAddress;
              
              return (
                <div
                  key={tip.tipId}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className={`p-2 rounded-full ${isSent ? 'bg-red-100' : 'bg-green-100'}`}>
                    {isSent ? (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <Avatar
                    size="sm"
                    fallback={otherAddress.slice(0, 2).toUpperCase()}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-text-primary">
                        {isSent ? 'Sent to' : 'Received from'} {formatAddress(otherAddress)}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatTimestamp(new Date(tip.timestamp))}
                      </p>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {formatSolAmount(tip.amount)} {tip.token}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => window.open(`https://explorer.solana.com/tx/${tip.transactionHash}?cluster=devnet`, '_blank')}
                    className="text-text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
