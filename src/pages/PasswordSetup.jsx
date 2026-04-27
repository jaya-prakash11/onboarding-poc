import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth";

function PasswordSetup() {
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
        setError("Invalid setup link. No token provided.");
        setValidating(false);
        return;
      }

      try {
        const data = await authAPI.validatePasswordToken(token);
        setTokenData(data);
      } catch (err) {
        setError("Invalid or expired setup link.");
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

    // Password validation: uppercase, lowercase, number, special char, min 8 chars
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
      );
      return;
    }

    setLoading(true);

    try {
      await authAPI.setPassword(token, password);
      navigate("/login?setup=success");
    } catch (err) {
      setError(err.message || "Failed to set password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex h-screen w-screen">
        <div className="flex w-[65%] h-screen bg-gray-100">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-4xl font-bold text-gray-800 mt-20">
              Flyersoft Admin Panel
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Validating setup link...
            </p>
          </div>
        </div>
        <div className="flex w-[35%] h-screen bg-white justify-center items-center">
          <div className="text-gray-500">Loading...</div>
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
            Set Up Your Password
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Create a secure password for your account
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center">
        <form
          className="bg-white p-8 rounded-lg w-[80%]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Password Setup
          </h2>

          {tokenData && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md text-sm">
              Setting password for: <strong>{tokenData.email}</strong>
              <br />
              Organization: {tokenData.organization}
            </div>
          )}

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
              placeholder="At least 8 characters"
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
              placeholder="Re-enter password"
              required
            />
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="list-disc list-inside">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !tokenData}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400"
          >
            {loading ? "Setting Password..." : "Set Password"}
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

export default PasswordSetup;
