'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TRIGGER_TYPES, SUPPORTED_TOKENS, MIN_TIP_AMOUNT, MAX_TIP_AMOUNT } from '@/lib/constants';
import { formatSolAmount } from '@/lib/utils';
import { Plus, Settings2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { TippingRule, RuleFormData } from '@/lib/types';

interface TippingRulesProps {
  rules: TippingRule[];
  onRuleCreate?: (rule: RuleFormData) => void;
  onRuleToggle?: (ruleId: string, isActive: boolean) => void;
  onRuleDelete?: (ruleId: string) => void;
}

export function TippingRules({ rules, onRuleCreate, onRuleToggle, onRuleDelete }: TippingRulesProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RuleFormData>({
    triggerType: 'like',
    triggerValue: '',
    amount: 0.001,
    token: 'SOL',
  });
  const [errors, setErrors] = useState<Partial<RuleFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RuleFormData> = {};

    if (!formData.triggerValue.trim()) {
      newErrors.triggerValue = 'Trigger value is required';
    }

    if (formData.amount < MIN_TIP_AMOUNT) {
      newErrors.amount = `Minimum amount is ${MIN_TIP_AMOUNT} SOL`;
    } else if (formData.amount > MAX_TIP_AMOUNT) {
      newErrors.amount = `Maximum amount is ${MAX_TIP_AMOUNT} SOL`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRule = () => {
    if (!validateForm()) return;

    onRuleCreate?.(formData);
    setFormData({
      triggerType: 'like',
      triggerValue: '',
      amount: 0.001,
      token: 'SOL',
    });
    setShowForm(false);
  };

  const getTriggerDescription = (rule: TippingRule): string => {
    switch (rule.triggerType) {
      case 'like':
        return `When someone likes a post by ${rule.triggerValue}`;
      case 'mention':
        return `When ${rule.triggerValue} is mentioned`;
      case 'follow':
        return `When someone follows ${rule.triggerValue}`;
      case 'custom':
        return rule.triggerValue;
      default:
        return rule.triggerValue;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Auto-Tipping Rules
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-6">
              <h4 className="font-medium text-text-primary">Create New Rule</h4>
              
              <Select
                label="Trigger Type"
                options={TRIGGER_TYPES.map(type => ({
                  value: type.value,
                  label: type.label,
                }))}
                value={formData.triggerType}
                onValueChange={(value) => setFormData({ ...formData, triggerType: value as any })}
              />

              <Input
                label="Trigger Value"
                placeholder={
                  formData.triggerType === 'like' ? 'Creator username or address' :
                  formData.triggerType === 'mention' ? 'Username to watch for mentions' :
                  formData.triggerType === 'follow' ? 'Creator to watch for new followers' :
                  'Custom trigger description'
                }
                value={formData.triggerValue}
                onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                error={errors.triggerValue}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Tip Amount"
                  type="number"
                  step="0.001"
                  min={MIN_TIP_AMOUNT}
                  max={MAX_TIP_AMOUNT}
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

              <div className="flex gap-2">
                <Button onClick={handleCreateRule} className="flex-1">
                  Create Rule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {rules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">No tipping rules created yet.</p>
              <p className="text-sm text-text-secondary mt-2">
                Create rules to automatically tip creators when specific actions happen.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.ruleId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">
                      {getTriggerDescription(rule)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Tip {formatSolAmount(rule.amount)} {rule.token}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRuleToggle?.(rule.ruleId, !rule.isActive)}
                      className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                    >
                      {rule.isActive ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={() => onRuleDelete?.(rule.ruleId)}
                      className="text-text-secondary hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
