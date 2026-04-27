import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authAPI, authService } from "../api/auth";

function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const resetSuccess = searchParams.get("reset") === "success";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authAPI.login(email, password);
      authService.setTokens(
        result.tokens.accessToken,
        result.tokens.refreshToken,
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-[65%] h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Flyersoft Admin Panel
          </h1>
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Welcome Back!
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Please login to your account
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center">
        <form
          className="bg-white p-8 rounded-lg w-[80%] "
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {resetSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              Password reset successful! Please login with your new password.
            </div>
          )}
          <div className="mb-4 text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
            <span className="text-gray-300"> | </span>
            <Link
              to="/set-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Set up password
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
