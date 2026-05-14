import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, organizationAPI } from "../api/auth";

function getOrganizationDetails(response) {
  return response?.organization ?? response?.data ?? response ?? null;
}

function getUserDetails(response) {
  return response?.user ?? response?.data ?? response ?? null;
}

function formatValue(value) {
  return value || "Not available";
}

function getUserName(user) {
  return (
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Not available"
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = authService.getUser();
  const userRole = currentUser?.role;
  const isSuperAdmin = authService.isSuperAdmin();
  const isMember = userRole === "MEMBER";
  const [organization, setOrganization] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(isMember);
  const [organizationError, setOrganizationError] = useState("");
  const [userError, setUserError] = useState("");
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handlePlanSelection = (path) => {
    setIsSubscriptionModalOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const loadOrganizationDetails = async () => {
      if (isMember) {
        setOrganizationLoading(false);
        return;
      }

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

    const loadUserDetails = async () => {
      if (!isMember) {
        setUserLoading(false);
        return;
      }

      const userId = currentUser?.id ?? currentUser?.sub;
      if (!userId) {
        setUserError("Unable to find the signed-in user id.");
        setUserLoading(false);
        return;
      }

      setUserLoading(true);
      setUserError("");

      try {
        const response = await organizationAPI.getUser(userId);
        setUserDetails(getUserDetails(response));
      } catch (error) {
        setUserError(error.message || "Failed to load user details.");
      } finally {
        setUserLoading(false);
      }
    };

    loadOrganizationDetails();
    loadUserDetails();
  }, [currentUser?.id, currentUser?.sub, isMember]);

  if (isMember) {
    return (
      <div
        className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10"
        style={{ paddingTop: "80px" }}
      >
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
              User Profile
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              View your account information.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">
              User Information
            </h2>

            {userLoading ? (
              <p className="mt-4 text-sm text-slate-500">
                Loading user details...
              </p>
            ) : userError ? (
              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {userError}
              </div>
            ) : userDetails ? (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">
                    User ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-slate-700">
                    {formatValue(userDetails.id)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {getUserName(userDetails)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-1 break-all text-sm font-medium text-slate-900">
                    {formatValue(userDetails.email)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">
                    Role
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {formatValue(userDetails.role)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {formatValue(userDetails.status)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">
                    Organization ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-slate-700">
                    {formatValue(userDetails.organizationId)}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No user details found.
              </p>
            )}
          </section>
        </div>
      </div>
    );
  }

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
            <button
              type="button"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Organizations
            </button>
          </div>
        </section>

        {!isSuperAdmin ? (
          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">
              User Actions
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Open user management to review all users in the system.
            </p>

            <div className="mt-6">
              <Link
                to="/manage-users"
                // className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Manage Users
              </Link>
            </div>
          </section>
        ) : null}

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

        {!isSuperAdmin ? (
          <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Organization Details
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Review your organization details.
                </p>
              </div>
            </div>

            <div className="mt-6">
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
            </div>
          </section>
        ) : null}
      </div>

      {isSubscriptionModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscription-modal-title"
        >
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 text-left shadow-2xl ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Subscription
                </p>
                <h2
                  id="subscription-modal-title"
                  className="mt-2 text-2xl font-semibold text-slate-900"
                >
                  Choose a plan
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Select the tier that matches how many organizations you need
                  to create.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-xl leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Close subscription modal"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-xl font-semibold text-slate-900">
                  Free Tier
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>Free plan access</li>
                  <li>1 organization creation</li>
                  <li>Basic organization onboarding</li>
                  <li>Expires after 30 days</li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanSelection("/add-organization")}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Continue with Free
                </button>
              </article>

              <article className="flex h-full flex-col rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-xl font-semibold text-slate-900">
                  Paid Tier 2
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>Create more than one organization</li>
                  <li>Designed for growing admin teams</li>
                  <li>Upgrade before continuing onboarding</li>
                  <li>Unlimited use</li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanSelection("/payment-processing")}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Continue with Paid
                </button>
              </article>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
