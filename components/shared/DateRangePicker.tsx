"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
//import fr from date-fns/locale
import { fr } from "date-fns/locale/fr";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateRangePicker({
  defaultValue,
  placeholder,
  className,
  onChange,
}: {
  className?: string;
  onChange?: (date: DateRange | undefined) => void;
  defaultValue?: DateRange | undefined;
  placeholder?: string;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    defaultValue || {
      from: addDays(new Date(), -30),
      to: new Date(),
    },
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start min-w-64 text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder || "Filtrer par date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              if (onChange) onChange(range);
            }}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
