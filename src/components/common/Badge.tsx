import React from 'react';
import { SubscriptionStatus, InvoiceStatus, PaymentStatus } from '../../types';

interface BadgeProps {
  status: SubscriptionStatus | InvoiceStatus | PaymentStatus | 'active' | 'inactive' | 'suspended';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'succeeded':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          label: status === 'succeeded' ? 'Succeeded' : status === 'paid' ? 'Paid' : 'Active'
        };
      case 'trialing':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
          dot: 'bg-indigo-500',
          label: 'In Trial'
        };
      case 'pending':
      case 'processing':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
          dot: 'bg-amber-500 animate-pulse',
          label: status === 'pending' ? 'Pending' : 'Processing'
        };
      case 'past_due':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
          dot: 'bg-orange-500',
          label: 'Past Due'
        };
      case 'cancelled':
      case 'failed':
      case 'suspended':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
          dot: 'bg-rose-500',
          label: status === 'failed' ? 'Failed' : status === 'cancelled' ? 'Cancelled' : 'Suspended'
        };
      case 'refunded':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
          dot: 'bg-purple-500',
          label: 'Refunded'
        };
      case 'paused':
      case 'inactive':
      case 'expired':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
          label: status === 'paused' ? 'Paused' : status === 'inactive' ? 'Inactive' : 'Expired'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: String(status)
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
