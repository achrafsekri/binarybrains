"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Company, Product, State } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DoubleLineCharts({
  companies,
  companyA,
  companyB,
  startDate,
  endDate,
  companyAId,
  companyBId,
  products,
}: {
  companies: Company[];
  companyA: { productName: string; avg: string }[];
  companyB: { productName: string; avg: string }[];
  companyAId: string;
  companyBId: string;
  startDate: Date;
  endDate: Date;
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(searchParams.get("product") ?? "");
  const [companyAStats, setCompanyAStats] = useState<
    {
      productName: string;
      avg: string;
    }[]
  >([]);
  const [companyBStats, setCompanyBStats] = useState<
    {
      productName: string;
      avg: string;
    }[]
  >([]);
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

  const setCompanyB = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("companyB", id);
    router.push(`/dashboard/stats?${params.toString()}`);
  };

  // Update chart config to use company names
  const chartConfig = {
    companyA: {
      label: companyAName || "Company A",
      color: "hsl(var(--chart-1))",
    },
    companyB: {
      label: companyBName || "Company B",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const companyAStats = companyA.filter(
      (item) => item.productName === product,
    );
    const companyBStats = companyB.filter(
      (item) => item.productName === product,
    );
    setCompanyAStats(companyAStats);
    setCompanyBStats(companyBStats);
  }, [product, companyA, companyB]);

  const getStats = (stats: { productName: string; avg: string }[]) => {
    return months.map((month) => ({
      month,
      avg: parseFloat(stats.find((a) => a.productName === month)?.avg || "0"),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison des prix</CardTitle>
        <CardDescription className="mt-2 flex flex-col gap-4">
          <span className="text-sm text-muted-foreground">
            Comparez les prix entre deux entreprises
          </span>
          <div className="flex gap-4">
            <Select
              value={companyBId}
              onValueChange={(value) => setCompanyB(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company B" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.code}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={product}
              onValueChange={(value) => setProduct(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={months.map((month) => ({
              month,
              companyA: parseFloat(
                companyAStats.find((a) => a.productName === month)?.avg || "0",
              ),
              companyB: parseFloat(
                companyBStats.find((b) => b.productName === month)?.avg || "0",
              ),
            }))}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="companyA"
              type="monotone"
              stroke={chartConfig.companyA.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="companyB"
              type="monotone"
              stroke={chartConfig.companyB.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Comparing{" "}
              {products.find((p) => p.id === product)?.name ||
                "No product selected"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
