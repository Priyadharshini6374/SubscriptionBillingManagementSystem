import { useNavigate } from "react-router-dom";

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
      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
    >
      Logout
    </button>
  );
}

export default CustomerLogoutButton;