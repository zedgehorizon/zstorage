import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../libComponents/Button";
import { ArrowUp, ArrowDown, DeleteIcon, Trash2, Edit2, SaveIcon, CheckCheck, CheckCircleIcon, Loader, Loader2 } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../utils/constants";
import songFallbackImage from "../../assets/img/audio-player-image.png";

//todo add validation for the file size and type
// todo if the img is not loading it keeps the image of the song you are swaping with (maybe add a fallback image)
// todo check why getting 502(The gateway is currently overloaded. Please wait a while and retry your request.
// todo when deleting a song the next one after gets required fields and saved
/// validation schema

const formSchema = z.object({
  date: z.string().min(1, "Required field"),
  category: z.string().min(1, "Required field"),
  artist: z.string().min(1, "Required field"),
  album: z.string().min(1, "Required field"),
  title: z.string().min(1, "Required field"),
  cover_art_url: z.string().min(1, "Required field"),
  file: z.string().min(1, "Required field"),
  // file: z   ///TODO FIND A WAY TO ADD THE VALIDATION
  //   .any()
  //   .refine(
  //     (file) => {
  //       //console.log("SIZE", file);
  //       return file[0] && file[0].size <= MAX_FILE_SIZE;
  //     },
  //     { message: `Max song size is 5MB.` }
  //   )
  //   .refine(
  //     (file) => {
  //       return file[0] && file[0].type === "audio/mpeg";
  //     },
  //     { message: "Only audio/mpeg formats are supported." } /// maybe add more
  //   ),
  // cover_art_url: z
  //   .any()
  //   .refine(
  //     (file) => {
  //       return file[0] && file[0].size <= MAX_FILE_SIZE;
  //     },
  //     { message: `Max image size is 5MB.` }
  //   )
  //   .refine(
  //     (file) => {
  //       return ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
  //     },
  //     { message: "Only .jpg, .jpeg, .png and .webp formats are supported." }
  //   ),
});

type MusicDataNftFormProps = {
  index: number;
  song: any;
  lastItem: boolean;
  setterFunction: (index: number, formInputs: any, image: any, audio: any) => void;
  swapFunction: (first: number, second: number) => void; // will swap first index with the second in the parrent component
};

/// the form for each song that is going to be uploaded
export function MusicDataNftForm(props: MusicDataNftFormProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [wantToEditImage, setwantToEditImage] = useState(false);
  const [wantToEditAudio, setwantToEditAudio] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "", /// add date with time in minutes
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

  const handleAudioFileChange = (event: any) => {
    const file = event.target.files[0];
    setAudioFile(file);
    const audioURL = URL.createObjectURL(event.target.files[0]);
    form.setValue("file", audioURL);
    setAudioURL(audioURL);
    setwantToEditAudio(false);
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
  }, [props.song]);

  useEffect(() => {
    const values = form.getValues();
    props.setterFunction(props.index, values, imageFile, audioFile);
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.setterFunction(props.index, values, imageFile, audioFile);
    setIsSaved(true);
  }

  function handleMoveUp() {
    ///prosp.index is string
    if (props.index == 1) return;
    props.swapFunction(props.index - 1 + 1, props.index - 1);
  }

  function handleMoveDown() {
    props.swapFunction(Number(props.index), Number(props.index) + 1); // -1 transform string in number, solves the problem for now
  }

  function deleteSong() {
    props.swapFunction(Number(props.index), -1);
  }
  return (
    <div className="  z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50 max-w mx-auto">
      <div className="relative">
        <div className="absolute top-0 right-0">
          <div className="flex flex-col justify-between">
            {props.index != 1 && (
              <Button tabIndex={-1} onClick={handleMoveUp} className="hover:shadow-inner hover:shadow-sky-500">
                <ArrowUp />
              </Button>
            )}
            {!props.lastItem && (
              <Button tabIndex={-1} onClick={handleMoveDown} className="hover:shadow-inner hover:shadow-sky-500">
                <ArrowDown></ArrowDown>
              </Button>
            )}
          </div>
        </div>
      </div>
      <form onChange={() => setIsSaved(false)} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row space-y-4 gap-4 ">
        <div>
          <div>
            <label className="block text-foreground">Date</label>
            <input type="date" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("date")} />
            {form.formState.errors.date && <p className="text-red-500">{form.formState.errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-foreground">Category</label>
            <input type="text" className=" bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("category")} />
            {form.formState.errors.category && <p className="text-red-500">{form.formState.errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-foreground">Artist</label>
            <input type="text" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("artist")} />
            {form.formState.errors.artist && <p className="text-red-500">{form.formState.errors.artist.message}</p>}
          </div>

          <div>
            <label className="block text-foreground">Album</label>
            <input type="text" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("album")} />
            {form.formState.errors.album && <p className="text-red-500">{form.formState.errors.album.message}</p>}
          </div>

          <div>
            <label className="block text-foreground">Title</label>
            <input type="text" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-red-500">{form.formState.errors.title.message}</p>}
          </div>
          {isSaved && (
            <div className="mt-2  flex flex-row gap-2 text-green-400">
              {" "}
              Saved <CheckCircleIcon />{" "}
            </div>
          )}
        </div>
        <div className="gap-4 flex-col flex items-center justify-center ">
          <Suspense fallback={<div>Loading image...</div>}>
            <img
              className="mx-auto flex justify-center allign-center w-32 h-32 border border-white"
              src={imageURL !== "" ? imageURL : songFallbackImage}
              onError={() => {
                setImageURL(songFallbackImage);
              }}
              alt={"Cover Image"}></img>{" "}
          </Suspense>
          <label className=" block text-foreground">Cover Art Image</label>
          <div className="flex w-full justify-end">
            {(imageFile || imageURL !== "") && !wantToEditImage ? (
              <div>
                <Button tabIndex={-1} className="scale-75  justify-end hover:shadow-inner hover:shadow-sky-400 " onClick={() => setwantToEditImage(true)}>
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
          </div>
          <div>
            <label className="block text-foreground">Track File (MP3)</label>

            {audioURL && !wantToEditAudio ? (
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
                {audioError && <p className="mx-auto text-red-500">Error loading audio file from IPFS. Try again later. </p>}
              </div>
            ) : (
              <input type="file" accept=".mp3" className="w-full p-2 border border-gray-300 rounded" onChange={(e) => handleAudioFileChange(e)} />
            )}
            {form.formState.errors.file && <p className="text-red-500">{form.formState.errors.file.message?.toString()}</p>}
          </div>
          <div className="w-full flex flex-row ">
            <div className="w-full flex justify-center">
              <button type="submit" className=" self-center hover:shadow-inner hover:shadow-sky-400  text-foreground p-2 rounded  ">
                Save
              </button>
            </div>
            <Button tabIndex={-1} onClick={deleteSong} className="ml-auto flex justify-end self-end hover:shadow-inner hover:shadow-red-400">
              <Trash2 />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
