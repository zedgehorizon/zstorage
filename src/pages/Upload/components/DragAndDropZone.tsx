import { Edit2, File, ImagePlus } from "lucide-react";
import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@utils/functions";
import { whitelistMimeTypes } from "@utils/constants";

interface DragAndDropZoneProps {
  setFile?: (file: File) => void;
  addMultipleFiles?: (files: File[]) => void;
  setImagePreview?: (previewSrc: string) => void; // if not set, means we are not working with Image Files
  imagePreview?: string;
  dropZoneStyles?: string;
}

const DragAndDropZone: React.FC<DragAndDropZoneProps> = (props) => {
  const { setFile, addMultipleFiles, setImagePreview, imagePreview, dropZoneStyles } = props;
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (imagePreview !== undefined) setPreviewSrc(imagePreview);
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
    handleFilesChange(e.dataTransfer.files);
  };

  const fileValidation = (name: string, type: string) => {
    const splitedName = name.split(".");
    const extension = splitedName[splitedName.length - 1];

    if (import.meta.env.VITE_ENV_FILE_MIME_TYPE_VALIDATION === "true" && !(whitelistMimeTypes[extension] === type)) {
      toast.warning("We currently do not support this file extension: " + name + "; type " + type);
      return false;
    }
    return true;
  };

  const handleFilesChange = (files: FileList | null) => {
    if (files) {
      if (addMultipleFiles) {
        const verifiedFiles = Array.from(files).filter((file) => fileValidation(file.name, file.type));
        addMultipleFiles(verifiedFiles);
      } else {
        const file = files[0];
        if (!fileValidation(file.name, file.type)) return;
        if (!setFile) {
          toast.warning("There is an error with the file upload. Please try again later.");
          return;
        }
        if (file.type?.startsWith("image/")) {
          setFile(file);
          if (setImagePreview) displayPreview(file);
        } else {
          if (setImagePreview) {
            toast.warning("Please upload an image file");
          } else {
            setFile(file);
          }
        }
      }
    } else {
      toast.warning("Please upload a file");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFilesChange(e.target.files);
  };

  const displayPreview = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewSrc(reader.result as string);
      setImagePreview ? setImagePreview(reader.result as string) : null;
    };
  };

  return (
    <div
      className={cn("relative w-[15rem] h-[15rem] mb-6 mt-2 rounded-xl border-[2px] border-dashed border-accent/20", dropZoneStyles)}
      ref={dropzoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className="text-center">
        {!previewSrc && (
          <>
            <div className=" flex items-center justify-center mt-12 mx-auto  bg-accent/20 p-3 w-16 h-16  rounded-full">
              {setImagePreview ? <ImagePlus className="w-8 h-8 text-accent" /> : <File className="w-8 h-8 text-accent" />}
            </div>

            <label htmlFor="file-upload" className="relative text-accent/70 mx-2 text-center">
              Drag & drop file here, or
              <span className=" mx-2 text-accent text-center underline  cursor-pointer">select </span>
              from your computer.
            </label>
            <input
              className="absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              multiple={addMultipleFiles ? true : false}
              name="file-upload"
              accept={setImagePreview ? "image/*" : ""}
              onChange={handleInputChange}
            />
          </>
        )}
      </div>
      {previewSrc && (
        <img
          src={previewSrc}
          className="z-0 absolute rounded-xl max-h-[15rem] max-w-[15rem] border-[2px] border-accent -ml-[1px] -mt-[1px]"
          id="preview"
          alt="Preview"
        />
      )}
      {previewSrc && (
        <div className="z-8 w-full h-full absolute bg-background/50 mt-[1px]  rounded-xl opacity-0 hover:opacity-100">
          <div className="mt-16 mx-auto p-3 w-12 h-12 bg-accent/20 flex   rounded-full  items-center justify-center">
            <Edit2 className="text-accent" />
          </div>
          <div className="mt-6 mx-auto text-center text-accent">
            <span className="select-none">Pick another image</span>
          </div>
          <input
            type="file"
            multiple={addMultipleFiles ? true : false}
            accept={setImagePreview ? "image/*" : ""}
            className="mx-auto w-full h-full rounded-xl cursor-pointer absolute inset-0   opacity-0 z-50"
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default DragAndDropZone;
