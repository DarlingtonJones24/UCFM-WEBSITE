const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "") ?? "";
const rawApiBaseUrl = configuredApiBaseUrl || "/api";

const isLocalHost = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const resolveApiBaseUrl = () => {
  if (!rawApiBaseUrl || typeof window === "undefined") {
    return rawApiBaseUrl;
  }

  try {
    const configuredUrl = new URL(rawApiBaseUrl);

    if (isLocalHost(configuredUrl.hostname) && !isLocalHost(window.location.hostname)) {
      configuredUrl.hostname = window.location.hostname;
      return configuredUrl.toString().replace(/\/+$/, "");
    }
  } catch {
    return rawApiBaseUrl;
  }

  return rawApiBaseUrl;
};

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const apiBaseUrl = resolveApiBaseUrl();

  return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
};
