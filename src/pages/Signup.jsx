import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.signup(formData);
      navigate("/login?registered=true");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-[65%] h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Flyersoft Admin Panel
          </h1>
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Create Your Account
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Sign up with your email and name to receive a password setup link.
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center overflow-y-auto">
        <form
          className="bg-white p-8 rounded-lg w-[80%]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Sign Up
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="firstName" className={labelClass}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="lastName" className={labelClass}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className={labelClass}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400"
          >
            {loading ? "Signing up..." : "Create account"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
