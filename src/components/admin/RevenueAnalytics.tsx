import React from 'react';
import { useBilling } from '../../context/BillingContext';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  Repeat,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const RevenueAnalytics: React.FC = () => {
  const { analytics, plans, subscriptions, payments } = useBilling();

  // Cycle breakdown
  const monthlySubs = subscriptions.filter(s => s.status === 'active' && s.billingCycle === 'monthly').length;
  const quarterlySubs = subscriptions.filter(s => s.status === 'active' && s.billingCycle === 'quarterly').length;
  const yearlySubs = subscriptions.filter(s => s.status === 'active' && s.billingCycle === 'yearly').length;
  const totalActive = Math.max(1, analytics.activeSubscriptionsCount);

  // Estimated LTV (Average Revenue Per User / Churn Rate)
  const ltv = analytics.churnRate > 0
    ? Math.round((analytics.arpu / (analytics.churnRate / 100)))
    : analytics.arpu * 18;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Revenue & Subscription Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Deep financial telemetry into recurring contracts, cycle velocity, and unit economics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            Cohort: CY-2026 SaaS Run
          </span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Run-Rate (MRR)
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{analytics.mrr.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Annualized: ₹{analytics.arr.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Customer Lifetime Value (LTV)
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{ltv.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ARPU: ₹{analytics.arpu} / customer
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Gross Collections
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{analytics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Net: ₹{analytics.netRevenue.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contract Churn Rate
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {analytics.churnRate}%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            Target benchmark: &lt; 5.0%
          </span>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Billing Cycle Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Subscribers by Billing Term
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Longer terms reduce churn and improve upfront operating cashflow
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-800 dark:text-slate-200">Monthly Commitments</span>
                <span className="font-mono text-slate-500">{monthlySubs} accounts ({Math.round((monthlySubs / totalActive) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(monthlySubs / totalActive) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-800 dark:text-slate-200">Quarterly Commitments (Save ~8%)</span>
                <span className="font-mono text-slate-500">{quarterlySubs} accounts ({Math.round((quarterlySubs / totalActive) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(quarterlySubs / totalActive) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-800 dark:text-slate-200">Annual Commitments (2 Months Free)</span>
                <span className="font-mono text-slate-500">{yearlySubs} accounts ({Math.round((yearlySubs / totalActive) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(yearlySubs / totalActive) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Revenue Yield */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Revenue Contribution by Plan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Normalized monthly recurring revenue yield per subscription tier
          </p>

          <div className="mt-6 space-y-3.5">
            {plans.map((p) => {
              const activeForPlan = subscriptions.filter(s => s.planId === p.id && s.status === 'active');
              let planMRR = 0;
              activeForPlan.forEach(sub => {
                if (sub.billingCycle === 'monthly') planMRR += p.billingCycles.monthly;
                else if (sub.billingCycle === 'quarterly') planMRR += p.billingCycles.quarterly / 3;
                else planMRR += p.billingCycles.yearly / 12;
              });

              const share = analytics.mrr > 0 ? Math.round((planMRR / analytics.mrr) * 100) : 0;

              return (
                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {activeForPlan.length} subscribers active
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                      ₹{Math.round(planMRR).toLocaleString('en-IN')}/mo
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {share}% of total MRR
                    </span>
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
