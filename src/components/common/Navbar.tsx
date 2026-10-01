import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  User,
  DollarSign,
  Calendar,
  Bell,
  CheckCheck,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentCustomerId,
    setCurrentCustomerId,
    customers,
    currentCustomer,
    simulationDate,
    notifications,
    markNotificationRead,
    clearAllNotifications
  } = useBilling();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCustMenu, setShowCustMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleConfigs: Record<UserRole, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
    admin: {
      label: 'Admin',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      desc: 'Full system & plan access'
    },
    customer: {
      label: 'Customer',
      icon: <User className="w-4 h-4 text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      desc: 'Self-serve billing & plans'
    },
    finance: {
      label: 'Finance Manager',
      icon: <DollarSign className="w-4 h-4 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      desc: 'Payments, refunds & reports'
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                BillSphere
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SaaS Billing
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Subscription & Revenue Engine
            </p>
          </div>
        </div>

        {/* Center: Simulation Date Time Machine Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simulated Clock:</span>
          <span className="font-mono font-semibold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            {simulationDate}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sandbox active" />
        </div>

        {/* Right: Role Switcher & Customer Profile & Notifications */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Recent Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Activity Log</span>
                    <span className="text-xs bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-500">No recent notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 text-xs rounded-lg transition-colors cursor-pointer hover:bg-slate-800/70 ${
                          !n.read ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${
                            n.type === 'error' ? 'text-rose-400' :
                            n.type === 'warning' ? 'text-amber-400' :
                            n.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Switcher (Visible in Customer role) */}
          {role === 'customer' && (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowCustMenu(!showCustMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs hover:border-slate-600 transition-colors"
              >
                <img
                  src={currentCustomer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                  alt={currentCustomer?.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-medium text-slate-200 truncate max-w-[120px]">
                  {currentCustomer?.company}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showCustMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Account
                  </div>
                  {customers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCurrentCustomerId(c.id);
                        setShowCustMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        c.id === currentCustomerId ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold">{c.company}</div>
                        <div className="text-[10px] text-slate-400">{c.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${roleConfigs[role].color}`}
            >
              {roleConfigs[role].icon}
              <span>Role: {roleConfigs[role].label}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">Select Active Role</p>
                  <p className="text-[11px] text-slate-400">Experience the app as Admin, Customer or Finance</p>
                </div>
                
                <div className="py-1 space-y-1">
                  {(Object.keys(roleConfigs) as UserRole[]).map((r) => {
                    const cfg = roleConfigs[r];
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                          {cfg.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{cfg.label}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-semibold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                            {cfg.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
