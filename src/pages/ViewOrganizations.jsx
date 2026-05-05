import { useState, useEffect } from "react";
import { organizationAPI } from "../api/auth";

function ViewOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [searchDomain, setSearchDomain] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrganizations = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await organizationAPI.list();
        const data = Array.isArray(response)
          ? response
          : (response.organizations ?? response.data ?? []);
        setOrganizations(data);
      } catch (err) {
        setError(err.message || "Failed to load organizations.");
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");

    if (!searchDomain.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);

    try {
      const response = await organizationAPI.discover(searchDomain.trim());
      const data = response.organizations ?? [];
      setSearchResults(data);
    } catch (err) {
      setError(err.message || "Failed to search organizations.");
    } finally {
      setSearching(false);
    }
  };

  const organizationsToDisplay =
    searchResults !== null ? searchResults : organizations;
  const isSearching = searchResults !== null;

  return (
    <div
      className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10"
      style={{ paddingTop: "80px" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
            Admin Workspace
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            View Organizations
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Review all organizations or search by email domain.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Organization Search
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search organizations by email domain, or leave empty to show all
                organizations.
              </p>
            </div>
            <form
              className="flex w-full gap-3 sm:w-auto"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                value={searchDomain}
                onChange={(event) => setSearchDomain(event.target.value)}
                placeholder="Search by domain (e.g. acme.com)"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-80"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {isSearching ? "Search Results" : "All Organizations"}
              </h3>
              {isSearching ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchDomain("");
                    setSearchResults(null);
                  }}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              ) : null}
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {loading ? (
                <div className="text-sm text-slate-500">
                  Loading organizations...
                </div>
              ) : organizationsToDisplay.length === 0 ? (
                <div className="text-sm text-slate-500">
                  {isSearching
                    ? "No organizations matched that domain."
                    : "No organizations found."}
                </div>
              ) : (
                <div className="space-y-4">
                  {organizationsToDisplay.map((organization) => (
                    <article
                      key={organization.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {organization.name ?? organization.organizationName}
                          </h4>
                          <p className="text-sm text-slate-500">
                            Domain: {organization.domain}
                          </p>
                          <p className="text-sm text-slate-500">
                            Status: {organization.status}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewOrganizations;
