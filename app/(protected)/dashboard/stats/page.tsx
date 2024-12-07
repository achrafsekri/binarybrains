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
import MultipleBarChart from "../_components/MultipleBarCharts";
import { SideBarChart } from "../_components/SideBarChart";
import { PieChartComponent } from "../_components/PieChartComponent";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CourbePrix } from "../_components/CourbePrix";
import { Select } from "@radix-ui/react-select";
import { StateSelectors } from "../_components/StateSelector";
import { AreaChartComponent } from "../_components/AreaChartComponent";

export const metadata = constructMetadata({
  title: "Charts – SaaS Starter",
  description: "List of charts by shadcn-ui",
});

export default async function ChartsPage() {
  const companies = await prisma.company.findMany();  
  return (

    <>
      <DashboardHeader heading="Charts" text="Global Statistiques"/>
      <div className="flex flex-col gap-5">
      <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="Disponibilité">Disponibilité</TabsTrigger>
        <TabsTrigger value="Visites">Visites</TabsTrigger>
        <TabsTrigger value="Presences">Présence</TabsTrigger>
        <TabsTrigger value="Prix">Prix</TabsTrigger>
      </TabsList>
      <TabsContent value="Disponibilité" className="w-full">
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <SideBarChart/>
              <MultipleBarChart companies={companies}/>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Visites">
        <div>
          {/* <StateSelectors /> */}
          <PieChartComponent/>
        </div>
        
      </TabsContent>
      <TabsContent value="Presences">

      </TabsContent>
      <TabsContent value="Prix">
        <CourbePrix/>
        <AreaChartComponent/>
      </TabsContent>
    </Tabs>
        

        
      </div>
    </>
  );
}
