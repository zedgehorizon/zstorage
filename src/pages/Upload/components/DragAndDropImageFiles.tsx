import { ImagePlus } from "lucide-react";
import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

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
    if (file) {
      setFile(file);
      displayPreview(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      displayPreview(file);
      setFile(file);
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
      <input
        type="file"
        className="cursor-pointer w-[15rem] h-[15rem] absolute inset-0 w-full h-full opacity-0 z-50"
        ref={inputRef}
        onChange={handleInputChange}
      />
      <div className="text-center">
        {/* 
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          <label htmlFor="file-upload" className="relative cursor-pointer">
            <span>Drag and drop</span>
            <span className="text-indigo-600"> or browse</span>
            <span> to upload</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={inputRef} onChange={handleInputChange} />
          </label>
        </h3>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
     */}
        {!previewSrc && (
          <>
            <div className=" flex items-center justify-center mt-12 mx-auto  bg-accent/20 p-3 w-16 h-16  rounded-full">
              <ImagePlus className="w-8 h-8 text-accent" />
            </div>

            <label htmlFor="file-upload" className="relative text-accent/70 mx-2 text-center   cursor-pointer">
              Drag & drop image here, or
              <span className=" mx-2 text-accent text-center underline ">select </span>
              from your computer.
              <input id="file-upload" name="file-upload" type="file" className="sr-only " ref={inputRef} onChange={handleInputChange} />
            </label>
          </>
        )}
      </div>
      {previewSrc && (
        <img src={previewSrc} className="z-0 rounded-xl object-fill max-h-[15rem] max-w-[15rem] border-2 border-accent  " id="preview" alt="Preview" />
      )}
    </div>
  );
};

export default DragAndDropImageFiles;
