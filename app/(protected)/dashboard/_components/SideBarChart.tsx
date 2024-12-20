"use client";

import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
  { month: "CEM | 42,5", desktop: 186, mobile: 80 },
  { month: "CEM || 32,5", desktop: 305, mobile: 200 },
  { month: "CEM | 42,5 SL-3", desktop: 237, mobile: 120 },
  { month: "CHAUX", desktop: 73, mobile: 190 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function SideBarChart({
  totalPos,
  startDate,
  endDate,
  productsAvailability,
}: {
  totalPos: number;
  startDate: Date;
  endDate: Date;
  productsAvailability: {
    name: string;
    count: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taux de disponibilté de Chaque Produit</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          {format(startDate, "MMM yyyy")} - {format(endDate, "MMM yyyy")}
          <span className="font-bold text-muted-foreground">
            ( {totalPos} Points de Vente )
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={productsAvailability}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={8}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          *Cette statistique montre le taux de disponibilité de chaque produit
          par rapport au nombre de points de vente entre les dates
          sélectionnées.
        </div>
      </CardFooter>
    </Card>
  );
}
