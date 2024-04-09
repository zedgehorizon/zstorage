import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@libComponents/Button";
import { ArrowUp, ArrowDown, CheckCircleIcon, Loader2, Upload, Lightbulb } from "lucide-react";
import { DatePicker } from "@libComponents/DatePicker";
import { Input } from "@libComponents/Input";
import DragAndDropZone from "./DragAndDropZone";
import { toast } from "sonner";

const formSchema = z
  .object({
    date: z.string().min(1, "Required field"),
    category: z
      .string()
      .min(1, "Required field")
      .regex(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters are allowed"),
    title: z
      .string()
      .min(1, "Required field")
      .regex(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters are allowed")

      .refine((data) => !data.includes("manifest"), {
        message: "The title cannot contain the word 'manifest'",
      }),
    link: z.string().min(1, "Required field"),
    file: z.string(),
    file_preview_img: z.string(),
    file_mimeType: z.string(),
  })
  .refine((data) => !!data.file || !!data.file_preview_img, {
    message: "Either Media Image OR Media File is mandatory.Both allowed as well.",
    path: ["min_media_files"],
  });

type TrailblazerNftFormProps = {
  index: number;
  itemData: any;
  lastItem: boolean;
  setterFunction: (index: number, formInputs: any, image: any, media: any) => void;
  swapFunction: (first: number, second: number) => void; // will swap first index with the second in the parent component
  unsavedChanges: boolean;
  setUnsavedChanges: (index: number, value: boolean) => void;
  validationMessage?: string;
};

/// the form for each itemData that is going to be uploaded
export function TrailblazerNftForm(props: TrailblazerNftFormProps) {
  const { index, itemData, lastItem, setterFunction, swapFunction, unsavedChanges, setUnsavedChanges, validationMessage } = props;

  const [imageURL, setImageURL] = useState("");
  const [mediaURL, setMediaURL] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [date, setDate] = useState<string>();
  const [mediaFileIsLoading, setMediaFileIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "",
      title: "",
      link: "",
      file: "",
      file_preview_img: "",
      file_mimeType: "",
    },
  });

  // populate the form
  useEffect(() => {
    form.reset({ file: "", file_preview_img: "", file_mimeType: "" });

    form.setValue("date", itemData["date"] ? new Date(itemData["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setDate(itemData["date"] ? new Date(itemData["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    form.setValue("category", itemData["category"] ? itemData["category"] : "");
    form.setValue("title", itemData["title"] ? itemData["title"] : "");
    form.setValue("link", itemData["link"] ? itemData["link"] : "");
    form.setValue("file_mimeType", itemData["file_mimeType"] ? itemData["file_mimeType"] : "");

    if (itemData["file_preview_img"]) {
      form.setValue("file_preview_img", itemData["file_preview_img"]);
      setImageURL(itemData["file_preview_img"]);
    } else {
      setImageURL("");
    }
    if (itemData["file"]) {
      form.setValue("file", itemData["file"]);
      setMediaURL(itemData["file"]);
    } else {
      setMediaURL("");
    }

    setImageFile(undefined);
    setMediaFile(undefined);
  }, [itemData]);

  useEffect(() => {
    if (imageURL) {
      form.setValue("file_preview_img", imageURL);
      setterFunction(index, form.getValues(), imageFile, mediaFile); // setting the cover art url
    }
  }, [imageURL]);

  useEffect(() => {
    if (mediaFile || imageFile) setterFunction(index, form.getValues(), imageFile, mediaFile);
  }, [imageFile, mediaFile]);

  useEffect(() => {
    if (date) form.setValue("date", new Date(date).toISOString().split("T")[0]);
    setterFunction(index, form.getValues(), imageFile, mediaFile);
  }, [date]);

  const handleMediaFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith("video/mp4") || file.type.startsWith("audio"))) {
      setMediaFile(file);
      const mediaURL = URL.createObjectURL(event.target.files[0]);
      form.setValue("file", mediaURL);
      form.setValue("file_mimeType", file.type);
      setMediaURL(mediaURL);
    } else {
      toast.warning("Please upload a valid file");
    }
  };

  function handleMoveUp() {
    if (index == 1) return;
    swapFunction(Number(index), Number(index) - 1);
  }

  function handleMoveDown() {
    swapFunction(Number(index), Number(index) + 1);
  }

  function deleteItem() {
    swapFunction(Number(index), -1);
  }

  return (
    <div className=" p-12 flex flex-col bg-muted w-[100%] max-w-[80rem] mx-auto border-b border-accent/50">
      <div className="text-2xl text-accent text-center p-3"> 0{index}</div>
      <div className="relative">
        <div className="absolute top-0 right-0">
          <div className="flex flex-col justify-between">
            {index != 1 && (
              <Button
                tabIndex={-1}
                onClick={handleMoveUp}
                className="mb-2 border border-accent p-2 hover:bg-accent/50 bg-accent/20 rounded-full flex items-center justify-center">
                <ArrowUp className="text-accent" />
              </Button>
            )}
            {!lastItem && (
              <Button
                tabIndex={-1}
                onClick={handleMoveDown}
                className="border border-accent p-2 hover:bg-accent/50 bg-accent/20 rounded-full flex items-center justify-center">
                <ArrowDown className="text-accent" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <form
        onChange={() => {
          setterFunction(index, form.getValues(), imageFile, mediaFile);
        }}
        className="flex flex-col space-y-4 gap-4 text-accent/50">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-6 w-[50%]">
            <span className="text-foreground">
              Entry Details <span className="text-accent">*</span>{" "}
            </span>

            <div>
              <DatePicker setterFunction={setDate} previousDate={date} />
              {form.formState.errors.date && <p className="text-red-500 absolute">{form.formState.errors.date.message}</p>}
            </div>

            <div className="hover:text-accent">
              <select
                className="w-full bg-background placeholder:text-accent p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("category")}>
                <option value="Meme">Media Meme</option>
              </select>
              {form.formState.errors.category && <p className="text-red-500 absolute">{form.formState.errors.category.message}</p>}
            </div>

            <div className="hover:text-accent">
              <input
                type="text"
                placeholder="Title"
                className="w-full bg-background placeholder:text-accent p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("title")}
              />
              {form.formState.errors.title && <p className="text-red-500 absolute">{form.formState.errors.title.message}</p>}
            </div>

            <div className=" hover:text-accent ">
              <input
                type="text"
                placeholder="Action Link"
                className="w-full bg-background placeholder:text-accent p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("link")}
              />
              {form.formState.errors.link && <p className="text-red-500 absolute">{form.formState.errors.link.message}</p>}
            </div>
          </div>
          <div className="gap-4 flex-col flex-1 items-center justify-center ">
            <span className="mb-6 text-foreground">Media Image</span>

            <DragAndDropZone setFile={setImageFile} setImagePreview={setImageURL} imagePreview={imageURL} />

            {form.formState.errors.file_preview_img && (
              <p className="text-red-500 absolute -mt-6">{form.formState.errors.file_preview_img.message?.toString()}</p>
            )}

            <div>
              <div className="flex gap-2 flex-row">
                <label className="text-foreground text-xs">Media File (.mp3, .mp4)</label>
                {mediaFileIsLoading && <Loader2 className="flex text-accent justify-center items-center animate-spin" />}
              </div>

              {/* {mediaURL && !wantToEditMedia && !mediaFile ? ( */}
              {mediaURL && !mediaFile ? (
                <div className="mt-2 flex flex-row justify-start items-center  ">
                  <audio
                    tabIndex={-1}
                    onLoadStart={() => setMediaFileIsLoading(true)}
                    onError={() => {
                      setMediaFileIsLoading(false);
                    }}
                    onLoadedData={() => setMediaFileIsLoading(false)}
                    src={mediaURL}
                    className="-ml-9 scale-[0.8]"
                    controls
                  />
                </div>
              ) : (
                <div className="mt-2 p-2 w-full flex flex-row items-center justify-center rounded-md border border-accent/50 bg-muted text-sm text-accent/50  ">
                  <Input accept=".mp3, .mp4" id="file" type="file" className=" w-24 overflow-hidden border-0 p-0" onChange={(e) => handleMediaFileChange(e)} />
                  <div className="text-accent/50 w-[10rem] truncate ">
                    {mediaFile ? mediaFile.name : mediaURL?.split("_")[1] ? mediaURL.split("_")[1] : "No chosen file"}{" "}
                  </div>
                  {mediaURL ? <span className="text-xs">{form.getValues("file_mimeType")}</span> : <Upload className="text-accent ml-auto" />}
                </div>
              )}
              {form.formState.errors.file && <p className="text-red-500 mt-3 absolute">{form.formState.errors.file.message?.toString()}</p>}
            </div>
          </div>
        </div>
        <div>
          {form.formState.errors?.min_media_files && (
            <p className="w-full text-red-500 flex flex-col justify-center items-center">{form.formState.errors?.min_media_files.message}</p>
          )}
        </div>
        <div className="w-full flex flex-row justify-between">
          {unsavedChanges != undefined && unsavedChanges === false && (
            <div className="mt-2 flex flex-row gap-2 text-accent">
              Verified <CheckCircleIcon className="text-accent" />
            </div>
          )}

          <div className="w-full flex flex-col justify-start items-start max-w-[30rem]">
            {validationMessage && (
              <p className="text-red-500">
                {" "}
                Please fill the folowing fields: <br></br> {validationMessage}{" "}
              </p>
            )}
          </div>
          <Button type="button" tabIndex={-1} onClick={deleteItem} className="bg-background rounded-full mr-2 p-2 px-6 text-accent border border-accent">
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
