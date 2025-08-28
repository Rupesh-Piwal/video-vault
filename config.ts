const config = {
  appName: "VideoVault",
  appDescription:
    "VideoVault is video-sharing app.",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://VideoVault.com",
};

export default config;