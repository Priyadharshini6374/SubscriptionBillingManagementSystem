import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Plan, BillingCycle } from '../../types';
import { CheckoutModal } from './CheckoutModal';
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  HardDrive,
  Users
} from 'lucide-react';

export const BrowsePlans: React.FC = () => {
  const { plans, currentCustomer, subscriptions } = useBilling();

  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);

  // Determine current active subscription of the logged-in customer
  const activeSub = subscriptions.find(
    s => s.customerId === currentCustomer?.id && (s.status === 'active' || s.status === 'trialing' || s.status === 'past_due')
  );

  const currentPlan = plans.find(p => p.id === activeSub?.planId);

  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto">
      
      {/* Header & Cycle Switcher */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Flexible SaaS Pricing Tiers
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Simple, transparent plans for every scale
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upgrade, downgrade, or switch billing cycles anytime with simulated prorated billing.
        </p>

        {/* Cycle Toggle Pill */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner mt-4">
          <button
            onClick={() => setCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              cycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setCycle('quarterly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              cycle === 'quarterly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quarterly <span className="text-[10px] text-indigo-500 font-bold ml-1">Save ~8%</span>
          </button>

          <button
            onClick={() => setCycle('yearly')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              cycle === 'yearly'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Yearly</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
              cycle === 'yearly' ? 'bg-indigo-800 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              2 Months Free
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrent = activeSub?.planId === plan.id;
          const cyclePrice = plan.billingCycles[cycle];
          
          // Monthly normalized equivalent price
          const monthlyEquivalent = cycle === 'monthly' 
            ? plan.price 
            : cycle === 'quarterly' 
              ? Math.round(plan.billingCycles.quarterly / 3) 
              : Math.round(plan.billingCycles.yearly / 12);

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-8 border transition-all duration-200 ${
                plan.isPopular
                  ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/20 bg-white dark:bg-slate-900 shadow-xl'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                    plan.status === 'active' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {plan.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[36px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price block */}
                <div className="mt-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                      ₹{monthlyEquivalent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">/ month</span>
                  </div>

                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {cycle === 'monthly' ? (
                      'Billed monthly'
                    ) : cycle === 'quarterly' ? (
                      <span>Billed ₹{cyclePrice.toLocaleString('en-IN')} quarterly</span>
                    ) : (
                      <span>Billed ₹{cyclePrice.toLocaleString('en-IN')} annually</span>
                    )}
                  </div>

                  {plan.trialPeriodDays > 0 && (
                    <div className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Includes {plan.trialPeriodDays}-day free trial
                    </div>
                  )}
                </div>

                {/* Key Spec limits */}
                <div className="py-4 border-b border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>
                      <strong>{plan.name === 'BUSINESS' ? 'Unlimited' : plan.features.find(f => f.includes('projects'))?.split(' ')[1] || '5'}</strong> Projects
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-indigo-500" />
                    <span><strong>{plan.storageLimitGB} GB</strong> Cloud Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>
                      <strong>{plan.maxUsers === 'unlimited' ? 'Unlimited' : `${plan.maxUsers} User${plan.maxUsers > 1 ? 's' : ''}`}</strong> Access
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included Features
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs cursor-default flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Current Active Plan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanForCheckout(plan)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {currentPlan
                        ? plan.price > currentPlan.price
                          ? 'Upgrade to ' + plan.name
                          : 'Downgrade to ' + plan.name
                        : 'Subscribe to ' + plan.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          plan={selectedPlanForCheckout}
          initialCycle={cycle}
          onClose={() => setSelectedPlanForCheckout(null)}
        />
      )}

    </div>
  );
};
