import { useNavigate } from "react-router-dom";
import { IconLogout } from "./Icons";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 backdrop-blur-md transition hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-white cursor-pointer shadow-sm"
      title="Sign out of account"
    >
      <IconLogout className="w-3.5 h-3.5" />
      <span>Sign out</span>
    </button>
  );
}

export default LogoutButton;
