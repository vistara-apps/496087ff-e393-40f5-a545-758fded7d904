'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SUPPORTED_TOKENS, DEFAULT_TIP_AMOUNTS, MIN_TIP_AMOUNT, MAX_TIP_AMOUNT } from '@/lib/constants';
import { validateSolanaAddress, formatSolAmount } from '@/lib/utils';
import { Send, Heart } from 'lucide-react';
import type { TipFormData } from '@/lib/types';

interface TipFormProps {
  recipientAddress?: string;
  onTipSent?: (tip: any) => void;
}

export function TipForm({ recipientAddress, onTipSent }: TipFormProps) {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TipFormData>({
    amount: 0.01,
    token: 'SOL',
    recipient: recipientAddress || '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<TipFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<TipFormData> = {};

    if (!formData.recipient) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!validateSolanaAddress(formData.recipient)) {
      newErrors.recipient = 'Invalid Solana address';
    }

    if (formData.amount < MIN_TIP_AMOUNT) {
      newErrors.amount = `Minimum tip amount is ${MIN_TIP_AMOUNT} SOL`;
    } else if (formData.amount > MAX_TIP_AMOUNT) {
      newErrors.amount = `Maximum tip amount is ${MAX_TIP_AMOUNT} SOL`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendTip = async () => {
    if (!connected || !publicKey || !validateForm()) return;

    setIsLoading(true);
    try {
      const recipientPubkey = new PublicKey(formData.recipient);
      const lamports = Math.floor(formData.amount * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      // Create tip record
      const tip = {
        tipId: signature,
        senderWalletAddress: publicKey.toString(),
        receiverWalletAddress: formData.recipient,
        amount: formData.amount,
        token: formData.token,
        transactionHash: signature,
        timestamp: new Date(),
      };

      onTipSent?.(tip);

      // Reset form
      setFormData({
        amount: 0.01,
        token: 'SOL',
        recipient: recipientAddress || '',
        message: '',
      });

      // You could add a success toast here
    } catch (error) {
      console.error('Failed to send tip:', error);
      // You could add an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-text-secondary">Connect your wallet to send tips</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Send a Tip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Recipient Address"
          placeholder="Enter Solana wallet address"
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          error={errors.recipient}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.001"
            min={MIN_TIP_AMOUNT}
            max={MAX_TIP_AMOUNT}
            placeholder="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            error={errors.amount}
          />
          <Select
            label="Token"
            options={SUPPORTED_TOKENS.map(token => ({
              value: token.symbol,
              label: token.symbol,
            }))}
            value={formData.token}
            onValueChange={(value) => setFormData({ ...formData, token: value })}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-text-secondary">Quick amounts:</span>
          {DEFAULT_TIP_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setFormData({ ...formData, amount })}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              {formatSolAmount(amount)}
            </button>
          ))}
        </div>

        <Input
          label="Message (Optional)"
          placeholder="Add a message with your tip"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />

        <Button
          onClick={handleSendTip}
          isLoading={isLoading}
          disabled={!formData.recipient || !formData.amount}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Send {formatSolAmount(formData.amount)} Tip
        </Button>
      </CardContent>
    </Card>
  );
}
