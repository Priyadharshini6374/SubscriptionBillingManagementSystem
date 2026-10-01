import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  HardDrive,
  FolderKanban,
  Users,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const {
    currentCustomer,
    plans,
    subscriptions,
    invoices,
    setViewingInvoice,
    retryPayment,
    simulationDate
  } = useBilling();

  const activeSub = subscriptions.find(
    s => s.customerId === currentCustomer?.id && (s.status === 'active' || s.status === 'trialing' || s.status === 'past_due' || s.status === 'paused')
  );

  const plan = plans.find(p => p.id === activeSub?.planId);

  // Customer's invoices
  const customerInvoices = invoices.filter(i => i.customerId === currentCustomer?.id);
  const latestInvoice = customerInvoices[0];

  // Calculate days until renewal
  const calculateDaysRemaining = (endDateStr?: string) => {
    if (!endDateStr) return 0;
    const now = new Date(simulationDate).getTime();
    const end = new Date(endDateStr).getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const daysRemaining = calculateDaysRemaining(activeSub?.currentPeriodEnd);

  // Usage percentages
  const usage = currentCustomer?.usage || {
    projectsUsed: 0,
    projectsLimit: 5,
    storageUsedGB: 0,
    storageLimitGB: 5,
    teamSeatsUsed: 1,
    teamSeatsLimit: 1
  };

  const getPercentage = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 25; // representative
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const handleRetryDunning = () => {
    if (latestInvoice && latestInvoice.status === 'failed') {
      retryPayment(latestInvoice.id, 'card', { cardBrand: 'Visa', cardLast4: '4242' });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      
      {/* Past Due Warning Alert */}
      {activeSub?.status === 'past_due' && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Payment Overdue: Renewal payment failed
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Your card was declined on the last renewal. Update payment details or retry to prevent workspace disruption.
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryDunning}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 shadow-md shadow-rose-600/20 transition-all"
          >
            Retry Payment Now
          </button>
        </div>
      )}

      {/* Customer Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {currentCustomer?.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Managing subscription & billing for <strong className="text-slate-700 dark:text-slate-300">{currentCustomer?.company}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('plans')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse / Change Plans</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Current Subscription & Usage Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Subscription Overview */}
        <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Current Active Plan
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  {plan ? plan.name : 'No Active Plan'}
                </h2>
                {activeSub && <Badge status={activeSub.status} />}
              </div>
              <p className="text-xs text-indigo-200/80 mt-1 max-w-md">
                {plan?.description || 'Browse our plans to get full access to storage and features.'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-indigo-300">Billing Cycle</span>
              <div className="text-sm font-bold uppercase tracking-wider text-white">
                {activeSub ? activeSub.billingCycle : 'N/A'}
              </div>
            </div>
          </div>

          {/* Pricing & Renewal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-800/50 text-xs">
            <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-800/30">
              <span className="text-indigo-300 text-[11px] block">Recurring Amount</span>
              <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                ₹{activeSub ? activeSub.nextBillingAmount.toLocaleString('en-IN') : 0}
              </span>
              <span className="text-[10px] text-indigo-300/70">
                per {activeSub?.billingCycle === 'monthly' ? 'month' : activeSub?.billingCycle === 'quarterly' ? 'quarter' : 'year'}
              </span>
            </div>

            <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-800/30">
              <span className="text-indigo-300 text-[11px] block">Renewal Date</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {activeSub?.currentPeriodEnd || 'N/A'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {daysRemaining} days remaining
              </span>
            </div>

            <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-800/30">
              <span className="text-indigo-300 text-[11px] block">Auto-Renew</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {activeSub?.autoRenew ? 'Enabled (Automatic)' : 'Disabled'}
              </span>
              <span className="text-[10px] text-indigo-300/70">
                {activeSub?.cancelAtPeriodEnd ? 'Cancels at cycle end' : 'Renews on schedule'}
              </span>
            </div>
          </div>

          {/* Quick links footer */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('subscription')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow transition-all flex items-center gap-1.5"
            >
              <span>Manage Subscription</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('invoices')}
              className="px-4 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 text-white text-xs font-semibold border border-indigo-700/60 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoices & Billing History</span>
            </button>
          </div>

        </div>

        {/* Right 1 Col: Usage Progress Bars */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Resource Usage
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Limits per plan
              </span>
            </div>

            <div className="mt-6 space-y-6">
              
              {/* Projects */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4 text-indigo-500" />
                    Active Projects
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {usage.projectsUsed} / {usage.projectsLimit === 'unlimited' ? '∞' : usage.projectsLimit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${getPercentage(usage.projectsUsed, usage.projectsLimit)}%` }}
                  />
                </div>
              </div>

              {/* Cloud Storage */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-purple-500" />
                    Cloud Storage
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {usage.storageUsedGB} GB / {usage.storageLimitGB} GB
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${getPercentage(usage.storageUsedGB, usage.storageLimitGB)}%` }}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-500" />
                    Team Seats
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {usage.teamSeatsUsed} / {usage.teamSeatsLimit === 'unlimited' ? '∞' : usage.teamSeatsLimit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${getPercentage(usage.teamSeatsUsed, usage.teamSeatsLimit)}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('plans')}
              className="w-full py-2 rounded-xl text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 transition-colors"
            >
              Need more resources? Upgrade plan →
            </button>
          </div>

        </div>

      </div>

      {/* Recent Invoices Table */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent Billing Invoices
            </h3>
            <p className="text-xs text-slate-500">
              Download tax receipts and review charge breakdowns
            </p>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all invoices
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Plan / Description</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customerInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No invoices generated yet. Subscribe to a plan to see receipts here.
                  </td>
                </tr>
              ) : (
                customerInvoices.slice(0, 4).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {inv.issueDate}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {inv.items[0]?.description || 'Subscription'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center justify-end gap-1 ml-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
