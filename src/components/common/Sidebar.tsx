import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Layers,
  Users,
  Repeat,
  FileText,
  CreditCard,
  Tag,
  TrendingUp,
  Settings,
  Sparkles,
  RotateCcw,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, currentCustomer, analytics } = useBilling();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'plans', label: 'Plans Management', icon: <Layers className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Repeat className="w-4 h-4" />, badge: analytics.activeSubscriptionsCount },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons & Promo', icon: <Tag className="w-4 h-4" /> },
    { id: 'analytics', label: 'Revenue Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const customerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'plans', label: 'Browse Plans', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'subscription', label: 'Current Plan', icon: <Layers className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices & Receipts', icon: <FileText className="w-4 h-4" /> },
    { id: 'history', label: 'Payment History', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const financeNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Finance Overview', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenue & Yield', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'refunds', label: 'Refunds & Disputes', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'reports', label: 'Export Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  const currentNavItems = role === 'admin' ? adminNavItems : role === 'customer' ? customerNavItems : financeNavItems;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] text-slate-300">
      
      {/* Navigation Links */}
      <div className="p-4 space-y-6">
        
        {/* Role identifier badge in sidebar */}
        <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Role
            </span>
            <span className="text-xs font-bold text-white capitalize">
              {role === 'finance' ? 'Finance Manager' : role}
            </span>
          </div>
          <span className={`w-2 h-2 rounded-full ${
            role === 'admin' ? 'bg-indigo-400' : role === 'customer' ? 'bg-emerald-400' : 'bg-amber-400'
          }`} />
        </div>

        {/* Links list */}
        <nav className="space-y-1">
          {currentNavItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/80">
        {role === 'customer' && currentCustomer && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <img
              src={currentCustomer.avatar}
              alt={currentCustomer.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="truncate text-xs">
              <div className="font-bold text-white truncate">{currentCustomer.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentCustomer.company}</div>
            </div>
          </div>
        )}

        {role === 'admin' && (
          <div className="text-xs text-slate-500 space-y-1 px-1">
            <div className="flex justify-between">
              <span>Engine Status:</span>
              <span className="text-emerald-400 font-semibold">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span>Recurring MRR:</span>
              <span className="font-mono text-slate-300 font-bold">₹{analytics.mrr.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {role === 'finance' && (
          <div className="text-[11px] text-slate-500 px-1 text-center">
            Finance & Audit Clearance Active
          </div>
        )}
      </div>

    </aside>
  );
};
