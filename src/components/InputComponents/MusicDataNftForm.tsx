import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
        console.log("SIZE", file);
        return file[0]?.size <= MAX_FILE_SIZE;
      },
      { message: `Max song size is 5MB.` }
    )
    .refine(
      (file) => {
        return file[0]?.type === "audio/mpeg";
      },
      { message: "Only audio/mpeg formats are supported." } /// maybe add more
    ),
  coverArt: z
    .any()
    .refine(
      (file) => {
        console.log("SIZE", file[0]?.size);
        return file[0]?.size <= MAX_FILE_SIZE;
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
  setterFunction: (selectedOption: any) => void;
};

export function MusicDataNftForm(props: MusicDataNftFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      category: undefined,
      artist: "",
      album: "",
      title: "",
      trackFile: "",
      coverArt: "",
    },
  });
  const [file, setFile] = useState("");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // const coverLink = async upload_image()
    // const songURL = upload_song();

    console.log("VALL", values);
    props.setterFunction((prev: any) => Object.assign(prev, { [props.index]: values }));
  }
  // console.log("VALUES", form.getValues());
  return (
    <div className="w-[80%] z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50 max-w mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row space-y-4 gap-4 ">
        <div>
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              className=" bg-black/20 w-full p-2 border border-gray-300 rounded"
              {...form.register("date")}
              onChange={(e) => {
                console.log("DATA", e.target.value);
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
              className="w-full p-2 border border-gray-300 rounded"
              {...form.register("coverArt")}
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files) setFile(URL.createObjectURL(e.target.files[0]));
                //form.setValue("coverArt", "something.png");
              }}
            />
            {form.formState.errors.coverArt && <p className="text-red-500">{form.formState.errors.coverArt.message?.toString()}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Track File (MP3)</label>
            <input
              type="file"
              accept=".mp3"
              className="w-full p-2 border border-gray-300 rounded"
              {...form.register("trackFile")}
              onChange={(e) => {
                console.log(e.target.files);
                // form.setValue("coverArt","something.mp3")
              }}
            />
            {form.formState.errors.trackFile && <p className="text-red-500">{form.formState.errors.trackFile.message?.toString()}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
