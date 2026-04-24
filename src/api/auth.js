const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const authAPI = {
  login: async (email, password) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  refresh: async (refreshToken) => {
    return fetchAPI("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  forgotPassword: async (email, resetUrl) => {
    return fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email, resetUrl }),
    });
  },

  validatePasswordToken: async (token) => {
    return fetchAPI("/auth/password/validate", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  setPassword: async (token, password) => {
    return fetchAPI("/auth/password/set", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },
};

export const authService = {
  setTokens: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export const organizationAPI = {
  create: async (data) => {
    return fetchAPI("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  list: async () => {
    return fetchAPI("/organizations", {
      method: "GET",
    });
  },

  getCurrent: async () => {
    return fetchAPI("/organizations/me", {
      method: "GET",
    });
  },

  listUsers: async () => {
    return fetchAPI("/organizations/users", {
      method: "GET",
    });
  },
};
