import { Edit2, File, Trash2 } from "lucide-react";
import React from "react";
import { Progress } from "@libComponents/Progress";
import { Button } from "@libComponents/Button";

interface FileCardProps {
  index: number;
  fileName?: string;
  fileSize?: number;
  onDelete: (index: number) => void;
}

const FileCard: React.FC<FileCardProps> = (props) => {
  const { fileName, fileSize, index, onDelete } = props;
  const [progressBar, setProgressBar] = React.useState(100);

  return (
    <div className="flex text-accent flex-row items-center p-4 justify-center gap-3 border-b border-accent/20 max-w-[50rem]">
      <span className="text-3xl">
        {index <= 9 ? "0" : ""}
        {index}
      </span>
      <File className="h-16 w-16" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between ">
          <h3 className="text-foreground w-[20rem] max-h-[10rem] overflow-ellipsis overflow-hidden whitespace-nowrap">{fileName}</h3>
          <p className="text-sm text-foreground/80">File size: {fileSize ? (fileSize / 1024 ** 2).toFixed(2) : "nan"} MB</p>
        </div>
        <Progress className="w-[25rem] h-2" value={progressBar} />
        <div className="flex justify-between text-sm text-foreground/80 ">
          <h3>{"Upload completed"}</h3>
          <p>{progressBar}%</p>
        </div>
      </div>
      <Button
        className="border border-accent p-2 hover:bg-accent/50 bg-accent/10 rounded-full flex items-center justify-center"
        onClick={() => onDelete(index)}>
        <Trash2 className=" text-accent  " />
      </Button>
    </div>
  );
};

export default FileCard;
