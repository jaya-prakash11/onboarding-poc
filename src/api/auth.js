const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildRequestOptions(options = {}) {
  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: "include",
  };
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Authentication required.");
  }

  const result = await fetchPublicAPI("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (result.tokens?.accessToken) {
    localStorage.setItem("accessToken", result.tokens.accessToken);
  }

  if (result.tokens?.refreshToken) {
    localStorage.setItem("refreshToken", result.tokens.refreshToken);
  }

  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
}

async function fetchAPI(endpoint, options = {}) {
  let response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    buildRequestOptions(options),
  );

  if (response.status === 401) {
    await refreshAccessToken();
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      buildRequestOptions(options),
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const requestError = new Error(
      error.message || `HTTP error ${response.status}`,
    );
    requestError.status = response.status;
    throw requestError;
  }

  return response.json();
}

async function fetchPublicAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const requestError = new Error(
      error.message || `HTTP error ${response.status}`,
    );
    requestError.status = response.status;
    throw requestError;
  }

  return response.json();
}

function buildOrganizationPayload(data) {
  return {
    organizationName: data.organizationName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    domain: data.domain,
    adminEmail: data.adminEmail,
    adminFirstName: data.adminFirstName,
    adminLastName: data.adminLastName,
  };
}

function buildRegisterOrgPayload(data) {
  const baseUrl = window.location.origin;
  const payload = {
    organizationName: data.organizationName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    domain: data.domain,
    adminEmail: data.adminEmail,
    adminFirstName: data.adminFirstName,
    adminLastName: data.adminLastName,
  };

  if (
    baseUrl &&
    !baseUrl.includes("localhost") &&
    !baseUrl.includes("127.0.0.1")
  ) {
    payload.passwordSetupUrl = `${baseUrl}/password-setup`;
  }

  return payload;
}

function buildSignupPayload(data) {
  const baseUrl = window.location.origin;
  const payload = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  };

  if (
    baseUrl &&
    !baseUrl.includes("localhost") &&
    !baseUrl.includes("127.0.0.1")
  ) {
    payload.passwordSetupUrl = `${baseUrl}/password-setup`;
  }

  return payload;
}

export const authAPI = {
  login: async (email, password) => {
    return fetchPublicAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  refresh: async (refreshToken) => {
    return fetchPublicAPI("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  forgotPassword: async (email, resetUrl) => {
    return fetchPublicAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email, resetUrl }),
    });
  },

  validatePasswordToken: async (token) => {
    return fetchPublicAPI("/auth/password/validate", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  signup: async (data) => {
    return fetchPublicAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify(buildSignupPayload(data)),
    });
  },

  registerOrganization: async (data) => {
    return fetchPublicAPI("/auth/register-organization", {
      method: "POST",
      body: JSON.stringify(buildRegisterOrgPayload(data)),
    });
  },

  setPassword: async (token, password) => {
    return fetchPublicAPI("/auth/password/set", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  logout: async (refreshToken) => {
    return fetchAPI("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};

export const authService = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getUserRole: () => {
    const user = authService.getUser();
    return user?.role || null;
  },

  isSuperAdmin: () => {
    return authService.getUserRole() === "SUPER_ADMIN";
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export const organizationAPI = {
  create: async (data) => {
    return fetchAPI("/organizations", {
      method: "POST",
      body: JSON.stringify({
        organizationName: data.organizationName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        domain: data.domain,
      }),
    });
  },

  verify: async (token) => {
    return fetchPublicAPI("/organizations/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  list: async () => {
    return fetchAPI("/organizations", {
      method: "GET",
    });
  },

  discover: async (domain) => {
    const query = domain ? `?domain=${encodeURIComponent(domain)}` : "";
    return fetchAPI(`/organizations/discover${query}`, {
      method: "GET",
    });
  },

  getCurrent: async () => {
    return fetchAPI("/organizations/me", {
      method: "GET",
    });
  },

  listUsers: async () => {
    return fetchAPI("/users", {
      method: "GET",
    });
  },

  getUser: async (userId) => {
    const encodedUserId = encodeURIComponent(userId);

    return fetchAPI(`/users/${encodedUserId}`, {
      method: "GET",
    });
  },

  createUser: async (data) => {
    const baseUrl = window.location.origin;
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    };

    if (
      baseUrl &&
      !baseUrl.includes("localhost") &&
      !baseUrl.includes("127.0.0.1")
    ) {
      payload.passwordSetupUrl = `${baseUrl}/password-setup`;
    }

    return fetchAPI("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateUser: async (userId, data) => {
    const encodedUserId = encodeURIComponent(userId);
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      status: data.status,
    };

    return fetchAPI(`/users/${encodedUserId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (userId) => {
    const encodedUserId = encodeURIComponent(userId);

    return fetchAPI(`/users/${encodedUserId}`, {
      method: "DELETE",
    });
  },

  update: async (organizationId, data) => {
    return fetchAPI(`/organizations/${organizationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        organizationName: data.organizationName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        domain: data.domain,
      }),
    });
  },

  remove: async (organizationId) => {
    return fetchAPI(`/organizations/${organizationId}`, {
      method: "DELETE",
    });
  },
};
