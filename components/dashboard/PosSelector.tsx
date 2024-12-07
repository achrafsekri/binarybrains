"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PosSelector({
  pos,
  value,
  onChange,
  disabled,
}: {
  pos: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? pos.find((p) => p.value === value)?.label
            : "Sélectionner un point de vente..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un point de vente..." />
          <CommandList>
            <CommandEmpty>Aucun point de vente trouvé.</CommandEmpty>
            <CommandGroup>
              {pos.map((p) => (
                <CommandItem
                  key={p.value}
                  value={p.value}
                  className="text-gray-900"
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="text-gray-900">{p.label}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === p.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
