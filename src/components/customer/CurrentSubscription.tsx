import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { BillingCycle, Plan } from '../../types';
import { Badge } from '../common/Badge';
import {
  Calendar,
  AlertTriangle,
  RotateCw,
  Pause,
  Play,
  XCircle,
  CheckCircle2,
  RefreshCw,
  Shield,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CurrentSubscriptionProps {
  onNavigate: (tab: string) => void;
}

export const CurrentSubscription: React.FC<CurrentSubscriptionProps> = ({ onNavigate }) => {
  const {
    currentCustomer,
    plans,
    subscriptions,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
    pauseSubscription,
    resumeSubscription,
    simulationDate
  } = useBilling();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Too expensive for current stage');
  const [cancelImmediate, setCancelImmediate] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [targetPlanId, setTargetPlanId] = useState('');
  const [targetCycle, setTargetCycle] = useState<BillingCycle>('monthly');

  const activeSub = subscriptions.find(
    s => s.customerId === currentCustomer?.id && (s.status === 'active' || s.status === 'trialing' || s.status === 'past_due' || s.status === 'paused')
  );

  const plan = plans.find(p => p.id === activeSub?.planId);

  if (!activeSub || !plan) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Active Subscription
        </h2>
        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
          You are currently on a free or paused tier. Choose a plan to unlock projects, storage, and premium tools.
        </p>
        <button
          onClick={() => onNavigate('plans')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
        >
          Explore Subscription Plans
        </button>
      </div>
    );
  }

  const handleOpenChangePlan = (p: Plan) => {
    setTargetPlanId(p.id);
    setTargetCycle(activeSub.billingCycle);
    setShowChangeModal(true);
  };

  const handleConfirmPlanChange = () => {
    if (!targetPlanId) return;
    changePlan(activeSub.id, targetPlanId, targetCycle);
    setShowChangeModal(false);
  };

  const handleConfirmCancel = () => {
    cancelSubscription(activeSub.id, cancelReason, cancelImmediate);
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Subscription
          </h1>
          <p className="text-xs text-slate-500">
            Control billing renewal cycles, switch tiers, or configure subscription status
          </p>
        </div>

        <Badge status={activeSub.status} size="md" />
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        
        {/* Tier & Pricing Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Subscription Tier
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {plan.name} Plan
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              {plan.description}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">Recurring Price</span>
            <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">
              ₹{activeSub.nextBillingAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              {activeSub.billingCycle} Billing Cycle
            </span>
          </div>
        </div>

        {/* Schedule & Cycle Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Current Period</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {activeSub.currentPeriodStart} to {activeSub.currentPeriodEnd}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Auto-renew scheduled for {activeSub.currentPeriodEnd}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Renewal Policy</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {activeSub.cancelAtPeriodEnd ? 'Cancels at Period End' : 'Automatic Renewal Enabled'}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {activeSub.cancelAtPeriodEnd ? 'Access ends after current cycle' : 'Continuous uninterrupted access'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Discounts Applied</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {activeSub.discountApplied ? `${activeSub.discountApplied.code} (${activeSub.discountApplied.percentage}% OFF)` : 'Standard Rate (No Coupon)'}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
              {activeSub.discountApplied ? `Saved ₹${activeSub.discountApplied.amount} on cycle` : 'Promo codes can be applied at renewal'}
            </span>
          </div>
        </div>

        {/* Plan Upgrade / Downgrade Selector */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
            Change Plan or Cycle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isCurrent = p.id === plan.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                    isCurrent
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-base font-extrabold text-slate-800 dark:text-slate-200 mt-2">
                      ₹{p.billingCycles[activeSub.billingCycle].toLocaleString('en-IN')}
                      <span className="text-[11px] font-normal text-slate-400">/{activeSub.billingCycle}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold cursor-not-allowed text-center"
                      >
                        Active
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenChangePlan(p)}
                        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all text-center shadow-sm"
                      >
                        {p.price > plan.price ? 'Upgrade to ' + p.name : 'Downgrade to ' + p.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Actions: Pause, Reactivate, Cancel */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {activeSub.status === 'paused' ? (
              <button
                onClick={() => resumeSubscription(activeSub.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Subscription</span>
              </button>
            ) : (
              <button
                onClick={() => pauseSubscription(activeSub.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                <Pause className="w-3.5 h-3.5 text-amber-500" />
                <span>Pause Subscription</span>
              </button>
            )}

            {activeSub.cancelAtPeriodEnd && (
              <button
                onClick={() => reactivateSubscription(activeSub.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Keep Subscription (Reactivate)</span>
              </button>
            )}
          </div>

          {!activeSub.cancelAtPeriodEnd && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Subscription</span>
            </button>
          )}
        </div>

      </div>

      {/* Change Plan Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Plan Change
            </h3>
            <p className="text-xs text-slate-500">
              You are switching to the <strong>{plans.find(p => p.id === targetPlanId)?.name}</strong> tier. Choose your billing cycle:
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Cycle
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTargetCycle(c)}
                    className={`py-2 px-3 rounded-lg text-xs capitalize font-medium border ${
                      targetCycle === c ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">New Renewal Price:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{plans.find(p => p.id === targetPlanId)?.billingCycles[targetCycle].toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Simulated prorated credit applied automatically to the next invoice.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Back
              </button>
              <button
                onClick={handleConfirmPlanChange}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-500"
              >
                Confirm Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cancel Subscription?
              </h3>
            </div>
            
            <p className="text-xs text-slate-500">
              We are sorry to see you go. Please tell us why you are cancelling so we can improve:
            </p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Too expensive for current stage">Too expensive for current stage</option>
              <option value="Missing features I need">Missing features I need</option>
              <option value="Switched to an alternative service">Switched to an alternative service</option>
              <option value="Project completed / temporary pause">Project completed / temporary pause</option>
              <option value="Other feedback">Other feedback</option>
            </select>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={cancelImmediate}
                onChange={(e) => setCancelImmediate(e.target.checked)}
                className="rounded border-slate-400 text-rose-600"
              />
              <span>Cancel immediately (revoke access now instead of period end)</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Keep Plan
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
