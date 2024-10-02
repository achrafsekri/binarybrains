"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const ChartLegendContent = ({
  config,
}: {
  config: Record<string, { label: string; color: string }>;
}) => {
  return (
    <div className="flex gap-4 w-full justify-end">
      {Object.keys(config).map((key, index) => (
        <div key={index} className="flex items-center gap-1">
          <div
            className="size-4"
            style={{ backgroundColor: config[key].color }} // Set the color based on the item
          />
          <span className="text-sm text-muted-foreground">
            {config[key].label}
          </span>
        </div>
      ))}
    </div>
  );
};

const config = {
  Factures: {
    label: "Factures",
    color: "hsl(var(--chart-1))",
  },
  Devis: {
    label: "Devis",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
type PieChartDataType = {
  Factures: {
    name: string;
    value: number;
  }[];
  Devis: {
    name: string;
    value: number;
  }[];
};
export default function DocsPerClient({
  data,
  total,
}: {
  data: PieChartDataType;
  total: Record<string, number>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents par client</CardTitle>
        <p className="text-xs text-muted-foreground">
          Nombre de factures et devis par client
        </p>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer
          config={config}
          className=" aspect-square min-h-[200px] w-full max-w-[80%]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />

            <Pie
              data={data.Factures}
              dataKey="value"
              fill="hsl(var(--chart-2))"
              nameKey="name"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              name="Factures"
            />
            <Pie
              data={data.Devis}
              name="Devis"
              dataKey="value"
              fill="hsl(var(--chart-1))"
              nameKey="name"
              paddingAngle={2}
              innerRadius={100}
              outerRadius={140}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter><ChartLegendContent config={config} /></CardFooter>
    </Card>
  );
}
