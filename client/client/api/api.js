api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthCall = url.startsWith("/auth/login") || url.startsWith("/auth/register");
    if (err.response?.status === 401 && !isAuthCall && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);