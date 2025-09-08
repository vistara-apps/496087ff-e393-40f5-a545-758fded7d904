'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { WalletConnection } from '@/components/wallet/WalletConnection';
import { TipForm } from '@/components/tipping/TipForm';
import { TippingRules } from '@/components/tipping/TippingRules';
import { TippingHistory } from '@/components/dashboard/TippingHistory';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Heart, Zap, Users, TrendingUp } from 'lucide-react';
import type { Tip, TippingRule, RuleFormData } from '@/lib/types';

export default function HomePage() {
  const { connected, publicKey } = useWallet();
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'tip' | 'rules' | 'history'>('tip');
  const [tips, setTips] = useState<Tip[]>([]);
  const [rules, setRules] = useState<TippingRule[]>([]);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Mock data for demonstration
  useEffect(() => {
    if (connected && publicKey) {
      // In a real app, you would fetch this data from your backend
      const mockTips: Tip[] = [
        {
          tipId: 'mock-1',
          senderWalletAddress: publicKey.toString(),
          receiverWalletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          amount: 0.01,
          token: 'SOL',
          transactionHash: 'mock-hash-1',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          tipId: 'mock-2',
          senderWalletAddress: '8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          receiverWalletAddress: publicKey.toString(),
          amount: 0.005,
          token: 'SOL',
          transactionHash: 'mock-hash-2',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        },
      ];
      setTips(mockTips);

      const mockRules: TippingRule[] = [
        {
          ruleId: 'rule-1',
          creatorId: 'creator-1',
          triggerType: 'like',
          triggerValue: '@creator123',
          amount: 0.001,
          token: 'SOL',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setRules(mockRules);
    }
  }, [connected, publicKey]);

  const handleTipSent = (tip: Tip) => {
    setTips(prev => [tip, ...prev]);
  };

  const handleRuleCreate = (ruleData: RuleFormData) => {
    const newRule: TippingRule = {
      ruleId: `rule-${Date.now()}`,
      creatorId: 'current-user',
      ...ruleData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRules(prev => [...prev, newRule]);
  };

  const handleRuleToggle = (ruleId: string, isActive: boolean) => {
    setRules(prev => prev.map(rule => 
      rule.ruleId === ruleId ? { ...rule, isActive } : rule
    ));
  };

  const handleRuleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.ruleId !== ruleId));
  };

  const tabs = [
    { id: 'tip', label: 'Send Tip', icon: Heart },
    { id: 'rules', label: 'Auto Rules', icon: Zap },
    { id: 'history', label: 'History', icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            TippyTip
          </h1>
          <p className="text-lg text-text-secondary">
            Tip creators instantly with every like on Solana
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnection />
        </div>

        {connected && (
          <>
            {/* Stats Overview */}
            <div className="mb-8">
              <StatsOverview 
                tips={tips} 
                userWalletAddress={publicKey?.toString()} 
              />
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'tip' && (
                <TipForm onTipSent={handleTipSent} />
              )}

              {activeTab === 'rules' && (
                <TippingRules
                  rules={rules}
                  onRuleCreate={handleRuleCreate}
                  onRuleToggle={handleRuleToggle}
                  onRuleDelete={handleRuleDelete}
                />
              )}

              {activeTab === 'history' && (
                <TippingHistory 
                  tips={tips} 
                  userWalletAddress={publicKey?.toString()} 
                />
              )}
            </div>
          </>
        )}

        {/* Features Section */}
        {!connected && (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Instant Tips',
                description: 'Send SOL tips to creators with just one click',
              },
              {
                icon: Zap,
                title: 'Auto Rules',
                description: 'Set up automatic tipping when you like content',
              },
              {
                icon: Users,
                title: 'Creator Focus',
                description: 'Support your favorite creators effortlessly',
              },
              {
                icon: TrendingUp,
                title: 'Track Impact',
                description: 'See your tipping history and creator support',
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
