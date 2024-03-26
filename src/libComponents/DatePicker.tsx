"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@utils/functions";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "./Popover";

interface DatePickerProps {
  setterFunction: (date: string) => void;
  previousDate: string | undefined;
}

export function DatePicker(props: DatePickerProps) {
  const { setterFunction, previousDate } = props;
  const [date, setDate] = React.useState<Date | undefined>();

  function handleDateChange(date: Date | undefined) {
    if (date) {
      setDate(date);
      setterFunction(format(date, "yyyy-MM-dd"));
    }
  }

  useEffect(() => {
    if (previousDate) {
      setDate(new Date(previousDate));
    } else {
      handleDateChange(new Date());
    }
  }, [previousDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-between text-accent/50 hover:bg-background/1 hover:text-accent w-full fill-accent text-md   bg-background p-6 px-4 border border-accent/50 rounded ",
            !date && "text-accent"
          )}>
          {date ? format(date, "dd/MM/yyyy") : <span> Pick a date</span>}
          <CalendarIcon className="ml-8 h-5 w-5 text-accent" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <PopoverClose>
          <Calendar mode="single" selected={date} onSelect={(date: Date | undefined) => handleDateChange(date)} initialFocus />
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
