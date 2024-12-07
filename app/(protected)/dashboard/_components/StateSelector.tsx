"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { State } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectorProps = {
  States: string[];
};

export function StateSelector() {
  const states = Object.values(State);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onStateChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("state", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select onValueChange={onStateChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a state" />
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state} value={state}>
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
