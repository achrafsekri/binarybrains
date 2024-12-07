"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const companies1 = [
  { value: "apple", label: "Apple" },
  { value: "microsoft", label: "Microsoft" },
  { value: "google", label: "Google" },
  { value: "amazon", label: "Amazon" },
  { value: "facebook", label: "Facebook" },
]

const companies2 = [
  { value: "tesla", label: "Tesla" },
  { value: "nvidia", label: "NVIDIA" },
  { value: "netflix", label: "Netflix" },
  { value: "adobe", label: "Adobe" },
  { value: "salesforce", label: "Salesforce" },
]

type SelectorProps = {
  companies: { value: string; label: string }[]
  placeholder: string
}

function CompanySelector({ companies, placeholder }: SelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? companies.find((company) => company.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>No company found.</CommandEmpty>
          <CommandGroup>
            {companies.map((company) => (
              <CommandItem
                key={company.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === company.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {company.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CompanySelectors() {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <CompanySelector companies={companies1} placeholder="Select company 1" />
      <CompanySelector companies={companies2} placeholder="Select company 2" />
    </div>
  )
}

