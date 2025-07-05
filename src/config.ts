export const walletConnectV2ProjectId = import.meta.env.VITE_ENV_WALLETCONNECTV2_PROJECTID;
export const apiTimeout = 6000;
export const SubscriptionTiers = {
  BASIC: {
    annualPrice: 0,
    storage: 500,
    storageUnit: "MB",
    bandwidth: 500,
    bandwidthUnit: "MB",
  },
  PREMIUM: {
    annualPrice: 99,
    storage: 10,
    storageUnit: "GB",
    bandwidth: 5,
    bandwidthUnit: "GB",
  },
  GATEWAY: {
    annualPrice: 129,
    storage: 15,
    storageUnit: "GB",
    bandwidth: 10,
    bandwidthUnit: "GB",
  },
};
