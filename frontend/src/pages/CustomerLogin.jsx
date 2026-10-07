import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

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

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Allow only CUSTOMER accounts
      if (data.user.role !== "CUSTOMER") {
        setError(
          "This login is only for customer accounts."
        );
        return;
      }

      // Store customer authentication data
      localStorage.setItem("customerToken", data.token);
      localStorage.setItem(
        "customerUser",
        JSON.stringify(data.user)
      );

      // Go to customer dashboard
      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Customer login error:", error);

      setError(
        error.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            SubBill
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Customer Portal
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Customer Login
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage your subscription and billing.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 003 3"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A9.77 9.77 0 0112 4.75c5 0 8.27 4.5 9.5 7.25a15.8 15.8 0 01-3.08 4.33"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.61 6.61C4.62 6.61 4.62 8.03 3.27 10.1 2.5 12c1.23 2.75 4.5 7.25 9.5 7.25 1.61 0 3.04-.4 4.31-1.03"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7.25 9.5-7.25S21.5 12 21.5 12 18 19.25 12 19.25 2.5 12 2.5 12z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          {/* Admin Login */}
          <div className="mt-6 border-t border-gray-200 pt-5 text-center">

            <p className="text-sm text-gray-500">
              Are you an administrator?
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-2 text-sm font-semibold text-gray-900 hover:underline"
            >
              Admin Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerLogin;