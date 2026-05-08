import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizationAPI } from "../api/auth";

function getUsers(response) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.users ?? response?.data ?? [];
}

function getUser(response) {
  return response?.user ?? response?.data ?? response ?? null;
}

function formatValue(value) {
  return value || "Not available";
}

function getUserName(user) {
  return (
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Not available"
  );
}

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await organizationAPI.listUsers();
        setUsers(getUsers(response));
      } catch (err) {
        setError(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearchError("");

    const trimmedUserId = searchUserId.trim();
    if (!trimmedUserId) {
      setSearchedUser(null);
      setIsSearchActive(false);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await organizationAPI.getUser(trimmedUserId);
      setSearchedUser(getUser(response));
      setIsSearchActive(true);
    } catch (err) {
      setSearchedUser(null);
      setIsSearchActive(true);
      setSearchError(err.message || "Failed to find user.");
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchUserId("");
    setSearchedUser(null);
    setIsSearchActive(false);
    setSearchError("");
  };

  const usersToDisplay = isSearchActive
    ? searchedUser
      ? [searchedUser]
      : []
    : users;

  const handleDelete = async () => {
    if (!userToDelete?.id) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await organizationAPI.deleteUser(userToDelete.id);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userToDelete.id),
      );

      if (searchedUser?.id === userToDelete.id) {
        setSearchedUser(null);
      }

      setUserToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10"
      style={{ paddingTop: "80px" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-left text-white shadow-xl sm:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
            User Actions
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Manage Users
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Review all users returned from the users endpoint.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
              <p className="mt-1 text-sm text-slate-500">
                User records loaded from the /users API.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row">
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  value={searchUserId}
                  onChange={(event) => setSearchUserId(event.target.value)}
                  placeholder="Search by user id"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="inline-flex items-center justify-center rounded-xl border border-blue-600 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-blue-300 disabled:text-blue-300"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </form>
              <Link
                to="/create-user"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create User
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {isSearchActive ? (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 sm:flex-row sm:items-center sm:justify-between">
              <span>Showing search result for user id: {searchUserId}</span>
              <button
                type="button"
                onClick={clearSearch}
                className="text-left font-semibold text-blue-700 hover:underline sm:text-right"
              >
                Clear search
              </button>
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {searchError ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchError}
            </div>
          ) : null}

          {deleteError ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          ) : null}

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading users...</p>
            ) : usersToDisplay.length === 0 ? (
              <p className="text-sm text-slate-500">
                {isSearchActive ? "No user found for that id." : "No users found."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-slate-400">
                      <th className="px-3 py-2">User ID</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {usersToDisplay.map((user) => (
                      <tr key={user.id ?? user.email}>
                        <td className="max-w-52 truncate px-3 py-3 font-mono text-xs text-slate-500">
                          {formatValue(user.id)}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {getUserName(user)}
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
                        <td className="px-3 py-3">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Link
                              to={`/edit-user/${user.id}`}
                              className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError("");
                                setUserToDelete(user);
                              }}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {userToDelete ? (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-left shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-900">
              Delete User
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete {getUserName(userToDelete)}?
            </p>
            <p className="mt-1 break-all text-xs text-slate-500">
              {formatValue(userToDelete.email)}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {deleteLoading ? "Deleting..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ManageUsers;
