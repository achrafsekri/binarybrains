"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { State } from "@prisma/client";

import DateRangePicker from "@/components/shared/DateRangePicker";

const DateRange = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const states = Object.values(State);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onStateChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("state", value);
    router.push(`?${params.toString()}`);
  };
  return (
    <DateRangePicker
      onChange={(dates) => {
        const params = new URLSearchParams(searchParams);
        params.set("startDate", dates?.from?.toISOString() ?? "");
        params.set("endDate", dates?.to?.toISOString() ?? "");
        router.push(`?${params.toString()}`);
      }}
      defaultValue={{ from: startDate, to: endDate }}
    />
  );
};

export default DateRange;
