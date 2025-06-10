import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragAndDropZone from "./components/DragAndDropZone";
import FileCard from "./components/FileCard";
import { generateRandomString, onlyAlphaNumericChars, uploadFilesRequest } from "@utils/functions";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { AssetCategories, CATEGORIES } from "@utils/constants";
import { Modal } from "@components/Modal";
import { Progress } from "@libComponents/Progress";
import CidsView from "./components/CidsView";

type FormData = {
  // Main Details
  name: string;
  description: string;
  external_url: string;
  // Custom Attributes
  app: string;
  type: string;
  creator_wallet: string;
  data_stream: string;
  tokenCode: string;
  rarity: string;
  _fileNamePrefix: string;
};

type ValidationErrors = {
  [key in keyof FormData]?: string;
};

const JSON_TEMPLATE_FILLED = {
  "attributes": [
    { "trait_type": "App", "value": "sigmamusic.fm" },
    { "trait_type": "Type", "value": "FanMembership" },
    {
      "trait_type": "itheum_creator",
      "value": "4hPVBKU12pxu4qrD4S1SRm4PMACoJ1dkttep5SitVUXF",
    },
    {
      "trait_type": "itheum_data_stream_url",
      "value":
        "eyJBIjoiMzVmMTA3OTU0OTJiZTQ0M2UwODFmMWI3MjU1OWE5MjU2ZTgyM2UxNjlmZDhmY2Y0IiwiQiI6IjhhN2RhNmYwMjE1Yjg3OWM1OGEwZDUzZDAyN2FjMDk3YTE5ZTc5Y2U0NGE4NTI5MDZjM2UxZTNhZWVkY2FjMTIiLCJDIjoiNGY0MGI3ZjUxYWFlMGE2MzU1ZjU5NTYxODA1NGJmNzc5YzcxY2UxMTJjNTk3NWRlMmQyOGVmYTdiM2E3ZWJmZSIsIkQiOiJkM2E3OTVhZDQyMDJhZDY3N2E5NmY0ZGQ1ZDAzNTUxYmJmYTE4OTY4ZWEwNWQzYjAwMzBkMjliZDY1NTMzYTA5YjAyZTkwMTJkNGY2MmYwOTA4MjBiMzJjZWQ5NzQwOWRlNTc4Njk1NjAyN2FmZmMxMmJkYWI5YWQ5NmFlYjU0ZWIwOWQ1MTM2OWU1NmQzNzRkOWVjYzZiMWNjZjViY2IwZTQ5MjdiZWI5YzRlZDk0YTU0ODhlNGUxNzBiYzJlYmZiN2JhNjEzMjY1ZjgzMmZlMjgxZjY2NzFkNTkzYjAyY2RjOTQwYjM2ZjY4MzMxNjMyNzJhODVjNmE2MjI2YjU5MGNlOTlkNjkzNzdiYzY1MThmZjhhNDk0NjE4NWVkZTc5NGY0YmQwYjAxYWI0ZjZjYWM5ZDg3MDYwNjY2MTljY2E2YTBlNDM5NWQ0YTdmMjUzMmQ4MjM1YTcyNGI1OGE1M2MzMjc5ZTJmNmJmMTYyN2UzZDEzY2RhNjEzYjZmOGM2NjFmYmMwNDQ2N2Y1MzkxOTM1MWMwMmUxYjhjNDQyYTM5MzBlMTM0IiwiRSI6IjIzNWQwYzU5OGJkODJmYWI1ZjdiYzRiYzAxYTkyMGQxNTlmMjE0YmZhYzRjMzNhNDE4Nzg2YThkMmJiNjQ3NGJjNTY4ZmEzZDExNWI4MDNmYTVjN2NjMTA4MzQwM2I2NGI4YjA3MmFiYjFkMjdlYTVhY2E4Y2YwNTQzNTQ5OTBjIn0=",
    },
    { "trait_type": "TokenCode", "value": "FANG82" },
    { "trait_type": "Rarity", "value": "Tier 1" },
  ],
  "description": "Offical WSB GBOYZ JUNIORS Zhea Fan Club Membership Token - Tier 1",
  "external_url": "https://sigmamusic.fm",
  "image": "https://gateway.lighthouse.storage/ipfs/bafybeiexnsie236syirw5xtnrhfb5pjib3ybjvimd66dxuaz6rbohlco7i/549_WsbPhlGbhZheaT1.gif",
  "name": "FANG82 - WSB GBOYZ JUNIORS Zhea Fan Club - Tier 1",
  "properties": {
    "category": "image",
    "files": [
      {
        "type": "image/gif",
        "uri": "https://gateway.lighthouse.storage/ipfs/bafybeiexnsie236syirw5xtnrhfb5pjib3ybjvimd66dxuaz6rbohlco7i/549_WsbPhlGbhZheaT1.gif",
      },
    ],
  },
  "symbol": "",
};

