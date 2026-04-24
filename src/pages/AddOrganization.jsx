import { useState } from "react";
import { Link } from "react-router-dom";

function AddOrganization() {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    organizationAdmin: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Organization Request:", formData);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-[65%] h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Flyersoft Admin Panel
          </h1>
          <h1 className="text-4xl font-bold text-gray-800 mt-20">
            Onboard Organization
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Add a new organization to the platform
          </p>
        </div>
      </div>
      <div className="flex w-[35%] h-screen bg-white justify-center items-center">
        <form className="bg-white p-8 rounded-lg w-[80%]" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Add Organization
          </h2>
          
          <div className="mb-4">
            <label htmlFor="organizationName" className={labelClass}>
              Organization Name
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

          <div className="mb-4">
            <label htmlFor="organizationEmail" className={labelClass}>
              Organization Email
            </label>
            <input
              type="email"
              name="organizationEmail"
              id="organizationEmail"
              value={formData.organizationEmail}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="organizationAdmin" className={labelClass}>
              Organization Admin
            </label>
            <input
              type="text"
              name="organizationAdmin"
              id="organizationAdmin"
              value={formData.organizationAdmin}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Send Request To
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

export default AddOrganization;