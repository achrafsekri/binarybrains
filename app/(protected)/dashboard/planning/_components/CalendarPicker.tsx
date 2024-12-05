"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";

const CalendarPicker = ({ date }: { date: string }) => {
  const router = useRouter();
  return (
    <Calendar
      mode="single"
      className="w-full rounded-md border"
      onSelect={(date) => router.push(`/dashboard/planning?date=${date}`)}
      selected={date ? new Date(date) : undefined}
    />
  );
};

export default CalendarPicker;
