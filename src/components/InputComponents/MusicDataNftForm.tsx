import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../libComponents/Button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../utils/constants";

// validation schema
const formSchema = z.object({
  date: z.string().min(1, "Required field"),
  category: z.string().min(1, "Required field"),
  artist: z.string().min(1, "Required field"),
  album: z.string().min(1, "Required field"),
  title: z.string().min(1, "Required field"),
  trackFile: z
    .any()
    .refine(
      (file) => {
        //console.log("SIZE", file);
        return file[0] && file[0].size <= MAX_FILE_SIZE;
      },
      { message: `Max song size is 5MB.` }
    )
    .refine(
      (file) => {
        return file[0] && file[0].type === "audio/mpeg";
      },
      { message: "Only audio/mpeg formats are supported." } /// maybe add more
    ),
  coverArt: z
    .any()
    .refine(
      (file) => {
        return file[0] && file[0].size <= MAX_FILE_SIZE;
      },
      { message: `Max image size is 5MB.` }
    )
    .refine(
      (file) => {
        return ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
      },
      { message: "Only .jpg, .jpeg, .png and .webp formats are supported." }
    ),
});

type MusicDataNftFormProps = {
  index: number;
  song: any;
  setterFunction: (selectedOption: any) => void;
  swapFunction: (first: number, second: number) => void; // will swap first index with the second in the parrent component
};

/// the form for each song that is going to be uploaded
export function MusicDataNftForm(props: MusicDataNftFormProps) {
  const [isSaved, setIsSaved] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "", /// add date with time in minutes
      category: "",
      artist: "",
      album: "",
      title: "",
      trackFile: "",
      coverArt: "",
    },
  });
  const [file, setFile] = useState("");
  const [mp3File, setMp3File] = useState();

  // if we want to update, prepopulate the form
  useEffect(() => {
    setIsSaved(false);
    form.setValue("date", props.song["date"] ? props.song["date"] : "");
    form.setValue("category", props.song["category"] ? props.song["category"] : "");
    form.setValue("artist", props.song["artist"] ? props.song["artist"] : "");
    form.setValue("album", props.song["album"] ? props.song["album"] : "");
    form.setValue("title", props.song["title"] ? props.song["title"] : "");
    form.setValue("trackFile", props.song["trackFile"] ? props.song["trackFile"] : {});
    form.setValue("trackFile", props.song["trackFile"] ? props.song["trackFile"] : {});
    console.log("ARTTT", props.index, props.song["coverArt"]);
    form.setValue("coverArt", props.song["coverArt"] ? props.song["coverArt"] : {});
    if (props.song["coverArt"] && props.song["coverArt"][0]) setFile(URL.createObjectURL(props.song["coverArt"][0])); // /
  }, [props.song]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("VAL on submit", values);
    const imgFile = values.coverArt[0];
    const mp3File = values.trackFile[0];

    props.setterFunction((prev: any) => Object.assign(prev, { [props.index]: values }));
    setIsSaved(true);
  }

  function handleMoveUp() {
    ///prosp.index is string
    if (props.index == 1) return;
    props.swapFunction(props.index - 1 + 1, props.index - 1);
  }
  function handleMoveDown() {
    props.swapFunction(Number(props.index), Number(props.index) + 1); // -1 solves the problem for now
  }

  function deleteSong() {
    props.swapFunction(Number(props.index), -1);
  }

  return (
    <div className="w-[80%] z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50 max-w mx-auto">
      <div className="relative">
        <div className="absolute top-0 right-0">
          <div className="flex flex-col justify-between">
            <Button onClick={handleMoveUp} className="hover:shadow-inner hover:shadow-sky-500">
              <ArrowUp />
            </Button>
            <Button onClick={handleMoveDown} className="hover:shadow-inner hover:shadow-sky-500">
              <ArrowDown></ArrowDown>
            </Button>
          </div>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row space-y-4 gap-4 ">
        <div>
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              className="bg-black/20 w-full p-2 border border-gray-300 rounded"
              {...form.register("date")}
              onChange={(e) => {
                //form.setValue("date", new Date(e.target.value));
              }}
            />
            {form.formState.errors.date && <p className="text-red-500">{form.formState.errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Category</label>
            <input type="text" className=" bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("category")} />
            {form.formState.errors.category && <p className="text-red-500">{form.formState.errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Artist</label>
            <input type="text" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("artist")} />
            {form.formState.errors.artist && <p className="text-red-500">{form.formState.errors.artist.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Album</label>
            <input type="text" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("album")} />
            {form.formState.errors.album && <p className="text-red-500">{form.formState.errors.album.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Title</label>
            <input type="text" className="bg-black/20 w-full p-2 border border-gray-300 rounded" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-red-500">{form.formState.errors.title.message}</p>}
          </div>
        </div>
        <div className="gap-4 flex-col flex items-center justify-center ">
          <div className="justify-center">
            <img className="justify-center allign-center w-32 h-32 border border-white" src={file} alt={"Cover Image"}></img>
            <label className=" block text-gray-700">Cover Art Image</label>
            <input
              type="file"
              accept="image/*"
              // disabled={!!file}
              className="w-full p-2 border border-gray-300 rounded"
              {...form.register("coverArt")}
              onChange={(e) => {
                // console.log("COVER ART ", e.target.files);

                if (e.target.files) {
                  console.log(e.target.files);
                  const imageURL = URL.createObjectURL(e.target.files[0]);
                  //form.setValue("coverArt", e.target.files[0]);
                  setFile(imageURL);
                }
              }}
            />
            {form.formState.errors.coverArt && <p className="text-red-500">{form.formState.errors.coverArt.message?.toString()}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Track File (MP3)</label>
            <input
              type="file"
              accept=".mp3"
              disabled={mp3File}
              className="w-full p-2 border border-gray-300 rounded"
              {...form.register("trackFile")}
              onChange={(e) => {
                //setMp3File(true);
                console.log("FILETRACK_UL inserat", e.target.files);
                console.log("the values of the form : ");
                //form.setValue("trackFile", e.target.files ? e.target.files[0] : "asd");
              }}
            />
            {form.formState.errors.trackFile && <p className="text-red-500">{form.formState.errors.trackFile.message?.toString()}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Save
          </button>
          <button className="bg-red-200" onClick={deleteSong}>
            delete
          </button>
          {isSaved && <p className="text-green-400"> saved</p>}
        </div>
      </form>
    </div>
  );
}
