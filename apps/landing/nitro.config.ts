// Nitro will automatically pick up this configuration.
// We export a plain object to avoid dependency issues with nitropack types.
export default {
  preset: "vercel",
  routeRules: {
    "/api-proxy/**": { proxy: "https://publicgold.co.id/**" },
    "/api-proxy-my/**": { proxy: "https://publicgold.com.my/**" }
  }
};
