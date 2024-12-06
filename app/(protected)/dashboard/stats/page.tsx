import { constructMetadata } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { BarChartMixed } from "@/components/charts/bar-chart-mixed";
import { InteractiveBarChart } from "@/components/charts/interactive-bar-chart";
import { LineChartMultiple } from "@/components/charts/line-chart-multiple";
import { RadarChartSimple } from "@/components/charts/radar-chart-simple";
import { RadialChartGrid } from "@/components/charts/radial-chart-grid";
import { RadialShapeChart } from "@/components/charts/radial-shape-chart";
import { RadialStackedChart } from "@/components/charts/radial-stacked-chart";
import { RadialTextChart } from "@/components/charts/radial-text-chart";
import { DashboardHeader } from "@/components/dashboard/header";
// import { MonthlySalesChart } from "../_components/monthly-sales-chart";
import MultipleBarChart from "../_components/MultipleBarCharts";
import { SideBarChart } from "../_components/SideBarChart";
import { PieChartComponent } from "../_components/PieChartComponent";

export const metadata = constructMetadata({
  title: "Charts – SaaS Starter",
  description: "List of charts by shadcn-ui",
});

export default function ChartsPage() {
  return (
    <>
      <DashboardHeader heading="Charts" text="List of charts by shadcn-ui." />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {/* <RadialTextChart />
          <AreaChartStacked /> */}
          <SideBarChart/>
          <MultipleBarChart/>
          <PieChartComponent/>
          
        {/* <main className="p-24">
              <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
              
            </main> */}


          {/* <BarChartMixed />
          <RadarChartSimple /> */}
        </div>

        {/* <InteractiveBarChart /> */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {/* <RadialChartGrid />
          <RadialShapeChart />
          <LineChartMultiple />
          <RadialStackedChart /> */}
        </div>
      </div>
    </>
  );
}
