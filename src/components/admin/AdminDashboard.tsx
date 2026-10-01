import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import {
  TrendingUp,
  DollarSign,
  Users,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Activity,
  CreditCard,
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    analytics,
    plans,
    subscriptions,
    invoices,
    payments,
    customers,
    advanceTime,
    setViewingInvoice
  } = useBilling();

  // Quick stats
  const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'failed');

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Subscription Executive Overview
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time MRR, recurring billings, cohort churn, and cashflow analytics
          </p>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => advanceTime(30)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-xs font-bold border border-slate-700 shadow-sm transition-all"
            title="Fast forward 30 days"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate +30 Days Renewal</span>
          </button>

          <button
            onClick={() => onNavigate('plans')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Plans</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MRR */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Recurring (MRR)
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              ₹{analytics.mrr.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ARR Run-rate: <strong className="text-slate-700 dark:text-slate-300 font-mono">₹{analytics.arr.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        {/* Total Net Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Net Collected Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              ₹{analytics.netRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.7%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total Gross: ₹{analytics.totalRevenue.toLocaleString('en-IN')} (Refunds: ₹{analytics.totalRefunds})
          </p>
        </div>

        {/* Active Subscribers */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Subscribers
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {analytics.activeSubscriptionsCount}
            </span>
            <span className="text-xs text-slate-500">
              ({analytics.trialingSubscriptionsCount} in trial)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Past due: <span className="text-orange-500 font-bold">{analytics.pastDueSubscriptionsCount}</span> • Cancelled: {analytics.cancelledSubscriptionsCount}
          </p>
        </div>

        {/* Churn Rate & ARPU */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ARPU / Churn Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              ₹{analytics.arpu.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ user</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Monthly Churn: <strong className="text-slate-800 dark:text-slate-200">{analytics.churnRate}%</strong> (Healthy SaaS range)
          </p>
        </div>

      </div>

      {/* Visual Analytics Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive MRR Trajectory SVG Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Revenue Growth & MRR Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Monthly Recurring Revenue progression across subscription cohorts
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Detailed Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Line / Bar chart simulation */}
          <div className="mt-6">
            <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { month: 'May', mrr: 12500, height: '35%' },
                { month: 'Jun', mrr: 15800, height: '45%' },
                { month: 'Jul', mrr: 19400, height: '55%' },
                { month: 'Aug', mrr: 23100, height: '65%' },
                { month: 'Sep', mrr: 27900, height: '78%' },
                { month: 'Oct (Current)', mrr: Math.max(28000, analytics.mrr * 10), height: '90%', current: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{bar.mrr.toLocaleString('en-IN')}
                  </span>
                  <div
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      bar.current
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-900'
                    }`}
                    style={{ height: bar.height }}
                  />
                  <span className={`text-[11px] font-medium ${bar.current ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}>
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Recurring SaaS Billings
              </span>
              <span>Based on normalized monthly contract values</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Plan Revenue Share */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Subscribers by Tier
            </h3>

            <div className="mt-6 space-y-4">
              {plans.map((p) => {
                const count = subscriptions.filter(s => s.planId === p.id && (s.status === 'active' || s.status === 'trialing')).length;
                const totalSubs = Math.max(1, subscriptions.length);
                const pct = Math.round((count / totalSubs) * 100);

                return (
                  <div key={p.id}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.name} (₹{p.price}/mo)
                      </span>
                      <span className="font-mono text-slate-500">
                        {count} accounts ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('plans')}
              className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors text-center"
            >
              Configure Tiers & Pricing →
            </button>
          </div>
        </div>

      </div>

      {/* Recent Subscriptions & Invoices Quick Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Subscriptions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Customer Subscriptions
              </h3>
              <p className="text-xs text-slate-500">
                Real-time active subscription accounts
              </p>
            </div>
            <button
              onClick={() => onNavigate('subscriptions')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {subscriptions.slice(0, 4).map((sub) => {
              const cust = customers.find(c => c.id === sub.customerId);
              const plan = plans.find(p => p.id === sub.planId);

              return (
                <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={cust?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                      alt={cust?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {cust?.company}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {plan?.name} • <span className="capitalize">{sub.billingCycle}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge status={sub.status} size="sm" />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Due: {sub.currentPeriodEnd}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Recent Invoices Generated
              </h3>
              <p className="text-xs text-slate-500">
                Latest customer invoices & status
              </p>
            </div>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {invoices.slice(0, 4).map((inv) => {
              const cust = customers.find(c => c.id === inv.customerId);

              return (
                <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </span>
                      <Badge status={inv.status} size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {cust?.company} • {inv.issueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="View printable invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
