import LogoutButton from "./LogoutButton";
import { IconBell, IconMenu } from "./Icons";

function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  return (
    <header className="fixed left-0 lg:left-64 right-0 top-0 z-30 h-16 border-b border-white/10 bg-[#080d1a]/75 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-full items-center justify-between px-4 sm:px-8">
        {/* Left: Mobile hamburger & breadcrumb title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition"
            aria-label="Open sidebar"
          >
            <IconMenu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              Admin Workspace
            </h2>
          </div>
        </div>

        {/* Right: Notifications, User Pill, Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent hover:border-white/10 transition cursor-pointer"
            title="Notifications"
          >
            <IconBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.9)]" />
          </button>

          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_12px_rgba(99,102,241,0.4)] border border-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-indigo-300/80 font-medium">
                {user?.role || "ADMIN"}
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
