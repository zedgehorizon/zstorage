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
import ItheumDataMarshalStreamEncrypter from "./components/ItheumDataMarshalStreamEncrypter";

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
  manualImgFileUrl?: string;
  manualImgFileType?: string;
};

type IPLicenseFormData = {
  ipLicenseCreatorName: string;
  ipLicenseCreatorContributionPercent: string;
  ipLicenseSigmaTemplateArtistId: string;
  ipLicenseSigmaTemplateAlbumId: string;
  ipLicenseSigmaTemplateMusicAssetType: string;
  ipLicenseCreatorStoryProtocolAddress: string;
};

type ValidationErrors = {
  [key in keyof FormData]?: string;
};

type IPLicenseValidationErrors = {
  [key in keyof IPLicenseFormData]?: string;
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
  const [imgFileCidPayload, setImgFileCidPayload] = useState<any>(null);
  const [jsonFileCidPayload, setJsonFileCidPayload] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isManualUrlEnabled, setIsManualUrlEnabled] = useState(false);
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
    manualImgFileUrl: "",
    manualImgFileType: "image/gif",
  });
  const [ipLicenseFormData, setIpLicenseFormData] = useState<IPLicenseFormData>({
    ipLicenseCreatorName: "",
    ipLicenseCreatorStoryProtocolAddress: "",
    ipLicenseCreatorContributionPercent: "100",
    ipLicenseSigmaTemplateArtistId: "",
    ipLicenseSigmaTemplateAlbumId: "",
    ipLicenseSigmaTemplateMusicAssetType: "Album",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [ipLicenseValidationErrors, setIpLicenseValidationErrors] = useState<IPLicenseValidationErrors>({});
  const [clearTextDataStream, setClearTextDataStream] = useState<string | null>(null);
  const [isIpLicensingEnabled, setIsIpLicensingEnabled] = useState(false);
  const [isStoryProtocolTestnetEnabled, setIsStoryProtocolTestnetEnabled] = useState(false);

  useEffect(() => {
    const dataStreamForWorkflow = new URLSearchParams(window.location.search).get("dataStreamForWorkflow");
    setClearTextDataStream(dataStreamForWorkflow || null);
  }, []);

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

    // Manual URL validation
    if (isManualUrlEnabled) {
      if (!formData.manualImgFileUrl || formData.manualImgFileUrl === "") {
        errors.manualImgFileUrl = "Image URL is required when manually entering URL";
        isValid = false;
      } else if (formData.manualImgFileUrl.length < 50) {
        errors.manualImgFileUrl = "Image URL must be at least 50 characters";
        isValid = false;
      } else if (formData.manualImgFileUrl.includes(" ")) {
        errors.manualImgFileUrl = "Image URL cannot contain spaces";
        isValid = false;
      }

      if (!formData.manualImgFileType) {
        errors.manualImgFileType = "Image type is required when manually entering URL";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const validateIpLicenseForm = (): boolean => {
    const errors: IPLicenseValidationErrors = {};
    let isValid = true;

    if (!ipLicenseFormData.ipLicenseCreatorName) {
      errors.ipLicenseCreatorName = "Musician Name is required";
      isValid = false;
    }

    if (!ipLicenseFormData.ipLicenseCreatorStoryProtocolAddress) {
      errors.ipLicenseCreatorStoryProtocolAddress = "Musician Story Protocol Address is required";
      isValid = false;
    }

    if (!ipLicenseFormData.ipLicenseSigmaTemplateArtistId) {
      errors.ipLicenseSigmaTemplateArtistId = "Sigma Music Artist ID is required";
      isValid = false;
    }

    if (!ipLicenseFormData.ipLicenseSigmaTemplateAlbumId) {
      errors.ipLicenseSigmaTemplateAlbumId = "Sigma Music Album ID is required";
      isValid = false;
    }

    setIpLicenseValidationErrors(errors);
    return isValid;
  };

  async function uploadFile() {
    if (!file && !isManualUrlEnabled) return;

    if (isManualUrlEnabled && formData.manualImgFileUrl === "") return;

    if (isIpLicensingEnabled) {
      const mainFormValidationResult = validateForm();
      const ipLicenseFormValidationResult = validateIpLicenseForm();

      if (!mainFormValidationResult || !ipLicenseFormValidationResult) {
        return;
      }
    } else {
      if (!validateForm()) {
        return;
      }
    }

    setProgressValue(43);

    const filesToUpload = new FormData();

    if (isManualUrlEnabled) {
      // When manual URL is enabled, we don't upload the image file
      // The JSON will reference the provided URL
    } else {
      // first file should be image
      if (file) {
        filesToUpload.append("files", file, generateRandomString() + "_img_" + onlyAlphaNumericChars(formData._fileNamePrefix) + "." + file.name.split(".")[1]);
      }
    }

    // second file should be json
    const jsonFileWithData = { ...JSON_TEMPLATE_EMPTY };
    jsonFileWithData.name = formData.name;
    jsonFileWithData.description = formData.description;
    jsonFileWithData.external_url = formData.external_url;

    // Set image URL based on whether manual URL is enabled
    if (isManualUrlEnabled && formData.manualImgFileUrl && formData.manualImgFileUrl !== "") {
      jsonFileWithData.image = formData.manualImgFileUrl;

      jsonFileWithData.properties.files[0].uri = formData.manualImgFileUrl;
      jsonFileWithData.properties.files[0].type = formData.manualImgFileType || "image/gif";
    }

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

    // 3rd file is an optional ip license instruction file for the backend to process
    if (isIpLicensingEnabled) {
      const ipLicenseInstructionFile = {
        assetTitle: formData.name,
        assetDesc: formData.description,
        creatorName: ipLicenseFormData.ipLicenseCreatorName,
        creatorAddress: ipLicenseFormData.ipLicenseCreatorStoryProtocolAddress,
        creatorContributionPercent: ipLicenseFormData.ipLicenseCreatorContributionPercent,
        sigmaMusicArtistId: ipLicenseFormData.ipLicenseSigmaTemplateArtistId,
        sigmaMusicAssetId: ipLicenseFormData.ipLicenseSigmaTemplateAlbumId,
        sigmaMusicAssetType: ipLicenseFormData.ipLicenseSigmaTemplateMusicAssetType,
        assetImageUrl: "",
      };

      // user has manually entered an image url, so use that here as the API wont inject a dynamic file URL
      if (isManualUrlEnabled && formData.manualImgFileUrl && formData.manualImgFileUrl !== "") {
        ipLicenseInstructionFile.assetImageUrl = formData.manualImgFileUrl;
      }

      filesToUpload.append("files", new Blob([JSON.stringify(ipLicenseInstructionFile)], { type: "application/json" }), "ip_license_instruction.json");
    }

    filesToUpload.append("category", CATEGORIES[AssetCategories.DATATOKEN_METAPAIR]);

    if (isManualUrlEnabled && formData.manualImgFileUrl && formData.manualImgFileUrl !== "") {
      filesToUpload.append("manualImgUrlUsed", "true");
    }

    if (isIpLicensingEnabled && isStoryProtocolTestnetEnabled) {
      filesToUpload.append("useStoryIpTestnet", "true");
    }

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

    if (isManualUrlEnabled && formData.manualImgFileUrl && formData.manualImgFileUrl !== "") {
      setJsonFileCidPayload(response[0]);
    } else {
      setImgFileCidPayload(response[0]);
      setJsonFileCidPayload(response[1]);
    }
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
      manualImgFileUrl: "",
      manualImgFileType: "image/gif",
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIpLicenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIpLicenseFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full xl:w-[60%] mt-10">
      <h1 className="text-4xl text-accent mb-2">Generate Data Token Metadata</h1>
      <p className="text-foreground/80 mb-8">
        Enter the details below to generate the data token metadata files which you can then use in your own scripts to mint data tokens
      </p>

      <div className="mt-8 border-b border-accent/50 mb-8">
        <h2 className="text-2xl text-accent mb-2">Upload Your Data Token Image</h2>
        <p>This is the image that appears on the data token and is visible in NFT wallets etc</p>

        <div>
          {!isManualUrlEnabled && !file && <DragAndDropZone setFile={setFile} setImagePreview={setImagePreview} dropZoneStyles="w-full" />}

          {!isManualUrlEnabled && file && (
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

        <div className="manually-enter-image-url mb-4 pb-4">
          <div className="flex items-center gap-4 mb-4 mt-4">
            <span className="text-foreground/80">OR Manually enter image URL:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsManualUrlEnabled(false);
                  setFormData((prev) => ({ ...prev, manualImgFileUrl: "" }));
                  setImagePreview(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isManualUrlEnabled ? "bg-accent text-accent-foreground" : "bg-background border border-accent/50 text-foreground/50 hover:text-foreground"
                }`}>
                OFF
              </button>
              <button
                onClick={() => {
                  setIsManualUrlEnabled(true);
                  setFile(null);
                  setImagePreview(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isManualUrlEnabled ? "bg-accent text-accent-foreground" : "bg-background border border-accent/50 text-foreground/50 hover:text-foreground"
                }`}>
                ON
              </button>
            </div>
          </div>

          {isManualUrlEnabled && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Image URL</label>
                  <input
                    type="text"
                    name="manualImgFileUrl"
                    value={formData.manualImgFileUrl || ""}
                    onChange={handleInputChange}
                    placeholder="Enter the full URL to your image (must be at least 50 characters, no spaces)"
                    className="bg-background border border-accent/50 rounded-lg p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  />
                  {validationErrors.manualImgFileUrl && <span className="text-red-500 text-sm">{validationErrors.manualImgFileUrl}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Image Type</label>
                  <select
                    name="manualImgFileType"
                    value={formData.manualImgFileType || "image/gif"}
                    onChange={handleInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all">
                    <option value="image/gif">GIF</option>
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/svg+xml">SVG</option>
                  </select>
                  {validationErrors.manualImgFileType && <span className="text-red-500 text-sm">{validationErrors.manualImgFileType}</span>}
                </div>
              </div>

              {formData.manualImgFileUrl && formData.manualImgFileUrl.length >= 50 && !formData.manualImgFileUrl.includes(" ") && (
                <div className="mt-2">
                  <img
                    src={formData.manualImgFileUrl}
                    alt="Preview"
                    className="max-w-[300px] max-h-[300px] object-contain rounded-lg border border-accent/20"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
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
              <label className="text-foreground/80">Itheum Protocol: Data Creator Wallet</label>
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
              <label className="text-foreground/80">Itheum Protocol: Encrypted Data Stream</label>

              <textarea
                name="data_stream"
                value={formData.data_stream}
                onChange={handleInputChange}
                className="bg-background border border-accent/50 rounded-lg p-2 text-foreground"
                maxLength={1500}
                rows={4}
              />
              {validationErrors.data_stream && <span className="text-red-500 text-sm">{validationErrors.data_stream}</span>}

              {clearTextDataStream && (
                <div className="flex flex-col gap-1 bg-green-800 p-2 rounded-lg text-sm overflow-x-auto">
                  <p>Public Data Stream URL</p>
                  <p>{clearTextDataStream}</p>
                </div>
              )}

              <ItheumDataMarshalStreamEncrypter
                creatorWallet={formData.creator_wallet}
                dataStreamForWorkflow={clearTextDataStream}
                onDataStreamUpdate={(clearTextDataStream, encryptedDataStream, itheumCreatorWallet) => {
                  setFormData((prev) => ({
                    ...prev,
                    data_stream: encryptedDataStream,
                    creator_wallet: itheumCreatorWallet,
                  }));
                  setClearTextDataStream(clearTextDataStream);
                }}
              />
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

      <div className="mb-10">
        <h2 className="text-2xl text-accent mb-2">IP Licensing</h2>

        <p className="mb-4">
          Integrate with Story Protocol to mint an on-chain IP license for your data token. All instances minted via our script will link to this primary IP
          token, enabling on-chain licensing and royalty payments through Story Protocol's infrastructure. This integration also unlocks IPFi (IP Finance)
          opportunities.
        </p>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setIsIpLicensingEnabled(false)}
            className={`px-6 py-2 rounded-lg font-medium ${!isIpLicensingEnabled ? "bg-accent text-accent-foreground" : "bg-background border border-accent/50 text-foreground/50"}`}>
            OFF
          </button>
          <button
            onClick={() => setIsIpLicensingEnabled(true)}
            className={`px-6 py-2 rounded-lg font-medium ${isIpLicensingEnabled ? "bg-accent text-accent-foreground" : "bg-background border border-accent/50 text-foreground/50"}`}>
            ON
          </button>
        </div>

        {isIpLicensingEnabled && (
          <div className="ip-licensing-content bg-background/50 border border-accent/20 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-accent mb-6">IP Licensing Configuration</h3>

            <div className="mb-8">
              <h4 className="text-lg font-medium text-foreground/90 mb-4">Pick a Consumer End User Application Template</h4>
              <div className="flex gap-4 mb-4">
                <button className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors" disabled={false}>
                  Sigma Music
                </button>
                <button
                  className="bg-background border border-accent/50 text-foreground/50 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                  disabled={true}>
                  Generic (Coming Soon)
                </button>
              </div>
            </div>

            <div className="bg-background/80 rounded-lg p-6 border border-accent/10">
              <h4 className="text-lg font-medium text-foreground/90 mb-6">Template for Sigma Music</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Musician Name</label>
                  <input
                    type="text"
                    name="ipLicenseCreatorName"
                    value={ipLicenseFormData.ipLicenseCreatorName}
                    onChange={handleIpLicenseInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-2 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                    maxLength={300}
                  />
                  {ipLicenseValidationErrors.ipLicenseCreatorName && (
                    <span className="text-red-500 text-sm">{ipLicenseValidationErrors.ipLicenseCreatorName}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Musician Story Protocol Address</label>
                  <input
                    type="text"
                    name="ipLicenseCreatorStoryProtocolAddress"
                    value={ipLicenseFormData.ipLicenseCreatorStoryProtocolAddress}
                    onChange={handleIpLicenseInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-2 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                    maxLength={300}
                  />
                  {ipLicenseValidationErrors.ipLicenseCreatorStoryProtocolAddress && (
                    <span className="text-red-500 text-sm">{ipLicenseValidationErrors.ipLicenseCreatorStoryProtocolAddress}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Creator Contribution Percent</label>
                  <select
                    name="ipLicenseCreatorContributionPercent"
                    value={ipLicenseFormData.ipLicenseCreatorContributionPercent}
                    onChange={handleIpLicenseInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-2 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all">
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="100">100%</option>
                  </select>
                  {ipLicenseValidationErrors.ipLicenseCreatorContributionPercent && (
                    <span className="text-red-500 text-sm">{ipLicenseValidationErrors.ipLicenseCreatorContributionPercent}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Sigma Music Artist ID</label>
                  <input
                    type="text"
                    name="ipLicenseSigmaTemplateArtistId"
                    value={ipLicenseFormData.ipLicenseSigmaTemplateArtistId}
                    onChange={handleIpLicenseInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-2 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                    maxLength={100}
                  />
                  {ipLicenseValidationErrors.ipLicenseSigmaTemplateArtistId && (
                    <span className="text-red-500 text-sm">{ipLicenseValidationErrors.ipLicenseSigmaTemplateArtistId}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Sigma Music Music Asset ID</label>
                  <input
                    type="text"
                    name="ipLicenseSigmaTemplateAlbumId"
                    value={ipLicenseFormData.ipLicenseSigmaTemplateAlbumId}
                    onChange={handleIpLicenseInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-2 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                    maxLength={100}
                  />
                  {ipLicenseValidationErrors.ipLicenseSigmaTemplateAlbumId && (
                    <span className="text-red-500 text-sm">{ipLicenseValidationErrors.ipLicenseSigmaTemplateAlbumId}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-foreground/80 font-medium">Music Asset Type</label>
                  <select
                    name="ipLicenseSigmaTemplateMusicAssetType"
                    value={ipLicenseFormData.ipLicenseSigmaTemplateMusicAssetType}
                    onChange={handleIpLicenseInputChange}
                    className="bg-background border border-accent/50 rounded-lg p-2 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all">
                    <option value="Album">Album</option>
                    <option value="EP">EP</option>
                    <option value="Single">Single</option>
                  </select>
                  {ipLicenseValidationErrors.ipLicenseSigmaTemplateMusicAssetType && (
                    <span className="text-red-500 text-sm">{ipLicenseValidationErrors.ipLicenseSigmaTemplateMusicAssetType}</span>
                  )}
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-6 border border-accent/10">
                <h5 className="text-lg font-medium text-foreground/90 mb-4">Supported IP Licenses</h5>
                <div className="space-y-4">
                  <div className="bg-background/80 rounded-lg p-4 border border-accent/10">
                    <h6 className="text-accent font-medium mb-2">Commercial Remix</h6>
                    <div className="space-y-2 text-sm text-foreground/80">
                      <a
                        href="https://github.com/piplabs/pil-document/blob/v1.3.0/Story%20Foundation%20-%20Programmable%20IP%20License%20(1.31.25).pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                        <span>View PIL (Programmatic IP License) Legal Document</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                      <a
                        href="https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                        <span>View Off-Chain Terms</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <p className="text-foreground/80 text-sm mb-2">Use Story Protocol Testnet</p>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setIsStoryProtocolTestnetEnabled(false)}
                  className={`px-6 py-2 rounded-lg text-sm ${!isStoryProtocolTestnetEnabled ? "bg-accent text-accent-foreground" : "bg-background border border-accent/50 text-foreground/50"}`}>
                  OFF
                </button>
                <button
                  onClick={() => setIsStoryProtocolTestnetEnabled(true)}
                  className={`px-6 py-2 rounded-lg text-sm ${isStoryProtocolTestnetEnabled ? "bg-accent text-accent-foreground" : "bg-background border border-accent/50 text-foreground/50"}`}>
                  ON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        openTrigger={
          <button
            id="validateDataObjectsButton"
            onClick={uploadFile}
            disabled={
              (!isManualUrlEnabled && !file) || (isManualUrlEnabled && formData.manualImgFileUrl === "") || progressValue > 0 || errorMessage != undefined
            }
            className={"bg-accent text-accent-foreground w-full font-medium p-6 rounded-b-3xl disabled:cursor-not-allowed disabled:bg-accent/50"}>
            Generate Data Token Metadata
          </button>
        }
        footerContent={
          errorMessage ||
          (Object.keys(validationErrors).length > 0 || (isIpLicensingEnabled && Object.keys(ipLicenseValidationErrors).length > 0) ? (
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
              <span className="text-red-500 text-xs text-center">
                {Object.values(validationErrors).join(", ")} - Please close the modal and fix the errors.
              </span>
            )}
            {isIpLicensingEnabled && Object.keys(ipLicenseValidationErrors).length > 0 && (
              <span className="text-red-500 text-xs text-center">
                <p>IP Licensing Errors:</p>
                {Object.values(ipLicenseValidationErrors).join(", ")} - Please close the modal and fix the errors.
              </span>
            )}
            {jsonFileCidPayload && progressValue === 100 && (
              <div className="flex flex-col items-center justify-center mb-8 ">
                {progressValue === 100 && (
                  <div className="flex flex-col justify-center items-center gap-4">
                    {imgFileCidPayload && (
                      <div>
                        <p>Image File CID</p>
                        <CidsView
                          folderCid={imgFileCidPayload.folderHash}
                          currentManifestFileCID={imgFileCidPayload.hash}
                          manifestFileName={imgFileCidPayload.fileName}
                        />
                      </div>
                    )}
                    <div>
                      <p>JSON File CID</p>
                      <CidsView
                        folderCid={jsonFileCidPayload.folderHash}
                        currentManifestFileCID={jsonFileCidPayload.hash}
                        manifestFileName={jsonFileCidPayload.fileName}
                      />
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
