import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { organizationAPI } from "../api/auth";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    contactPhone: "",
    contactEmail: "",
    domain: "",
    organizationName: "",
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
      await organizationAPI.create(formData);
      // After successful registration, redirect to login
      // The API will send an email with the password setup link
      navigate("/login?registered=true");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            Create Organization
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Register your organization to get started
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center overflow-y-auto">
        <form
          className="bg-white p-8 rounded-lg w-[80%]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Organization Registration
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Admin First Name */}
          <div className="mb-3">
            <label htmlFor="adminFirstName" className={labelClass}>
              Admin First Name *
            </label>
            <input
              type="text"
              name="adminFirstName"
              id="adminFirstName"
              value={formData.adminFirstName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Admin Last Name */}
          <div className="mb-3">
            <label htmlFor="adminLastName" className={labelClass}>
              Admin Last Name *
            </label>
            <input
              type="text"
              name="adminLastName"
              id="adminLastName"
              value={formData.adminLastName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Admin Email */}
          <div className="mb-3">
            <label htmlFor="adminEmail" className={labelClass}>
              Admin Email *
            </label>
            <input
              type="email"
              name="adminEmail"
              id="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Contact Phone */}
          <div className="mb-3">
            <label htmlFor="contactPhone" className={labelClass}>
              Contact Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              id="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Contact Email */}
          <div className="mb-3">
            <label htmlFor="contactEmail" className={labelClass}>
              Contact Email *
            </label>
            <input
              type="email"
              name="contactEmail"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Domain */}
          <div className="mb-3">
            <label htmlFor="domain" className={labelClass}>
              Domain
            </label>
            <input
              type="text"
              name="domain"
              id="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="example.com"
              className={inputClass}
            />
          </div>

          {/* Organization Name */}
          <div className="mb-4">
            <label htmlFor="organizationName" className={labelClass}>
              Organization Name *
            </label>
            <input
              type="text"
              name="organizationName"
              id="organizationName"
              value={formData.organizationName}
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
            {loading ? "Registering..." : "Register Organization"}
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
