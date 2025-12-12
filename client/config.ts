// const config = {
//   appName: "VideoVault",
//   appDescription: "VideoVault is video-sharing app.",
//   domainName: process.env.NEXT_PUBLIC_APP_URL! || "http://localhost:3000",
// };

// export default config;
const config = {
  appName: "VideoVault",
  appDescription: "VideoVault is a video-sharing app.",
  domainName:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL 
      : "http://localhost:3000",
};

export default config;
