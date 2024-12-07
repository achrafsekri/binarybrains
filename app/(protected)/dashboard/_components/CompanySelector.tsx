"use client";

import * as React from "react";
import { Company } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectorProps = {
  companies: { value: string; label: string }[];
  placeholder: string;
};

function CompanySelector({
  companies,
  onCompanyChange,
}: SelectorProps & { onCompanyChange: (code: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleCompanyChange = (code: string) => {
    setValue(code);
    onCompanyChange(code);
    setOpen(false);
  };

  return (
    <Select
      value={value}
      onValueChange={handleCompanyChange}
      defaultValue={companies[0].value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selectioner une entreprise" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.value} value={company.value}>
            {company.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CompanySelectors({
  companies,
  onCompanyAChange,
  onCompanyBChange,
}: {
  companies: Company[];
  onCompanyAChange: (code: string) => void;
  onCompanyBChange: (code: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <CompanySelector
        companies={companies.map((company) => ({
          value: company.id,
          label: company.name,
        }))}
        placeholder="Select company 1"
        onCompanyChange={onCompanyAChange}
      />
      <CompanySelector
        companies={companies.map((company) => ({
          value: company.id,
          label: company.name,
        }))}
        placeholder="Select company 2"
        onCompanyChange={onCompanyBChange}
      />
    </div>
  );
}
