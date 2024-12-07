"use client";

import * as React from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Sotacib Kairouan",
  },
  chrome: {
    label: "Les Ciments De Bizerte",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Ciment Artificiel Tunisien",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Carthage Ciment",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Ciment Djebel Wost",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Societe de Ciment Nfidha",
    color: "hsl(var(--chart-5))",
  },
  otherr: {
    label: "Societe de Ciment Gabes",
    color: "hsl(var(--chart-5))",
  },
  otherrr: {
    label: "Les Ciments d'oum elklil",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PieChartComponent({
  nbVisits,
  startDate,
  endDate,
}: {
  nbVisits: number;
  startDate: Date;
  endDate: Date;
}) {
  const totalVisitors = React.useMemo(() => {
    return nbVisits;
  }, [nbVisits]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Nombre de visites</CardTitle>
        <CardDescription>
          {format(startDate, "MMMM yyyy")} - {format(endDate, "MMMM yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Nombre de visites entre {format(startDate, "dd/MM/yyyy")} et{" "}
          {format(endDate, "dd/MM/yyyy")}
        </div>
      </CardFooter>
    </Card>
  );
}
