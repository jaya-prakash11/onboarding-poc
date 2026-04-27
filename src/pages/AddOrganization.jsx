import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizationAPI } from "../api/auth";

const emptyForm = {
  organizationName: "",
  contactEmail: "",
  contactPhone: "",
  domain: "",
  adminEmail: "",
  adminFirstName: "",
  adminLastName: "",
};

function AddOrganization() {
  const [formData, setFormData] = useState(emptyForm);
  const [organizations, setOrganizations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeOrganizations = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.organizations)) {
      return response.organizations;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await organizationAPI.list();
        setOrganizations(normalizeOrganizations(response));
      } catch (error) {
        setErrorMessage(error.message || "Failed to load organizations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  async function loadOrganizations() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await organizationAPI.list();
      setOrganizations(normalizeOrganizations(response));
    } catch (error) {
      setErrorMessage(error.message || "Failed to load organizations.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      if (editingId) {
        await organizationAPI.update(editingId, formData);
        setStatusMessage("Organization updated successfully.");
      } else {
        await organizationAPI.create(formData);
        setStatusMessage("Organization created successfully.");
      }

      resetForm();
      await loadOrganizations();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save organization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (organization) => {
    setFormData({
      organizationName: organization.organizationName,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      domain: organization.domain,
      adminEmail: organization.adminEmail,
      adminFirstName: organization.adminFirstName,
      adminLastName: organization.adminLastName,
    });
    setEditingId(organization.id);
    setStatusMessage(`Editing ${organization.organizationName}.`);
    setErrorMessage("");
  };

  const handleDelete = async (organizationId) => {
    const organizationToDelete = organizations.find(
      (organization) => organization.id === organizationId,
    );

    setErrorMessage("");
    setStatusMessage("");

    try {
      await organizationAPI.remove(organizationId);

      if (editingId === organizationId) {
        resetForm();
      }

      setStatusMessage(
        organizationToDelete
          ? `${organizationToDelete.organizationName} deleted successfully.`
          : "Organization deleted successfully.",
      );
      await loadOrganizations();
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete organization.");
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

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {editingId ? "Patch Organization" : "Add Organization"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in the organization and admin details below.
                </p>
              </div>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              ) : null}
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
                    Domain
                  </label>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="adminEmail" className={labelClass}>
                    Admin Email
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="adminFirstName" className={labelClass}>
                    Admin First Name
                  </label>
                  <input
                    type="text"
                    id="adminFirstName"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="adminLastName" className={labelClass}>
                    Admin Last Name
                  </label>
                  <input
                    type="text"
                    id="adminLastName"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {isSubmitting
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Patch Organization"
                      : "Create Organization"}
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

          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Saved Organizations
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review, patch, or delete organizations you already created.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {organizations.length} total
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  Loading organizations...
                </div>
              ) : organizations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  No organizations yet. Create one using the form.
                </div>
              ) : (
                organizations.map((organization) => (
                  <article
                    key={organization.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {organization.organizationName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {organization.domain}
                          </p>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p>
                            <span className="font-medium text-slate-800">
                              Contact:
                            </span>{" "}
                            {organization.contactEmail}
                          </p>
                          <p>
                            <span className="font-medium text-slate-800">
                              Phone:
                            </span>{" "}
                            {organization.contactPhone}
                          </p>
                          <p>
                            <span className="font-medium text-slate-800">
                              Admin:
                            </span>{" "}
                            {organization.adminFirstName}{" "}
                            {organization.adminLastName}
                          </p>
                          <p>
                            <span className="font-medium text-slate-800">
                              Admin Email:
                            </span>{" "}
                            {organization.adminEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(organization)}
                          className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          Patch
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(organization.id)}
                          className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AddOrganization;
