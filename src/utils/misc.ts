export const getApi = (chainID: string) => {
  const envKey = chainID === "1" ? "REACT_APP_ENV_API_MAINNET_KEY" : "REACT_APP_ENV_API_DEVNET_KEY";
  const defaultUrl = chainID === "1" ? "api.multiversx.com" : "devnet-api.multiversx.com";

  return process.env[envKey] || defaultUrl;
};