const JSON_TEMPLATE_EMPTY = {
  "attributes": [
    { "trait_type": "App", "value": "" },
    { "trait_type": "Type", "value": "" },
    {
      "trait_type": "itheum_creator",
      "value": "",
    },
    {
      "trait_type": "itheum_data_stream_url",
      "value": "",
    },
    { "trait_type": "TokenCode", "value": "" },
    { "trait_type": "Rarity", "value": "" },
  ],
  "description": "",
  "external_url": "",
  "image": "",
  "name": "",
  "properties": {
    "category": "image",
    "files": [
      {
        "type": "",
        "uri": "",
      },
    ],
  },
  "symbol": "",
};

const UploadSelfServeTokenizedDataMetadata = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { tokenLogin } = useGetLoginInfo();
  const [progressValue, setProgressValue] = useState(0);
  const [imgFileCid, setImgFileCid] = useState<string>();
  const [jsonFileCid, setJsonFileCid] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    external_url: "",

    app: "",
    type: "",
    creator_wallet: "",
    data_stream: "",
    tokenCode: "",
    rarity: "",
    _fileNamePrefix: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (progressValue > 0 && progressValue < 99 && !errorMessage) {
      const interval = 100;
      const totalTime = 5000;
      const steps = 100 / (totalTime / interval);

      const updateProgress = () => {
        setProgressValue((prevProgress) => {
          const newProgress = prevProgress + steps;
          return newProgress <= 99 ? newProgress : 99;
        });
      };

      const progressInterval = setInterval(updateProgress, interval);

      return () => clearInterval(progressInterval);
    }
  }, [progressValue]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Main Details Validation
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 50) {
      errors.name = "Name must be less than 50 characters";
      isValid = false;
    }

    if (!formData.description) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length > 100) {
      errors.description = "Description must be less than 100 characters";
      isValid = false;
    }

    if (!formData.external_url) {
      errors.external_url = "External URL is required";
      isValid = false;
    } else if (!formData.external_url.startsWith("https")) {
      errors.external_url = "URL must start with https";
      isValid = false;
    } else if (formData.external_url.length > 50) {
      errors.external_url = "URL must be less than 50 characters";
      isValid = false;
    }

    // Custom Attributes Validation
    if (!formData.app) {
      errors.app = "App is required";
      isValid = false;
    } else if (formData.app.length > 30) {
      errors.app = "App must be less than 30 characters";
      isValid = false;
    }

    if (!formData.type) {
      errors.type = "Type is required";
      isValid = false;
    } else if (formData.type.length > 30) {
      errors.type = "Type must be less than 30 characters";
      isValid = false;
    }

    if (!formData.creator_wallet) {
      errors.creator_wallet = "Creator wallet is required";
      isValid = false;
    } else if (formData.creator_wallet.length > 100) {
      errors.creator_wallet = "Creator wallet must be less than 100 characters";
      isValid = false;
    }

    if (!formData.data_stream) {
      errors.data_stream = "Data stream is required";
      isValid = false;
    } else if (formData.data_stream.length > 1500) {
      errors.data_stream = "Data stream must be less than 1500 characters";
      isValid = false;
    }

    if (!formData.tokenCode) {
      errors.tokenCode = "Token code is required";
      isValid = false;
    } else if (formData.tokenCode.length > 30) {
      errors.tokenCode = "Token code must be less than 30 characters";
      isValid = false;
    }

    if (!formData.rarity) {
      errors.rarity = "Rarity is required";
      isValid = false;
    } else if (formData.rarity.length > 30) {
      errors.rarity = "Rarity must be less than 30 characters";
      isValid = false;
    }

    if (!formData._fileNamePrefix) {
      errors._fileNamePrefix = "File name prefix is required";
      isValid = false;
    } else if (formData._fileNamePrefix.length > 50) {
      errors._fileNamePrefix = "File name prefix must be less than 50 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  async function uploadFile() {
    if (!validateForm()) {
      return;
    }

    setProgressValue(43);

    if (!file) return;
    const filesToUpload = new FormData();
    // first file should be image
    filesToUpload.append("files", file, generateRandomString() + "_img_" + onlyAlphaNumericChars(formData._fileNamePrefix) + "." + file.name.split(".")[1]);

    // second file should be json
    const jsonFileWithData = { ...JSON_TEMPLATE_EMPTY };
    jsonFileWithData.name = formData.name;
    jsonFileWithData.description = formData.description;
    jsonFileWithData.external_url = formData.external_url;
    jsonFileWithData.attributes = [
      { "trait_type": "App", "value": formData.app },
      { "trait_type": "Type", "value": formData.type },
      { "trait_type": "itheum_creator", "value": formData.creator_wallet },
      { "trait_type": "itheum_data_stream_url", "value": formData.data_stream },
      { "trait_type": "TokenCode", "value": formData.tokenCode },
      { "trait_type": "Rarity", "value": formData.rarity },
    ];
    filesToUpload.append(
      "files",
      new Blob([JSON.stringify(jsonFileWithData)], { type: "application/json" }),
      generateRandomString() + "_json_" + onlyAlphaNumericChars(formData._fileNamePrefix) + ".json"
    );
    filesToUpload.append("category", CATEGORIES[AssetCategories.DATATOKEN_METAPAIR]);

    // v3 version handles the order we want data tokens to be uploaded in
    const response = await uploadFilesRequest(filesToUpload, tokenLogin?.nativeAuthToken || "", "_v3");

    if (response.response) {
      if (response.response.data.statusCode === 402) {
        setErrorMessage("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue.");
        return undefined;
      } else {
        setErrorMessage("There was an error uploading the file. " + response.response.data?.message);
        return undefined;
      }
    }

    setProgressValue(100);
    console.log(response);

    setImgFileCid(response[0].hash);
    setJsonFileCid(response[1].hash);
  }

  function loadDummyData() {
    setFormData({
      name: JSON_TEMPLATE_FILLED.name,
      description: JSON_TEMPLATE_FILLED.description,
      external_url: JSON_TEMPLATE_FILLED.external_url,
      app: JSON_TEMPLATE_FILLED.attributes.find((attr) => attr.trait_type === "App")?.value || "",
      type: JSON_TEMPLATE_FILLED.attributes.find((attr) => attr.trait_type === "Type")?.value || "",
      creator_wallet: JSON_TEMPLATE_FILLED.attributes.find((attr) => attr.trait_type === "itheum_creator")?.value || "",
      data_stream: JSON_TEMPLATE_FILLED.attributes.find((attr) => attr.trait_type === "itheum_data_stream_url")?.value || "",
      tokenCode: JSON_TEMPLATE_FILLED.attributes.find((attr) => attr.trait_type === "TokenCode")?.value || "",
      rarity: JSON_TEMPLATE_FILLED.attributes.find((attr) => attr.trait_type === "Rarity")?.value || "",
      _fileNamePrefix: "",
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full xl:w-[60%] mt-10">
      <h1 className="text-4xl text-accent mb-2">Upload Self Serve Tokenized Data Metadata</h1>
      <p className="text-foreground/80 mb-8">
        Enter the details below to generate the data token metadata files which you can then use in your own scripts to mint data tokens
      </p>

      <div className="mt-8">
        <h2 className="text-2xl text-accent mb-2">Upload Your Data Token Image</h2>
        <p>This is the image that appears on the data token and is visible in NFT wallets etc</p>

        {!file && (
          <DragAndDropZone setFile={setFile} setImagePreview={setImagePreview} dropZoneStyles="w-full" onlyLimitToImages={true} onlyAllowOneUpload={true} />
        )}

        {file && (
          <div className="w-full flex flex-col items-center justify-center my-10">
            <img src={imagePreview || ""} alt="Preview" className="max-w-[300px] max-h-[300px] object-contain rounded-lg mb-4" />
            <FileCard
              fileName={file?.name}
              fileSize={file?.size}
              index={1}
              onDelete={() => {
                setFile(null);
                setImagePreview(null);
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <button onClick={() => loadDummyData()}> Load Template</button>
          <h2 className="text-2xl text-accent mb-2">Main Details</h2>
          <div className="form flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={50}
              />
              {validationErrors.name && <span className="text-red-500 text-sm">{validationErrors.name}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={100}
                rows={3}
              />
              {validationErrors.description && <span className="text-red-500 text-sm">{validationErrors.description}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">External URL</label>
              <input
                type="text"
                name="external_url"
                value={formData.external_url}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={50}
              />
              {validationErrors.external_url && <span className="text-red-500 text-sm">{validationErrors.external_url}</span>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-accent mb-2">Custom Attributes</h2>
          <div className="form flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">App</label>
              <input
                type="text"
                name="app"
                value={formData.app}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={30}
              />
              {validationErrors.app && <span className="text-red-500 text-sm">{validationErrors.app}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={30}
              />
              {validationErrors.type && <span className="text-red-500 text-sm">{validationErrors.type}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Creator Wallet</label>
              <input
                type="text"
                name="creator_wallet"
                value={formData.creator_wallet}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={100}
              />
              {validationErrors.creator_wallet && <span className="text-red-500 text-sm">{validationErrors.creator_wallet}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Data Stream</label>
              <textarea
                name="data_stream"
                value={formData.data_stream}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={1500}
                rows={4}
              />
              {validationErrors.data_stream && <span className="text-red-500 text-sm">{validationErrors.data_stream}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Token Code</label>
              <input
                type="text"
                name="tokenCode"
                value={formData.tokenCode}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={30}
              />
              {validationErrors.tokenCode && <span className="text-red-500 text-sm">{validationErrors.tokenCode}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-foreground/80">Rarity</label>
              <input
                type="text"
                name="rarity"
                value={formData.rarity}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={30}
              />
              {validationErrors.rarity && <span className="text-red-500 text-sm">{validationErrors.rarity}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl text-accent mb-2">File Name Prefix</h2>
        <p>
          This is the prefix that will be used to name the files (img and json) before they are stored. e.g. "FANG82" will result in the files being named
          "FANG82.img" and "FANG82.json"
        </p>
        <div className="flex flex-col gap-1">
          <input
            maxLength={50}
            type="text"
            name="_fileNamePrefix"
            value={formData._fileNamePrefix}
            onChange={handleInputChange}
            className="bg-background border border-accent/50 rounded-lg p-2 text-foreground mt-2 w-[350px]"
          />
          {validationErrors._fileNamePrefix && <span className="text-red-500 text-sm">{validationErrors._fileNamePrefix}</span>}
        </div>
      </div>

      <Modal
        openTrigger={
          <button
            id="validateDataObjectsButton"
            onClick={uploadFile}
            disabled={!file || progressValue > 0 || errorMessage != undefined}
            className={"bg-accent text-accent-foreground w-full font-medium p-6 rounded-b-3xl disabled:cursor-not-allowed disabled:bg-accent/50"}>
            Upload Data
          </button>
        }
        footerContent={
          errorMessage ||
          (Object.keys(validationErrors).length > 0 ? (
            <p className={"px-8 border border-accent bg-background rounded-full hover:shadow hover:shadow-accent"}>Close</p>
          ) : null)
        }
        modalClassName={"bg-background bg-muted !max-w-[60%]  items-center justify-center border-accent/50"}
        closeOnOverlayClick={false}>
        {
          <div className="flex flex-col gap-4 h-full text-foreground items-center justify-center pt-8">
            <span className="text-3xl">{progressValue}%</span>
            <Progress className="bg-background w-[40rem]" value={progressValue} />
            <span className="">
              {errorMessage
                ? "Uploading has stopped because of an error"
                : progressValue > 60
                  ? progressValue === 100
                    ? "Upload completed!"
                    : "Almost there..."
                  : "Uploading files..."}
            </span>
            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            {Object.keys(validationErrors).length > 0 && (
              <span className="text-red-500 text-xs">
                {Object.values(validationErrors).join(", ")} - Please close the modal and fix the errors and try again
              </span>
            )}
            {imgFileCid && jsonFileCid && progressValue === 100 && (
              <div className="flex flex-col items-center justify-center mb-8 ">
                {progressValue === 100 && (
                  <div className="flex flex-col justify-center items-center gap-4">
                    <div>
                      <p>Image File CID</p>
                      <CidsView fileCID={imgFileCid} />
                    </div>
                    <div>
                      <p>JSON File CID</p>
                      <CidsView fileCID={jsonFileCid} />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-4">
                      <Link
                        to={"/data-bunker"}
                        className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                        View stored files
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        }
      </Modal>
    </div>
  );
};

export default UploadSelfServeTokenizedDataMetadata;
