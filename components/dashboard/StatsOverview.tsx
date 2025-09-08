'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { formatSolAmount } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users, Zap } from 'lucide-react';
import type { Tip } from '@/lib/types';

interface StatsOverviewProps {
  tips: Tip[];
  userWalletAddress?: string;
}

export function StatsOverview({ tips, userWalletAddress }: StatsOverviewProps) {
  const sentTips = tips.filter(tip => tip.senderWalletAddress === userWalletAddress);
  const receivedTips = tips.filter(tip => tip.receiverWalletAddress === userWalletAddress);
  
  const totalSent = sentTips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalReceived = receivedTips.reduce((sum, tip) => sum + tip.amount, 0);
  
  const uniqueRecipients = new Set(sentTips.map(tip => tip.receiverWalletAddress)).size;
  const uniqueSenders = new Set(receivedTips.map(tip => tip.senderWalletAddress)).size;

  const stats = [
    {
      title: 'Total Sent',
      value: formatSolAmount(totalSent),
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total Received',
      value: formatSolAmount(totalReceived),
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Creators Tipped',
      value: uniqueRecipients.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Tips',
      value: tips.length.toString(),
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{stat.title}</p>
                <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
