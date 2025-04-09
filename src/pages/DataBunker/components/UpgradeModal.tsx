import React from "react";
import { Button } from "@libComponents/Button";
import { X } from "lucide-react";
import { SubscriptionTiers } from "config";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "Premium" | "Gateway";
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, tier }) => {
  if (!isOpen) return null;

  const handlePayment = () => {
    if (tier === "Premium") {
      window.open("https://buy.stripe.com/9AQbMCeRq4tS9Ec9AC?prefilled_email=", "_blank");
    } else {
      window.open("https://buy.stripe.com/fZebMCbFe9Oc9Ec3cc?prefilled_email=", "_blank");
    }
  };

  const getTierDetails = () => {
    if (tier === "Premium") {
      return {
        price: `${SubscriptionTiers.PREMIUM.annualPrice} USD / per year`,
        storage: `${SubscriptionTiers.PREMIUM.storage} ${SubscriptionTiers.PREMIUM.storageUnit} Storage`,
        bandwidth: `${SubscriptionTiers.PREMIUM.bandwidth} ${SubscriptionTiers.PREMIUM.bandwidthUnit} Bandwidth / month`,
        extras: [],
      };
    } else {
      return {
        price: `${SubscriptionTiers.GATEWAY.annualPrice} USD / per year`,
        storage: `${SubscriptionTiers.GATEWAY.storage} ${SubscriptionTiers.GATEWAY.storageUnit} Storage`,
        bandwidth: `${SubscriptionTiers.GATEWAY.bandwidth} ${SubscriptionTiers.GATEWAY.bandwidthUnit} Bandwidth / month`,
        extras: ["Dedicated support for data tokenization", "Priority data streaming"],
      };
    }
  };

  const details = getTierDetails();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-[100] overflow-y-auto">
      <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-accent">Upgrade to: {tier}</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-xl font-semibold">Price: ${details.price} </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">What you get:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>{details.storage}</li>
              <li>{details.bandwidth}</li>
              {details.extras.map((extra, index) => (
                <li key={index}>{extra}</li>
              ))}
            </ul>
            {tier === "Gateway" && (
              <a href="https://www.zedgestorage.com#gateway" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                More details
              </a>
            )}
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <p className="text-sm">
              Currently payments are made manually via a secure stripe credit card payment collection. Once payment is made, we will need to verify and manually
              upgrade your account. The payment link will open in a new tab, and once you have completed the payment, please email us on
              <span className="font-bold text-accent"> support@zedgehorizon.com</span>. We will aim to upgrade you ASAP. We are working to make this process
              automatic so please bear with us for now. If you are not comfortable with this, please email us first.
            </p>
          </div>

          <div className="text-sm">
            By continuing you acknowledge that you have read our{" "}
            <a
              href="https://www.zedgehorizon.com/post/refund-and-dispute-policy-zedge-storage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline">
              Refund and Dispute Policy
            </a>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" className="border-accent" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-accent text-accent-foreground" onClick={handlePayment}>
              Make Secure Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
