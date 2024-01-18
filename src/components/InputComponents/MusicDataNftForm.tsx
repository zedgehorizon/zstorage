import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../libComponents/Button";
import { ArrowUp, ArrowDown, Trash2, Edit2, CheckCircleIcon, Loader2, Upload, ImagePlus, Music, Lightbulb } from "lucide-react";
import { DatePicker } from "../../libComponents/DatePicker";
import { Input } from "../../libComponents/Input";
import DragAndDropImageFiles from "../../pages/Upload/components/DragAndDropImageFiles";
import toast from "react-hot-toast";

// todo if the img is not loading it keeps the image of the song you are swaping with (maybe add a fallback image)
// todo check why getting 502(The gateway is currently overloaded. Please wait a while and retry your request.
// todo when deleting a song the next one after gets required fields and saved

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
};

/// the form for each song that is going to be uploaded
export function MusicDataNftForm(props: MusicDataNftFormProps) {
  const [wantToEditImage, setwantToEditImage] = useState(false);
  const [wantToEditAudio, setwantToEditAudio] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
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
  console.log(imageFile);
  const [audioFile, setAudioFile] = useState<File>();
  const [audioError, setAudioError] = useState(false);
  const [audioFileIsLoading, setAudioFileIsLoading] = useState(false);
  const handleImageFileChange = (event: any) => {
    const file = event.target.files[0];
    setImageFile(file);
    const imageURL = URL.createObjectURL(event.target.files[0]);
    form.setValue("cover_art_url", imageURL);
    setImageURL(imageURL);
    setwantToEditImage(false);
  };
  console.log(props.index, audioFile);
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

  // populate the form
  useEffect(() => {
    form.setValue("date", props.song["date"] ? new Date(props.song["date"]).toISOString().split("T")[0] : "");
    form.setValue("category", props.song["category"] ? props.song["category"] : "");
    form.setValue("artist", props.song["artist"] ? props.song["artist"] : "");
    form.setValue("album", props.song["album"] ? props.song["album"] : "");
    form.setValue("title", props.song["title"] ? props.song["title"] : "");

    if (props.song["cover_art_url"]) {
      form.setValue("cover_art_url", props.song["cover_art_url"]);
      setImageURL(props.song["cover_art_url"]);
    } else {
      setwantToEditImage(false);
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
    setAudioError(false);
  }, [props.song]);

  useEffect(() => {
    if (imageURL) form.setValue("cover_art_url", imageURL);
  }, [imageURL]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.setterFunction(props.index, values, imageFile, audioFile);
    props.setUnsavedChanges(props.index, false);
  }

  function handleMoveUp() {
    ///prosp.index is string
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
              <Button tabIndex={-1} onClick={handleMoveUp} className=" text-accent hover:shadow-inner hover:shadow-accent">
                <ArrowUp />
              </Button>
            )}
            {!props.lastItem && (
              <Button tabIndex={-1} onClick={handleMoveDown} className="text-accent hover:shadow-inner hover:shadow-accent">
                <ArrowDown></ArrowDown>
              </Button>
            )}
          </div>
        </div>
      </div>
      <form
        onChange={() => {
          props.setUnsavedChanges(props.index, true);
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 gap-4 text-accent/50">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-6 w-[50%]">
            <span className="text-foreground">
              Update details <span className="text-accent">*</span>{" "}
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

            <div className=" hover:text-accent ">
              <input
                type="text"
                placeholder="Title"
                className="w-full bg-background p-3 placeholder:text-accent border border-accent/50 rounded focus:outline-none focus:border-accent"
                {...form.register("title")}
              />
              {form.formState.errors.title && <p className="text-red-500 absolute">{form.formState.errors.title.message}</p>}
            </div>
            <div>
              <DatePicker setterFunction={(date) => form.setValue("date", date)} previousDate={form.getValues("date")} />
              {form.formState.errors.date && <p className="text-red-500 absolute">{form.formState.errors.date.message}</p>}
            </div>
          </div>
          <div className="gap-4 flex-col flex-1 items-center justify-center ">
            <span className="mb-6 text-foreground">Cover Art Image</span>
            {/* <Suspense fallback={<div>Loading image...</div>}>
              <img
                className="mx-auto w-32 h-32 border border-white"
                src={imageURL || songFallbackImage}
                onError={() => setImageURL(songFallbackImage)}
                alt="Cover Image"
              />
            </Suspense> */}
            {/* <div className="flex flex-col justify-center items-center w-[80%] mb-4 mt-2 justify-start h-[65%] border-2 border-dashed border-accent/50">
              <div className="bg-accent/20 p-3 rounded-full">
                <ImagePlus className="w-8 h-8 text-accent" />
              </div>

              <p className="text-accent/70 mx-8">Drag & drop image here, or select from your computer.</p>
            </div> */}
            <DragAndDropImageFiles setFile={setImageFile} setImagePreview={setImageURL} imagePreview={imageURL ? imageURL : undefined} />
            {form.formState.errors.cover_art_url && <p className="text-red-500 absolute -mt-6">{form.formState.errors.cover_art_url.message?.toString()}</p>}

            {/* <div className="flex flex-col w-full justify-end">
              {(imageFile || imageURL !== "") && !wantToEditImage ? (
                <div className="flex flex-row">
                  <Button
                    tabIndex={-1}
                    className="scale-75 ml-auto justify-end hover:shadow-inner hover:shadow-sky-400 "
                    onClick={() => setwantToEditImage(true)}>
                    <Edit2 scale={0.5}></Edit2>
                  </Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => {
                    if (e.target.files) handleImageFileChange(e);
                  }}
                />
              )}
              {form.formState.errors.cover_art_url && <p className="text-red-500">{form.formState.errors.cover_art_url.message?.toString()}</p>}
            </div> */}
            <div>
              <label className="mb-4 text-foreground">Track File (mp3)</label>
              {/* {audioURL && !wantToEditAudio ? (
              <div className="flex justify-center flex-col w-full ">
                <div className="flex flex-row justify-center">
                  <audio
                    tabIndex={-1}
                    onLoadStart={() => setAudioFileIsLoading(true)}
                    onError={() => {
                      setAudioFileIsLoading(false);
                      setAudioError(true);
                    }}
                    onLoadedData={() => setAudioFileIsLoading(false)}
                    src={audioURL}
                    className="scale-75"
                    controls></audio>
                  {audioFileIsLoading && <Loader2 className="flex justify-center items-center -ml-8 mt-3  animate-spin" />}
                  <Button tabIndex={-1} className="scale-75  ml-auto  hover:shadow-inner hover:shadow-sky-400 " onClick={() => setwantToEditAudio(true)}>
                    <Edit2 scale={0.5}></Edit2>
                  </Button>
                </div>
                {audioFileIsLoading && (
                  <>
                    <p className="mx-auto text-foreground"> Pinning file to IPFS may take some time. </p>
                  </>
                )}
                {audioError && (
                  <>
                    <p className="mx-auto text-foreground">Unable to load audio file from IPFS. </p>
                  </>
                )}
              </div>
            ) : ( */}
              {/* <input type="file" accept=".mp3" className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleAudioFileChange(e)} /> */}
              {audioURL && !wantToEditAudio ? (
                <div className="mt-2 flex flex-row w-15 justify-center items-center  ">
                  <audio
                    tabIndex={-1}
                    onLoadStart={() => setAudioFileIsLoading(true)}
                    onError={() => {
                      setAudioFileIsLoading(false);
                      setAudioError(true);
                    }}
                    onLoadedData={() => setAudioFileIsLoading(false)}
                    src={audioURL}
                    className="  ml-[-33px] scale-75 "
                    controls></audio>
                  {audioFileIsLoading && <Loader2 className="flex justify-center items-center -ml-8 mt-3  animate-spin" />}
                  <Button tabIndex={-1} className="scale-75 " onClick={() => setwantToEditAudio(true)}>
                    <div className="-mt-2 p-2 hover:bg-accent/50 bg-accent/20 rounded-full flex items-center justify-center">
                      <Edit2 className="text-accent" />
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="mt-2 w-full flex-1 items-center ">
                  <Input accept=".mp3" id="song" type="file" onChange={(e) => handleAudioFileChange(e)} />
                  {imageURL ? <Music className="text-accent ml-[108px] mt-[-40px] " /> : <Upload className="text-accent ml-[108px] mt-[-40px] " />}
                </div>
              )}
              {form.formState.errors.file && <p className="text-red-500 mt-3 absolute">{form.formState.errors.file.message?.toString()}</p>}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row ">
          {props.unsavedChanges != undefined && props.unsavedChanges === false && (
            <div className="mt-2  flex flex-row gap-2 text-accent">
              Saved <CheckCircleIcon className="text-accent" />
            </div>
          )}
          <div className="w-full flex flex-col justify-center items-center ">
            {props.unsavedChanges && <p className="text-accent"> Unsaved changes, please save</p>}
          </div>{" "}
          <Button tabIndex={-1} onClick={deleteSong} className="bg-background rounded-full mr-2 p-2 px-6 border border-accent">
            Delete
          </Button>
          <button type="submit" className="bg-accent text-accent-foreground p-2 px-6 rounded-full  ">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
