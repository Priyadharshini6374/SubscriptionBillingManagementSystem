import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import { AmbientBackground } from "../components/UI";
import { IconSparkles, IconEye, IconAlertCircle } from "../components/Icons";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check the role returned by the backend
      if (data.user.role === "ADMIN") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
        return;
      }

      if (data.user.role === "CUSTOMER") {
        localStorage.setItem("customerToken", data.token);
        localStorage.setItem("customerUser", JSON.stringify(data.user));
        navigate("/customer/dashboard");
        return;
      }

      setError("Invalid user role.");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#060913] text-slate-100 overflow-hidden">
      <AmbientBackground />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-white/20 mb-4">
              <span className="text-2xl font-black text-white">S</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">SubBill</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Subscription & Recurring Billing Management
            </p>
          </div>

          {/* Quick Role Hint */}
          <div className="mb-6 flex items-center justify-center gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400">
            <IconSparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unified sign-in for Administrators and Customers</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:ring-0"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full glass-input rounded-xl px-4 py-3 pr-11 text-sm placeholder-slate-500 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <IconEye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 backdrop-blur-md p-3 text-xs font-medium text-rose-300 flex items-center gap-2.5 animate-fadeIn">
                <IconAlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 px-4 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in to Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
            Protected by enterprise-grade encryption & token security
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
