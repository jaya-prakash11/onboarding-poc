import { useState } from "react";
import { Link } from "react-router-dom";
import { organizationAPI } from "../api/auth";

const emptyForm = {
  organizationName: "",
  contactEmail: "",
  contactPhone: "",
  domain: "",
};

function AddOrganization() {
  const [formData, setFormData] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await organizationAPI.create(formData);
      setStatusMessage(
        "Organization created successfully. Check your email for verification.",
      );
      resetForm();
    } catch (error) {
      setErrorMessage(error.message || "Failed to create organization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
            Flyersoft Admin Panel
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Organization Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Create organizations, patch existing details, and delete records
            from one place.
          </p>
        </div>

        <div className="grid gap-6">
          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Create Organization
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in the organization details below. You will receive a
                  verification email.
                </p>
              </div>
            </div>

            {statusMessage ? (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {statusMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="organizationName" className={labelClass}>
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className={labelClass}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className={labelClass}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="domain" className={labelClass}>
                    Domain (optional)
                  </label>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AddOrganization;
