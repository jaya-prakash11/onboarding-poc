import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { organizationAPI } from "../api/auth";

const initialFormData = {
  email: "",
  firstName: "",
  lastName: "",
  role: "MEMBER",
};

function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await organizationAPI.createUser({
        email: formData.email.trim(),
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        role: formData.role,
      });
      setSuccess(response.message || "User created successfully.");
      setFormData(initialFormData);

      setTimeout(() => {
        navigate("/manage-users");
      }, 900);
    } catch (err) {
      setError(err.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10"
      style={{ paddingTop: "80px" }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
            User Actions
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Create User</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Add a user to the current organization and send a password setup
            email.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                User Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the user information and choose their organization role.
              </p>
            </div>
            <Link
              to="/manage-users"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Users
            </Link>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="new.user@example.com"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-slate-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Grace"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-slate-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Hopper"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="text-sm font-semibold text-slate-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="MEMBER">Member</option>
                <option value="ORG_ADMIN">Organization Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/manage-users"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CreateUser;
