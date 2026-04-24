import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link. No token provided.");
        setValidating(false);
        return;
      }

      try {
        const data = await authAPI.validatePasswordToken(token);
        setTokenData(data);
      } catch (err) {
        setError("Invalid or expired reset link.");
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await authAPI.setPassword(token, password);
      navigate("/login?reset=success");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-gray-600">Validating reset link...</div>
      </div>
    );
  }

  if (error && !tokenData) {
    return (
      <div className="flex h-screen w-screen">
        <div className="flex w-[65%] h-screen bg-gray-100">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
            <p className="text-lg text-gray-600 mt-4">{error}</p>
            <Link
              to="/forgot-password"
              className="mt-4 text-blue-600 hover:underline"
            >
              Request new reset link
            </Link>
          </div>
        </div>
        <div className="flex w-[35%] h-screen bg-white justify-center items-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-[65%] h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Flyersoft Admin Panel
          </h1>
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Set New Password
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Enter your new password for {tokenData?.email}
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center">
        <form
          className="bg-white p-8 rounded-lg w-[80%]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Reset Password
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="mb-4 text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
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
          <div className="mb-4 text-left">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
