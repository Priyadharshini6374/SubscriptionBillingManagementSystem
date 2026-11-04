import { NavLink } from "react-router-dom";
import CustomerLogoutButton from "./CustomerLogoutButton";
import {
  IconDashboard,
  IconPlans,
  IconSubscriptions,
  IconInvoices,
  IconPayments,
} from "./Icons";

function CustomerNavbar() {
  const customer = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  const links = [
    { name: "Dashboard", path: "/customer/dashboard", icon: IconDashboard },
    { name: "My Subscription", path: "/customer/subscription", icon: IconSubscriptions },
    { name: "Invoices", path: "/customer/invoices", icon: IconInvoices },
    { name: "Payments", path: "/customer/payments", icon: IconPayments },
    { name: "Plans", path: "/customer/plans", icon: IconPlans },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#080d1a]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(56,189,248,0.4)] border border-white/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">SubBill</span>
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-sky-500/20 text-sky-300 rounded border border-sky-500/30">
                Customer
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links for tablet/desktop */}
        <nav className="hidden md:flex items-center gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-indigo-600/80 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right user info & logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">
              {customer?.name || "Customer"}
            </p>
            <p className="text-[10px] text-slate-400">
              {customer?.email || ""}
            </p>
          </div>

          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs border border-white/20 shadow-sm">
            {customer?.name ? customer.name.charAt(0).toUpperCase() : "C"}
          </div>

          <CustomerLogoutButton />
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-white/5 px-2 py-2 overflow-x-auto bg-[#070b16]/60">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${
                  isActive
                    ? "text-indigo-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
}

export default CustomerNavbar;
