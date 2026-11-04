import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import { AmbientBackground } from "../components/UI";
import { IconEye, IconAlertCircle } from "../components/Icons";

function CustomerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
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
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Allow only CUSTOMER accounts
      if (data.user.role !== "CUSTOMER") {
        setError("This login is only for customer accounts.");
        return;
      }

      // Store customer authentication data
      localStorage.setItem("customerToken", data.token);
      localStorage.setItem("customerUser", JSON.stringify(data.user));

      // Go to customer dashboard
      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Customer login error:", error);
      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#060913] text-slate-100 overflow-hidden">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-[0_0_25px_rgba(56,189,248,0.4)] border border-white/20 mb-4">
              <span className="text-2xl font-black text-white">S</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Customer Portal
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage your subscriptions and invoices
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-950/40 backdrop-blur-md p-3 text-xs font-medium text-rose-300 flex items-center gap-2.5">
              <IconAlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="customer@example.com"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:ring-0"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl px-4 py-3 pr-11 text-sm placeholder-slate-500 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <IconEye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Login Button */}
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
                <span>Access Portal</span>
              )}
            </button>
          </form>

          {/* Admin Switch */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-400">
              Need administrator access?
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              ← Back to Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
