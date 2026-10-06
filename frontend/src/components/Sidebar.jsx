import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "Plans",
      path: "/plans",
      icon: "📦",
    },
    {
      name: "Customers",
      path: "/customers",
      icon: "👥",
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
      icon: "🔄",
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: "🧾",
    },
    {
      name: "Payments",
      path: "/payments",
      icon: "💳",
    },
    {
      name: "Coupons",
      path: "/coupons",
      icon: "🎟️",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📈",
    },
    {
      name: "Refunds",
      path: "/refunds",
      icon: "↩️",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📋",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white">

      {/* Logo */}
      <div className="border-b border-gray-700 p-6">
        <h1 className="text-2xl font-bold">
          SubBill
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Billing Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>
    </aside>
  );
}

export default Sidebar;