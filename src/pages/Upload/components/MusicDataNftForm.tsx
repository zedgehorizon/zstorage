import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@libComponents/Button";
import { ArrowUp, ArrowDown, Edit2, CheckCircleIcon, Loader2, Upload, ImagePlus, Music, Lightbulb } from "lucide-react";
import { DatePicker } from "@libComponents/DatePicker";
import { Input } from "@libComponents/Input";
import DragAndDropZone from "./DragAndDropZone";
import toast from "react-hot-toast";

const formSchema = z.object({
  date: z.string().min(1, "Required field"),
  category: z.string().min(1, "Required field"),
  artist: z.string().min(1, "Required field"),
  album: z.string().min(1, "Required field"),
  title: z
    .string()
    .min(1, "Required field")
    .refine((data) => !data.includes("manifest"), {
      message: "The title cannot contain the word 'manifest'",
    }),
  cover_art_url: z.string().min(1, "Required field"),
  file: z.string().min(1, "Required field"),
});

type MusicDataNftFormProps = {
  index: number;
  song: any;
  lastItem: boolean;
  setterFunction: (index: number, formInputs: any, image: any, audio: any) => void;
  swapFunction: (first: number, second: number) => void; // will swap first index with the second in the parrent component
  unsavedChanges: boolean;
  setUnsavedChanges: (index: number, value: boolean) => void;
  validationMessage?: string;
};

