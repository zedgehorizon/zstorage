export const getApi = (chainID: string) => {
  const envKey = chainID === "1" ? "VITE_ENV_API_MAINNET_KEY" : "VITE_ENV_API_DEVNET_KEY";
  const defaultUrl = chainID === "1" ? "api.multiversx.com" : "devnet-api.multiversx.com";

  return import.meta.env[envKey] || defaultUrl;
};
