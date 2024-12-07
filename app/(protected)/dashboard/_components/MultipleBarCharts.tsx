"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Company, Pos } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CompanySelectors } from "./CompanySelector";

function groupDataByMonth(data: { createdAt: Date; count: number }[]) {
  return data.reduce(
    (acc, curr) => {
      const month = curr.createdAt.toLocaleString("default", { month: "long" });
      acc[month] = (acc[month] || 0) + curr.count;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export default function MultipleBarChart({
  companies,
  companyA,
  companyB,
  startDate,
  endDate,
  companyAId,
  companyBId,
}: {
  companies: Company[];
  companyA: { createdAt: Date; count: number }[];
  companyB: { createdAt: Date; count: number }[];
  companyAId: string;
  companyBId: string;
  startDate: Date;
  endDate: Date;
}) {
  const groupedA = groupDataByMonth(companyA);
  const groupedB = groupDataByMonth(companyB);
  const companyAName = companies.find(
    (company) => company.code === companyAId,
  )?.name;
  const companyBName = companies.find(
    (company) => company.code === companyBId,
  )?.name;
  // Generate array of all months between startDate and endDate
  const months: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push(currentDate.toLocaleString("default", { month: "long" }));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCompanyA = (id: string) => {
    const company = companies.find((company) => company.id === id);
    //add to existing search params
    const params = new URLSearchParams(searchParams);
    params.set("companyA", company?.code || "");
    router.push(`/dashboard/stats?${params.toString()}`);
  };
  const setCompanyB = (id: string) => {
    const company = companies.find((company) => company.id === id);
    router.push(`/dashboard/stats?companyB=${company?.code}`);
  };

  // Create chart data only for the months in range
  const chartData = months.map((month) => ({
    month,
    companyA: groupedA[month] || 0,
    companyB: groupedB[month] || 0,
  }));

  const chartConfig = {
    companyA: {
      label: companyAName,
      color: "hsl(var(--chart-1))",
    },
    companyB: {
      label: companyBName,
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies Comparison</CardTitle>
        <CardDescription>
          {startDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}{" "}
          -{" "}
          {endDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </CardDescription>
        <CompanySelectors
          companies={companies}
          onCompanyAChange={(company) => setCompanyA(company)}
          onCompanyBChange={(company) => setCompanyB(company)}
        />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="companyA" fill="var(--color-companyA)" radius={4} />
            <Bar dataKey="companyB" fill="var(--color-companyB)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        Cette carte compare le taux de disponibilité entre deux entreprises.
      </CardFooter>
    </Card>
  );
}