/// the form for each song that is going to be uploaded
export function MusicDataNftForm(props: MusicDataNftFormProps) {
  const { validationMessage } = props;
  const [wantToEditAudio, setwantToEditAudio] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "",
      artist: "",
      album: "",
      title: "",
      file: "",
      cover_art_url: "",
    },
  });

  const [imageURL, setImageURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();
  const [audioFileIsLoading, setAudioFileIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAudioFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      const audioURL = URL.createObjectURL(event.target.files[0]);
      form.setValue("file", audioURL);
      setAudioURL(audioURL);
      setwantToEditAudio(false);
    } else {
      toast("Please upload an audio file", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
      });
    }
  };

  // useEffect(() => {
  //   form.setValue("date", new Date().toISOString().split("T")[0]);
  //   console.log("form reset", form.getValues());
  // }, []);

  // populate the form
  useEffect(() => {
    form.setValue("date", props.song["date"] ? new Date(props.song["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setDate(props.song["date"] ? new Date(props.song["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    form.setValue("category", props.song["category"] ? props.song["category"] : "");
    form.setValue("artist", props.song["artist"] ? props.song["artist"] : "");
    form.setValue("album", props.song["album"] ? props.song["album"] : "");
    form.setValue("title", props.song["title"] ? props.song["title"] : "");

    if (props.song["cover_art_url"]) {
      form.setValue("cover_art_url", props.song["cover_art_url"]);
      setImageURL(props.song["cover_art_url"]);
    } else {
      setImageURL("");
    }

    if (props.song["file"]) {
      form.setValue("file", props.song["file"]);
      setAudioURL(props.song["file"]);
    } else {
      setwantToEditAudio(false);
      setAudioURL("");
    }

    setImageFile(undefined);
    setAudioFile(undefined);
  }, [props.song]);

  useEffect(() => {
    if (imageURL) form.setValue("cover_art_url", imageURL);
  }, [imageURL]);

  useEffect(() => {
    if (imageFile) props.setterFunction(props.index, form.getValues(), imageFile, audioFile);
  }, [imageFile]);

  useEffect(() => {
    if (date) form.setValue("date", new Date(date).toISOString().split("T")[0]);
    //props.setterFunction(props.index, { date: date }, imageFile, audioFile);
  }, [date]);
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   // console.log(imageFile, audioFile);
  //   // console.log(values, "values");
  //   props.setterFunction(props.index, values, imageFile, audioFile);
  //   //props.setUnsavedChanges(props.index, false);
  // }

  function handleMoveUp() {
    if (props.index == 1) return;
    props.swapFunction(props.index - 1 + 1, props.index - 1);
  }

  function handleMoveDown() {
    props.swapFunction(Number(props.index), Number(props.index) + 1); // -1 transform string in number
  }

  function deleteSong() {
    props.swapFunction(Number(props.index), -1);
  }

  return (
    <div className=" p-12 flex flex-col bg-muted w-[100%] max-w-[80rem] mx-auto border-b border-accent/50">
      <div className="text-2xl text-accent text-center p-3"> 0{props.index}</div>
      <div className="relative">
        <div className="absolute top-0 right-0">
          <div className="flex flex-col justify-between">
            {props.index != 1 && (
              <Button
                tabIndex={-1}
                onClick={handleMoveUp}
                className="mb-2 border border-accent p-2 hover:bg-accent/50 bg-accent/20 rounded-full flex items-center justify-center">
                <ArrowUp className="text-accent" />
              </Button>
            )}
            {!props.lastItem && (
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
        // onFocus={() => props.setterFunction(props.index, form.getValues(), imageFile, audioFile)}
        // onChange={() => {
        //   onSubmit(form.getValues());
        // }}
        onBlur={() => {
          console.log("onBlur song Object ");
          console.log(form.getValues(), "form values");
          props.setterFunction(props.index, form.getValues(), imageFile, audioFile);
        }}
        // onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 gap-4 text-accent/50">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-6 w-[50%]">
            <span className="text-foreground">
              Entry details <span className="text-accent">*</span>{" "}
            </span>

            <div className=" hover:text-accent ">
              <input
                type="text"
                placeholder="Artist Name"
                className="-mt-4 w-full bg-background placeholder:text-accent  p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("artist")}
              />
              {form.formState.errors.artist && <p className="text-red-500 absolute">{form.formState.errors.artist.message}</p>}
            </div>

            <div className=" hover:text-accent ">
              <input
                type="text"
                placeholder="Album Name"
                className="w-full  bg-background placeholder:text-accent p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("album")}
              />
              {form.formState.errors.album && <p className="text-red-500 absolute ">{form.formState.errors.album.message}</p>}
            </div>

            <div className=" hover:text-accent ">
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
            <div>
              <DatePicker setterFunction={setDate} previousDate={date} />
              {form.formState.errors.date && <p className="text-red-500 absolute">{form.formState.errors.date.message}</p>}
            </div>
          </div>
          <div className="gap-4 flex-col flex-1 items-center justify-center ">
            <span className="mb-6 text-foreground">Cover Art Image</span>

            <DragAndDropZone idxId={props.index} setFile={setImageFile} setImagePreview={setImageURL} imagePreview={imageURL ? imageURL : undefined} />
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
                  {/* <Button tabIndex={-1} onClick={() => setwantToEditAudio(true)}>
                    <div className="hover:scale-110 hover:bg-accent text-accent hover:text-accent-foreground  bg-accent-foreground transition border border-accent hover:border-2 hover:border-accent-foreground  p-2 rounded-full flex items-center justify-center">
                      <Edit2 className="t " />
                    </div>
                  </Button> */}
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

        <div className="w-full flex flex-row ">
          {props.unsavedChanges != undefined && props.unsavedChanges === false && (
            <div className="mt-2  flex flex-row gap-2 text-accent">
              Verified <CheckCircleIcon className="text-accent" />
            </div>
          )}
          {/* <div className="w-full flex flex-col justify-center items-center ">
            {props.unsavedChanges && <p className="text-accent"> Unsaved changes, please save ! {validationMessage} </p>}
          </div> */}
          <div className="w-full flex flex-col justify-center items-center ">
            {validationMessage && <p className="text-red-500"> Please add: {validationMessage} </p>}
          </div>
          <Button tabIndex={-1} onClick={deleteSong} className="bg-background rounded-full mr-2 p-2 px-6 text-accent border border-accent">
            Delete
          </Button>
          {/* <button type="submit" className="bg-accent text-accent-foreground p-2 px-6 rounded-full  ">
            Save
          </button> */}
        </div>
      </form>
    </div>
  );
}
