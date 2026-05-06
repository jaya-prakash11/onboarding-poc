import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService, organizationAPI } from "../api/auth";

function getOrganizationDetails(response) {
  return response?.organization ?? response?.data ?? response ?? null;
}

function getUsers(response) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.users ?? response?.data ?? [];
}

function formatValue(value) {
  return value || "Not available";
}

function Dashboard() {
  const isSuperAdmin = authService.isSuperAdmin();
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [organizationError, setOrganizationError] = useState("");
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    const loadOrganizationDetails = async () => {
      setOrganizationLoading(true);
      setOrganizationError("");

      try {
        const response = await organizationAPI.getCurrent();
        setOrganization(getOrganizationDetails(response));
      } catch (error) {
        setOrganizationError(
          error.message || "Failed to load organization details.",
        );
      } finally {
        setOrganizationLoading(false);
      }
    };

    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError("");

      try {
        const response = await organizationAPI.listUsers();
        setUsers(getUsers(response));
      } catch (error) {
        setUsersError(error.message || "Failed to load organization users.");
      } finally {
        setUsersLoading(false);
      }
    };

    loadOrganizationDetails();
    loadUsers();
  }, []);

  // if (!isSuperAdmin) {
  //   // Non-Super Admin sees limited dashboard
  //   return (
  //     <div
  //       className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10"
  //       style={{ paddingTop: "80px" }}
  //     >
  //       <div className="mx-auto max-w-5xl space-y-6">
  //         <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
  //           <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
  //             Workspace
  //           </p>
  //           <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
  //             Org Dashboard
  //           </h1>
  //           <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
  //             Welcome to your organization dashboard.
  //           </p>
  //         </section>
  //       </div>
  //     </div>
  //   );
  // }

  // Super Admin sees full dashboard
  return (
    <div
      className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10"
      style={{ paddingTop: "80px" }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
            Admin Workspace
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Manage organization onboarding, admin contacts, and organization
            updates from a single workspace.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">
            Organization Actions
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Open the organization page to create a new organization and verify
            your organization.
          </p>

          <div className="mt-6">
            <Link
              to="/add-organization"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Organizations
            </Link>
          </div>
        </section>

        {isSuperAdmin ? (
          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">
              View Organizations
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse all organizations and search by email domain.
            </p>

            <div className="mt-6">
              <Link
                to="/view-organizations"
                className="inline-flex items-center justify-center rounded-xl border border-blue-600 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                View Organizations
              </Link>
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Organization List
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Review your organization details and users.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Organization Details
              </h3>

              {organizationLoading ? (
                <p className="mt-4 text-sm text-slate-500">
                  Loading organization details...
                </p>
              ) : organizationError ? (
                <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {organizationError}
                </div>
              ) : organization ? (
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {formatValue(
                        organization.organizationName ?? organization.name,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Domain
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {formatValue(organization.domain)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Contact Email
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {formatValue(organization.contactEmail)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Contact Phone
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {formatValue(organization.contactPhone)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {formatValue(organization.status)}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No organization details found.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Users</h3>

              {usersLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading users...</p>
              ) : usersError ? (
                <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {usersError}
                </div>
              ) : users.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No users found for this organization.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase text-slate-400">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id ?? user.email}>
                          <td className="px-3 py-3 font-medium text-slate-900">
                            {formatValue(
                              user.name ??
                                [user.firstName, user.lastName]
                                  .filter(Boolean)
                                  .join(" "),
                            )}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            {formatValue(user.email)}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            {formatValue(user.role)}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            {formatValue(user.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
