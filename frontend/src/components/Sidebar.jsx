import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  IconDashboard,
  IconPlans,
  IconCustomers,
  IconSubscriptions,
  IconInvoices,
  IconPayments,
  IconCoupons,
  IconAnalytics,
  IconRefunds,
  IconReports,
  IconSettings,
  IconClose,
} from "./Icons";

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    window.addEventListener("close-mobile-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
      window.removeEventListener("close-mobile-sidebar", handleClose);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: IconDashboard },
    { name: "Plans", path: "/plans", icon: IconPlans },
    { name: "Customers", path: "/customers", icon: IconCustomers },
    { name: "Subscriptions", path: "/subscriptions", icon: IconSubscriptions },
    { name: "Invoices", path: "/invoices", icon: IconInvoices },
    { name: "Payments", path: "/payments", icon: IconPayments },
    { name: "Coupons", path: "/coupons", icon: IconCoupons },
    { name: "Analytics", path: "/analytics", icon: IconAnalytics },
    { name: "Refunds", path: "/refunds", icon: IconRefunds },
    { name: "Reports", path: "/reports", icon: IconReports },
    { name: "Settings", path: "/settings", icon: IconSettings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#0a0f1e]/85 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20">
              <span className="text-xl font-black text-white tracking-wider">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">SubBill</h1>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Subscription & Billing</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/80 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Footer info */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="glass-card rounded-xl p-3 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-300">Live API</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
