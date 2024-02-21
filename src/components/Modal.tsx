import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@libComponents/Dialog";
import { cn } from "@utils/functions";
import { DialogClose } from "@radix-ui/react-dialog";

type ModalProps = {
  openTrigger: React.ReactNode;
  modalClassName?: string;
  titleClassName?: string;
  title?: string;
  descriptionClassName?: string;
  description?: string;
  closeOnOverlayClick?: boolean; //when false it prevents the closing of the modal when clicking outside the modal
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
};

//NOTE : To activate the Dialog component from within a Context Menu or Dropdown Menu, you must encase the Context Menu or Dropdown Menu component in the Dialog component.
export const Modal: React.FC<ModalProps> = (props) => {
  const { openTrigger, footerContent, modalClassName, titleClassName, title, descriptionClassName, description, closeOnOverlayClick, children } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>{openTrigger}</DialogTrigger>
      <DialogContent
        className={cn("max-w-[80%] min-h-[40%] max-h-[90%] !pt-0 rounded-xl ", modalClassName)}
        onPointerDownOutside={(e: any) => !closeOnOverlayClick && e.preventDefault()}>
        <DialogHeader className="text-left sticky flex md:flex-row flex-col justify-between md:items-center items-start md:p-0 p-3 backdrop-blur w-full z-10">
          <div className="flex flex-col w-auto text-left">
            {title ? <DialogTitle className={titleClassName}>{title}</DialogTitle> : <></>}
            {description ? <DialogDescription className={descriptionClassName}>{description}</DialogDescription> : <></>}
          </div>
        </DialogHeader>
        <div className="overflow-x-hidden overflow-y-auto scrollbar">{children}</div>
        <DialogFooter className="!justify-center !items-center m-0 p-4">
          <DialogClose>
            {footerContent ? footerContent : <p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>}{" "}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
