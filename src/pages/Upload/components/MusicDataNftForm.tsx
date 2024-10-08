import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@libComponents/Button";
import { ArrowUp, ArrowDown, Edit2, Loader2, Upload, Music } from "lucide-react";
import { DatePicker } from "@libComponents/DatePicker";
import { Input } from "@libComponents/Input";
import DragAndDropZone from "./DragAndDropZone";
import { toast } from "sonner";
import { SUI_WALRUS_AGGREGATOR } from "../../../utils/constants";

const formSchema = z.object({
  date: z.string().min(1, "Required field"),
  category: z
    .string()
    .min(1, "Required field")
    .regex(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters are allowed"),
  artist: z
    .string()
    .min(1, "Required field")
    .regex(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters are allowed"),
  album: z
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

  cover_art_url: z.string().min(1, "Required field"),

  file: z.string().min(1, "Required field"),

  numbers_nid: z.string().min(10, "Please enter at least 10 characters").optional().or(z.literal("")),
});

type MusicDataNftFormProps = {
  index: number;
  song: any;
  lastItem: boolean;
  setterFunction: (index: number, formInputs: any, image: any, audio: any) => void;
  swapFunction: (first: number, second: number) => void; // will swap first index with the second in the parrent component
  validationMessage?: string;
};

/// the form for each song that is going to be uploaded
export function MusicDataNftForm(props: MusicDataNftFormProps) {
  const { index, song, lastItem, setterFunction, swapFunction, validationMessage } = props;
  const [wantToEditAudio, setwantToEditAudio] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "",
      artist: "",
      album: "",
      title: "",
      file: "",
      cover_art_url: "",
      numbers_nid: "",
    },
  });

  const [imageURL, setImageURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();
  const [audioFileIsLoading, setAudioFileIsLoading] = useState(false);
  const [date, setDate] = useState<string>();

  const handleAudioFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      const audioURL = URL.createObjectURL(event.target.files[0]);
      form.setValue("file", audioURL);
      setAudioURL(audioURL);
      setwantToEditAudio(false);
    } else {
      toast.warning("Please upload an audio file");
    }
  };

  // populate the form
  useEffect(() => {
    form.setValue("date", song["date"] ? new Date(song["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setDate(song["date"] ? new Date(song["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    form.setValue("category", song["category"] ? song["category"] : "");
    form.setValue("artist", song["artist"] ? song["artist"] : "");
    form.setValue("album", song["album"] ? song["album"] : "");
    form.setValue("title", song["title"] ? song["title"] : "");

    if (song["cover_art_url"]) {
      let coverArtUrlWithAdjustments = song["cover_art_url"];

      if (coverArtUrlWithAdjustments.includes("suiwalrus://")) {
        coverArtUrlWithAdjustments = coverArtUrlWithAdjustments.replace("suiwalrus://", SUI_WALRUS_AGGREGATOR);
      }

      form.setValue("cover_art_url", coverArtUrlWithAdjustments);
      setImageURL(coverArtUrlWithAdjustments);
    } else {
      setImageURL("");
    }

    if (song["file"]) {
      let fileWithAdjustments = song["file"];

      if (fileWithAdjustments.includes("suiwalrus://")) {
        fileWithAdjustments = fileWithAdjustments.replace("suiwalrus://", SUI_WALRUS_AGGREGATOR);
      }

      form.setValue("file", fileWithAdjustments);
      setAudioURL(fileWithAdjustments);
    } else {
      setAudioURL("");
    }

    form.setValue("numbers_nid", song["numbers_nid"] ? song["numbers_nid"] : "");

    setwantToEditAudio(false);
    setImageFile(undefined);
    setAudioFile(undefined);
  }, [song]);

  useEffect(() => {
    if (imageURL) {
      form.setValue("cover_art_url", imageURL);
      setterFunction(index, form.getValues(), imageFile, audioFile); // setting the cover art url
    }
  }, [imageURL]);

  useEffect(() => {
    if (audioFile || imageFile) setterFunction(index, form.getValues(), imageFile, audioFile);
  }, [imageFile, audioFile]);

  useEffect(() => {
    if (date) form.setValue("date", new Date(date).toISOString().split("T")[0]);
    setterFunction(index, form.getValues(), imageFile, audioFile);
  }, [date]);

  function handleMoveUp() {
    if (index == 1) return;
    swapFunction(index - 1 + 1, index - 1);
  }

  function handleMoveDown() {
    swapFunction(Number(index), Number(index) + 1); // -1 transform string in number
  }

  function deleteSong() {
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
          setterFunction(index, form.getValues(), imageFile, audioFile);
        }}
        className="flex flex-col space-y-4 gap-4 text-accent/50">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-6 w-[50%]">
            <span className="text-foreground">
              Entry details <span className="text-accent">*</span>{" "}
            </span>

            <div className="hover:text-accent ">
              <input
                type="text"
                placeholder="Artist Name"
                className="-mt-4 w-full bg-background placeholder:text-accent  p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("artist")}
              />
              {form.formState.errors.artist && <p className="text-red-500 absolute">{form.formState.errors.artist.message}</p>}
            </div>

            <div className="hover:text-accent ">
              <input
                type="text"
                placeholder="Album Name"
                className="w-full  bg-background placeholder:text-accent p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("album")}
              />
              {form.formState.errors.album && <p className="text-red-500 absolute ">{form.formState.errors.album.message}</p>}
            </div>

            <div className="hover:text-accent ">
              <input
                type="text"
                placeholder="Category"
                className="w-full bg-background placeholder:text-accent p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("category")}
              />
              {form.formState.errors.category && <p className="text-red-500 absolute">{form.formState.errors.category.message}</p>}
            </div>

            <div className="hover:text-accent">
              <input
                type="text"
                placeholder="Title"
                className="w-full bg-background p-3 placeholder:text-accent border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("title")}
              />
              {form.formState.errors.title && <p className="text-red-500 absolute">{form.formState.errors.title.message}</p>}
            </div>

            <div className="hover:text-accent">
              <input
                type="text"
                placeholder="Numbers Protocol: NID (optional)"
                className="w-full bg-background p-3 placeholder:text-accent border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("numbers_nid")}
              />
              {form.formState.errors.numbers_nid && <p className="text-red-500 absolute">{form.formState.errors.numbers_nid.message}</p>}
            </div>

            <div>
              <DatePicker setterFunction={setDate} previousDate={date} />
              {form.formState.errors.date && <p className="text-red-500 absolute">{form.formState.errors.date.message}</p>}
            </div>
          </div>

          <div className="gap-4 flex-col flex-1 items-center justify-center">
            <span className="mb-6 text-foreground">Cover Art Image</span>

            <DragAndDropZone setFile={setImageFile} setImagePreview={setImageURL} imagePreview={imageURL} />
            {form.formState.errors.cover_art_url && <p className="text-red-500 absolute -mt-6">{form.formState.errors.cover_art_url.message?.toString()}</p>}

            <div>
              <div className="flex gap-2 flex-row">
                <label className="text-foreground text-xs">Track File (.mp3)</label>
                {audioFileIsLoading && <Loader2 className="flex text-accent justify-center items-center animate-spin" />}
              </div>
              {audioURL && !wantToEditAudio && !audioFile ? (
                <div className="mt-2 flex flex-row justify-start items-center  ">
                  <audio
                    tabIndex={-1}
                    onLoadStart={() => setAudioFileIsLoading(true)}
                    onError={() => {
                      setAudioFileIsLoading(false);
                    }}
                    onLoadedData={() => setAudioFileIsLoading(false)}
                    src={audioURL}
                    className="-ml-9 scale-[0.8]"
                    controls
                  />
                  <Button
                    tabIndex={-1}
                    className="border border-accent p-2 hover:bg-accent/50 bg-accent/20 rounded-full flex items-center justify-center"
                    onClick={() => setwantToEditAudio(true)}>
                    <div>
                      <Edit2 className="text-accent  " />
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="mt-2 p-2 w-full flex flex-row items-center justify-center rounded-md border border-accent/50 bg-muted text-sm text-accent/50  ">
                  <Input accept=".mp3" id="song" type="file" className=" w-24 overflow-hidden border-0 p-0" onChange={(e) => handleAudioFileChange(e)} />
                  <div className="text-accent/50 w-[10rem] truncate ">
                    {audioFile ? audioFile.name : audioURL?.split("_")[1] ? audioURL.split("_")[1] : "No chosen file"}{" "}
                  </div>
                  {audioURL ? <Music className="text-accent ml-auto" /> : <Upload className="text-accent ml-auto" />}
                </div>
              )}
              {form.formState.errors.file && <p className="text-red-500 mt-3 absolute">{form.formState.errors.file.message?.toString()}</p>}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-full flex flex-col justify-start items-start max-w-[30rem]">
            {validationMessage && (
              <p className="text-red-500">
                Please fill the folowing fields: <br></br> {validationMessage}{" "}
              </p>
            )}
          </div>
          <Button type="button" tabIndex={-1} onClick={deleteSong} className="bg-background rounded-full mr-2 p-2 px-6 text-accent border border-accent">
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
