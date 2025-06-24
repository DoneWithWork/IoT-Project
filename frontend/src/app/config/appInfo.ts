
console.log(process.env.NEXT_PUBLIC_DEV_BACKEND_URL)
export const appInfo = {
  appName: "iot_project",
  apiDomain:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL!
      : process.env.NEXT_PUBLIC_PROD_BACKEND_URL!,
  websiteDomain:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_FRONTEND_URL!
      : process.env.NEXT_PUBLIC_PROD_FRONTEND_URL!,
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};
