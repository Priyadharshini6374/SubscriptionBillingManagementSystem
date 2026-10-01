import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import { SubscriptionStatus } from '../../types';
import {
  Play,
  AlertTriangle,
  Pause,
  RefreshCw,
  XCircle,
  Search,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const SubscriptionList: React.FC = () => {
  const {
    subscriptions,
    plans,
    customers,
    triggerManualRenewal,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    reactivateSubscription
  } = useBilling();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const cust = customers.find(c => c.id === sub.customerId);
    const plan = plans.find(p => p.id === sub.planId);
    
    const matchesSearch = 
      (cust?.company.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (cust?.name.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (plan?.name.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Subscription Lifecycle Registry
          </h1>
          <p className="text-xs text-slate-500">
            Monitor active contracts, trigger simulated auto-renewals, or test billing failure dunning
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Total Subscriptions: <strong>{subscriptions.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by company or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
          {['all', 'active', 'trialing', 'past_due', 'paused', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Customer & Account</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Billing Cycle</th>
                <th className="py-3 px-4 text-right">Recurring Price</th>
                <th className="py-3 px-4">Current Period End</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Simulation Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No subscriptions matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const cust = customers.find(c => c.id === sub.customerId);
                  const plan = plans.find(p => p.id === sub.planId);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                            alt={cust?.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {cust?.company}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {cust?.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {plan?.name}
                      </td>

                      <td className="py-3.5 px-4 capitalize text-slate-700 dark:text-slate-300">
                        {sub.billingCycle}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{sub.nextBillingAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {sub.currentPeriodEnd}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge status={sub.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sub.status === 'active' && (
                            <>
                              <button
                                onClick={() => triggerManualRenewal(sub.id, false)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold"
                                title="Trigger Instant Renewal (Successful charge)"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => triggerManualRenewal(sub.id, true)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-semibold"
                                title="Test Renewal Failure (Simulate past-due dunning)"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => pauseSubscription(sub.id)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                title="Pause Subscription"
                              >
                                <Pause className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {sub.status === 'paused' && (
                            <button
                              onClick={() => resumeSubscription(sub.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              <span>Resume</span>
                            </button>
                          )}

                          {sub.status === 'past_due' && (
                            <button
                              onClick={() => triggerManualRenewal(sub.id, false)}
                              className="px-2 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-[11px] flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Recover</span>
                            </button>
                          )}

                          {sub.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (window.confirm('Cancel this subscription?')) {
                                  cancelSubscription(sub.id, 'Admin manual cancellation', true);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Cancel Subscription Immediately"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {sub.status === 'cancelled' && (
                            <button
                              onClick={() => reactivateSubscription(sub.id)}
                              className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold text-[11px]"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
