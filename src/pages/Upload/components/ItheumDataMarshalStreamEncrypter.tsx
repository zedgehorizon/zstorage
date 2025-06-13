import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@libComponents/Dialog";
import { DataMarshal } from "@itheum/sdk-data-marshal-network";

interface ItheumDataMarshalStreamEncrypterProps {
  creatorWallet: string;
  dataStreamForWorkflow: string | null;
  onDataStreamUpdate: (clearTextDataStream: string, encryptedDataStream: string, itheumCreatorWallet: string) => void;
}

const ItheumDataMarshalStreamEncrypter: React.FC<ItheumDataMarshalStreamEncrypterProps> = ({ creatorWallet, dataStreamForWorkflow, onDataStreamUpdate }) => {
  const [publicDataStreamUrl, setPublicDataStreamUrl] = useState("");
  const [itheumCreatorWallet, setItheumCreatorWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItheumCreatorWallet(creatorWallet);
  }, [creatorWallet]);

  useEffect(() => {
    if (dataStreamForWorkflow) {
      setPublicDataStreamUrl(dataStreamForWorkflow);
    }
  }, [dataStreamForWorkflow]);

  const handleEncrypt = async () => {
    if (!publicDataStreamUrl) {
      setError("Please enter a public data stream URL");
      return;
    }

    if (!itheumCreatorWallet) {
      setError("Please enter a Itheum Protocol: Data Creator Wallet");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataMarshal = new DataMarshal("mainnet");
      const encryptPayload = await dataMarshal.encryptDataStream(publicDataStreamUrl, itheumCreatorWallet);
      onDataStreamUpdate(publicDataStreamUrl, encryptPayload.dataStreamEncrypted, itheumCreatorWallet);
      setIsOpen(false); // Only close on success
    } catch (err) {
      setError("Failed to encrypt data stream. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-accent hover:text-accent/80 transition-colors">Help me encrypt my data stream</button>
      </DialogTrigger>
      <DialogContent className="bg-background !max-w-[60%] items-center justify-center border-accent/50">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-accent mb-2">Itheum Protocol: Encrypted Data Stream</DialogTitle>
          <p className="text-foreground/80">
            Enter a public data stream URL and have it encrypted by the Itheum Data Marshal network, making it compatible with the Itheum protocol's Data NFT
            and Data Token tech.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-8 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Itheum Protocol: Data Creator Wallet</label>
              <input
                type="text"
                value={itheumCreatorWallet}
                onChange={(e) => setItheumCreatorWallet(e.target.value)}
                placeholder="e.g. 4hPVBKU12pxu4qrD4S1SRm4PMACoJ1dkttep5SitVUXF"
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Public Data Stream URL</label>
              <input
                type="text"
                value={publicDataStreamUrl}
                onChange={(e) => setPublicDataStreamUrl(e.target.value)}
                placeholder="e.g. ipns://k51qzi5uqu5dkwckuhpj08055umot5jtfde8bo2p4khh97296rliud56kfkqrn?dmf-nestedstream=1"
                maxLength={200}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
              />
            </div>

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={handleEncrypt}
                disabled={isLoading}
                className="w-[300px] bg-accent text-accent-foreground font-medium p-4 rounded-lg disabled:cursor-not-allowed disabled:bg-accent/50">
                {isLoading ? "Encrypting..." : "Encrypt now"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-[300px] bg-background border border-accent/50 text-accent font-medium p-4 rounded-lg hover:bg-accent/10 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItheumDataMarshalStreamEncrypter;
