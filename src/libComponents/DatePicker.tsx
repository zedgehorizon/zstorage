"use client";

import * as React from "react";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../utils/utils";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

interface DatePickerProps {
  setterFunction: (date: string) => void;
  previousDate?: string;
}

export function DatePicker(props: DatePickerProps) {
  const { setterFunction, previousDate } = props;
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    if (date) {
      setterFunction(format(date, "yyyy-MM-dd"));
    }
  }, [date]);

  React.useEffect(() => {
    if (previousDate) {
      setDate(new Date(previousDate));
    }
  }, [previousDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-between text-accent/50 hover:bg-background/1 hover:text-accent w-full fill-accent text-md   bg-background p-6 border border-accent/50 rounded ",
            !date && "text-accent"
          )}>
          {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
          <CalendarIcon className="ml-8 h-5 w-5 text-accent" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
