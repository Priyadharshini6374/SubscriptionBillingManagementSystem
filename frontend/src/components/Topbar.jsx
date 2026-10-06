import LogoutButton from "./LogoutButton";

function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-8">

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Admin Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-5">

          <button
            className="text-xl text-gray-600 hover:text-gray-900"
            title="Notifications"
          >
            🔔
          </button>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              A
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">
                Admin
              </p>
              <p className="text-xs text-gray-500">
                Administrator
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