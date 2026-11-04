import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "./Icons";

function BackButton({ to }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="btn-secondary inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer group shadow-sm transition"
      title="Go back"
    >
      <IconArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
      <span>Back</span>
    </button>
  );
}

export default BackButton;
