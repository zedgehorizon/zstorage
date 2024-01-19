import { Edit2, ImagePlus, Lightbulb } from "lucide-react";
import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface DragAndDropImageFilesProps {
  setFile: (file: File) => void;
  setImagePreview: (previewSrc: string) => void;
  imagePreview?: string;
}

const DragAndDropImageFiles: React.FC<DragAndDropImageFilesProps> = (props) => {
  const { setFile, setImagePreview, imagePreview } = props;
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (imagePreview) {
      setPreviewSrc(imagePreview);
    }
  }, [imagePreview]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add("border-accent");
      dropzoneRef.current.classList.remove("border-accent/20");
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("border-accent");
      dropzoneRef.current.classList.add("border-accent/20");
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("border-accent");
      dropzoneRef.current.classList.add("border-accent/20");
    }
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      displayPreview(file);
    } else {
      toast("Please upload an image file", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      displayPreview(file);
      setFile(file);
    } else {
      toast("Please upload an image file", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
      });
    }
  };

  const displayPreview = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewSrc(reader.result as string);
      setImagePreview(reader.result as string);
    };
  };

  return (
    <div
      className="relative w-[15rem] h-[15rem]  mb-6 mt-2 rounded-xl border-[2px] border-dashed border-accent/20   "
      id="dropzone"
      ref={dropzoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className="text-center">
        {!previewSrc && (
          <>
            <div className=" flex items-center justify-center mt-12 mx-auto  bg-accent/20 p-3 w-16 h-16  rounded-full">
              <ImagePlus className="w-8 h-8 text-accent" />
            </div>

            <label htmlFor="file-upload" className="relative text-accent/70 mx-2 text-center   cursor-pointer">
              Drag & drop image here, or
              <span className=" mx-2 text-accent text-center underline ">select </span>
              from your computer.
              <input accept="image/*" id="file-upload" name="file-upload" type="file" className="sr-only " ref={inputRef} onChange={handleInputChange} />
            </label>
          </>
        )}
      </div>
      {previewSrc && (
        <img src={previewSrc} className="z-0 absolute rounded-xl max-h-[15rem] max-w-[15rem] border-[2px] border-accent  " id="preview" alt="Preview" />
      )}
      {previewSrc && (
        <div className="z-8 w-full h-full absolute bg-background/50  rounded-xl opacity-0 hover:opacity-100">
          <div className="mt-16 mx-auto p-3 w-12 h-12 bg-accent/20 flex   rounded-full  items-center justify-center">
            <Edit2 className="text-accent  " />
          </div>
          <div className="mt-6 mx-auto text-center text-accent">
            <span className="select-none">Pick another image</span>
          </div>
          <input
            type="file"
            accept="image/*"
            className="  mx-auto w-full h-full rounded-xl cursor-pointer   absolute inset-0   opacity-0 z-50"
            ref={inputRef}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default DragAndDropImageFiles;
