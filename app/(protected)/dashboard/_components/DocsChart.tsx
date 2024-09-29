"use client";

import { Bar, BarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";





const chartConfig = {
  Factures: {
    label: "Factures",
    color: "#7f5af0", // Indigo-purple
  },
  Devis: {
    label: "Devis",
    color: "#b59dfb", // Lighter shade of indigo-purple
  },
} satisfies ChartConfig;

type chartData = {
  month: string;
  Factures: number;
  Devis: number;
}[]
export default   function DocsChart({data} :{data:chartData} ) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <p className="text-xs text-muted-foreground">
          Nombre de factures et devis par mois
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar dataKey="Factures" fill="var(--color-Factures)" radius={4} />
            <Bar dataKey="Devis" fill="var(--color-Devis)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
