import { useNavigate } from "react-router-dom";
import { IconLogout } from "./Icons";

function CustomerLogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 backdrop-blur-md transition hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-white cursor-pointer shadow-sm"
      title="Sign out of customer portal"
    >
      <IconLogout className="w-3.5 h-3.5" />
      <span>Sign out</span>
    </button>
  );
}

export default CustomerLogoutButton;
