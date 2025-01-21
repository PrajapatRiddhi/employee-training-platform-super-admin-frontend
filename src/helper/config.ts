const getEnvironment = () => {
  switch (process.env.NEXT_PUBLIC_ENV_TYPE) {
    case "production":
      return "production";
    case "staging":
      return "staging";
    case "development":
      return "development";
    default:
      return "development";
  }
};
const apiPath = {
  v0: "/api",
};
const getAPIBaseUrl = () => {
  switch (process.env.NEXT_PUBLIC_ENV_TYPE) {
    case "production":
      return "http://45.79.111.106:3200";
    case "staging":
      return "http://45.79.111.106:3200";
    case "development":
      return "http://45.79.111.106:3200";
    default:
      return "http://45.79.111.106:3200";
    // return "http://localhost:3200";
  }
};
export const getSubdomain = (req?: any) => {
  // if (typeof window === "undefined") return null; // Prevents execution on the server
  const hostname = req ? req.headers.host : window.location.hostname;
  const searchParams = req
    ? new URLSearchParams(req.url.split("?")[1])
    : new URLSearchParams(window.location.search);

  const tenantFromQuery = searchParams.get("tenant");
  console.log("tenantFromQuery :>> ", tenantFromQuery);

  console.log("hostname :>> ", tenantFromQuery);

  if (process.env.NEXT_PUBLIC_ENV_TYPE === "local") {
    console.log("hostname :>> ", hostname.split(":")[0].split(".")[0]);
    return hostname.split(":")[0].split(".")[0];
  }

  // Handle non-local environments
  if (
    process.env.NEXT_PUBLIC_ENV_TYPE === "staging" ||
    process.env.NEXT_PUBLIC_ENV_TYPE === "production" ||
    process.env.NEXT_PUBLIC_ENV_TYPE === "development"
  ) {
    const parts = hostname.split(".");

    // If hostname is an IP address or localhost (likely 1 or 2 parts in hostname)
    const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname); // Check if it's an IP address
    if (tenantFromQuery) {
      return tenantFromQuery;
    }

    // If it's a normal hostname with a subdomain
    if (parts.length > 2) {
      return parts[0]; // Return the subdomain as the tenant
    }

    return null;
  } else {
    return tenantFromQuery;
  }
};
const downloadFile = (fileUrl: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const statusData = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
export const config = {
  environment: getEnvironment(),
  apiPath,
  apiBaseUrl: getAPIBaseUrl(),
  getSubdomain,
  downloadFile,
  statusData,
};
