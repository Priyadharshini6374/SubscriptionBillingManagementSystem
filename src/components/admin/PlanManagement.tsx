import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Plan, BillingCycle } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  Check,
  X,
  Layers,
  Sparkles,
  Users,
  HardDrive,
  Clock,
  Tag
} from 'lucide-react';

export const PlanManagement: React.FC = () => {
  const { plans, createPlan, updatePlan, togglePlanStatus, deletePlan, subscriptions } = useBilling();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(299);
  const [quarterlyPrice, setQuarterlyPrice] = useState(829);
  const [yearlyPrice, setYearlyPrice] = useState(2990);
  const [trialDays, setTrialDays] = useState(14);
  const [maxUsers, setMaxUsers] = useState<string>('5');
  const [storageGB, setStorageGB] = useState(50);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [featuresText, setFeaturesText] = useState('');

  const openCreateModal = () => {
    setEditingPlanId(null);
    setName('');
    setDescription('');
    setMonthlyPrice(499);
    setQuarterlyPrice(1399);
    setYearlyPrice(4990);
    setTrialDays(14);
    setMaxUsers('5');
    setStorageGB(20);
    setStatus('active');
    setFeaturesText('Unlimited projects\nStandard support\nWeekly analytics export\nCustom brand logo');
    setIsModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setName(plan.name);
    setDescription(plan.description);
    setMonthlyPrice(plan.price);
    setQuarterlyPrice(plan.billingCycles.quarterly);
    setYearlyPrice(plan.billingCycles.yearly);
    setTrialDays(plan.trialPeriodDays);
    setMaxUsers(plan.maxUsers === 'unlimited' ? 'unlimited' : String(plan.maxUsers));
    setStorageGB(plan.storageLimitGB);
    setStatus(plan.status);
    setFeaturesText(plan.features.join('\n'));
    setIsModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresList = featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const planData = {
      name: name.trim().toUpperCase(),
      description: description.trim(),
      price: Number(monthlyPrice),
      billingCycles: {
        monthly: Number(monthlyPrice),
        quarterly: Number(quarterlyPrice),
        yearly: Number(yearlyPrice),
      },
      trialPeriodDays: Number(trialDays),
      features: featuresList,
      maxUsers: maxUsers === 'unlimited' ? ('unlimited' as const) : Math.max(1, parseInt(maxUsers) || 1),
      storageLimitGB: Number(storageGB),
      status: status,
      isPopular: name.toUpperCase() === 'PRO',
      color: 'from-indigo-600 to-purple-600'
    };

    if (editingPlanId) {
      updatePlan(editingPlanId, planData);
    } else {
      createPlan(planData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Subscription Plan Management
          </h1>
          <p className="text-xs text-slate-500">
            Define pricing tiers, features, trial periods, and storage/user quotas
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const subscribersCount = subscriptions.filter(s => s.planId === plan.id && s.status === 'active').length;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 shadow-sm ${
                plan.status === 'inactive' ? 'opacity-65 border-dashed border-slate-300 dark:border-slate-700' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    {plan.isPopular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    plan.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {plan.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 min-h-[32px]">
                  {plan.description}
                </p>

                {/* Pricing Breakdown */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Monthly Cycle:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹{plan.billingCycles.monthly.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Quarterly Cycle:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      ₹{plan.billingCycles.quarterly.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Yearly Cycle:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      ₹{plan.billingCycles.yearly.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quotas & Trial */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Trial Period</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {plan.trialPeriodDays} Days
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Max Users</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {plan.maxUsers === 'unlimited' ? 'Unlimited' : plan.maxUsers}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Storage</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {plan.storageLimitGB} GB
                    </span>
                  </div>
                </div>

                {/* Features Preview */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Features ({plan.features.length})
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-[11px] text-slate-400 pl-5">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Active Subscriber Count */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Active Subscribers:</span>
                  <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {subscribersCount} accounts
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => togglePlanStatus(plan.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    plan.status === 'active'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}
                  title={plan.status === 'active' ? 'Deactivate Plan' : 'Activate Plan'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{plan.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${plan.name} plan?`)) {
                        deletePlan(plan.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Plan Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingPlanId ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. STARTER, PRO, ENTERPRISE"
                    className="w-full px-3 py-2 text-xs uppercase font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active (Visible in Catalog)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Plan Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short tagline explaining who this plan is tailored for"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Pricing Cycles */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                  Billing Cycle Pricing (INR ₹)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Monthly Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={monthlyPrice}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setMonthlyPrice(m);
                        setQuarterlyPrice(Math.round(m * 2.8));
                        setYearlyPrice(Math.round(m * 10));
                      }}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Quarterly Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={quarterlyPrice}
                      onChange={(e) => setQuarterlyPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Yearly Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={yearlyPrice}
                      onChange={(e) => setYearlyPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Limits and Trial */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Free Trial (Days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={trialDays}
                    onChange={(e) => setTrialDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Max Team Users
                  </label>
                  <input
                    type="text"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                    placeholder="e.g. 5 or unlimited"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Storage Limit (GB)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={storageGB}
                    onChange={(e) => setStorageGB(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Features List (1 per line) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Features (Enter one feature per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="5 active projects&#10;5 GB cloud storage&#10;Email support"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  {editingPlanId ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
