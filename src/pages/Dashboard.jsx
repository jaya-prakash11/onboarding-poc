import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
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
            Open the organization page to create a new record, patch existing
            details, or delete an organization.
          </p>

          <div className="mt-6">
            <Link
              to="/add-organization"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Manage Organizations
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
