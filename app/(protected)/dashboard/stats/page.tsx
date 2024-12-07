import { State } from "@prisma/client";

import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";
import HeatMap from "@/components/layout/HeatRegionmap";
import Map from "@/components/layout/Map";

import { AreaChartComponent } from "../_components/AreaChartComponent";
import { CourbePrix } from "../_components/CourbePrix";
import MultipleBarChart from "../_components/MultipleBarCharts";
import { PieChartComponent } from "../_components/PieChartComponent";
import { SideBarChart } from "../_components/SideBarChart";
import { SideBarChartPricing } from "../_components/SideBarChartPricing";
import { StateSelector } from "../_components/StateSelector";
import DateRange from "./DateRange";
import { DoubleLineCharts } from "./DoubleLineCharts";

export const metadata = constructMetadata({
  title: "Charts – SaaS Starter",
  description: "List of charts by shadcn-ui",
});

export default async function page({
  searchParams,
}: {
  searchParams: {
    startDate: string;
    endDate: string;
    state: string;
    tab: string;
    companyA: string;
    companyB: string;
  };
}) {
  const companies = await prisma.company.findMany();
  const { startDate, endDate, state, tab, companyA, companyB } = searchParams;
  const products = await prisma.product.findMany({
    where: {
      company: {
        code: "SK",
      },
    },
  });

  const totalProductsAvailability = await prisma.disponibility.groupBy({
    by: ["productId"],
    where: {
      createdAt: {
        gte: startDate
          ? new Date(startDate)
          : new Date(new Date().setDate(new Date().getDate() - 30)),
        lte: endDate ? new Date(endDate) : new Date(),
      },
      product: {
        company: {
          code: "SK",
        },
      },
      visit: {
        ...(state && {
          pos: {
            state: state as State,
          },
        }),
      },
    },
    _count: {
      productId: true,
    },
  });

  const totalPos = await prisma.pos.count({
    where: {
      state: state as State,
    },
  });

  const posCompanyA = await prisma.pos.groupBy({
    by: ["createdAt"],
    where: {
      visits: {
        some: {
          createdAt: {
            gte: startDate
              ? new Date(startDate)
              : new Date(new Date().setDate(new Date().getDate() - 30)),
            lte: endDate ? new Date(endDate) : new Date(),
          },
          ...(state && {
            pos: {
              state: state as State,
            },
          }),
          disponibilities: {
            some: {
              product: {
                company: {
                  code: companyA,
                },
              },
            },
          },
        },
      },
    },
    _count: {
      id: true,
    },
  });

  const posCompanyB = await prisma.pos.groupBy({
    by: ["createdAt"],
    where: {
      visits: {
        some: {
          createdAt: {
            gte: startDate
              ? new Date(startDate)
              : new Date(new Date().setDate(new Date().getDate() - 30)),
            lte: endDate ? new Date(endDate) : new Date(),
          },
          ...(state && {
            pos: {
              state: state as State,
            },
          }),
          disponibilities: {
            some: {
              product: {
                company: {
                  code: companyB,
                },
              },
            },
          },
        },
      },
    },
    _count: {
      id: true,
    },
  });

  const productsAvailability = totalProductsAvailability.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      count: item._count.productId,
      name: product?.name,
    };
  });

  const MidPriceByProduct = await prisma.disponibility.groupBy({
    by: ["productId"],
    where: {
      product: {
        company: {
          code: "SK",
        },
        ...(state && {
          visits: {
            some: {
              pos: {
                state: state as State,
              },
            },
          },
        }),
        createdAt: {
          gte: startDate
            ? new Date(startDate)
            : new Date(new Date().setDate(new Date().getDate() - 30)),
          lte: endDate ? new Date(endDate) : new Date(),
        },
      },
    },
    _avg: {
      price: true,
    },
  });

  const MidPriceByProductCompanyA = await prisma.disponibility.groupBy({
    by: ["productId"],
    where: {
      product: {
        company: {
          code: companyA,
        },
        ...(state && {
          visits: {
            some: {
              pos: {
                state: state as State,
              },
            },
          },
        }),
      },
      createdAt: {
        gte: startDate
          ? new Date(startDate)
          : new Date(new Date().setDate(new Date().getDate() - 30)),
        lte: endDate ? new Date(endDate) : new Date(),
      },
    },
    _avg: {
      price: true,
    },
  });

  const MidPriceByProductCompanyB = await prisma.disponibility.groupBy({
    by: ["productId"],
    where: {
      product: {
        company: {
          code: companyB,
        },
        ...(state && {
          visits: {
            some: {
              pos: {
                state: state as State,
              },
            },
          },
        }),
      },
      createdAt: {
        gte: startDate
          ? new Date(startDate)
          : new Date(new Date().setDate(new Date().getDate() - 30)),
        lte: endDate ? new Date(endDate) : new Date(),
      },
    },
    _avg: {
      price: true,
    },
  });

  const productsWithCompany = await prisma.product.findMany({
    include: {
      company: true,
    },
  });

  const nbVisits = await prisma.visit.count({
    ...(state && {
      where: {
        pos: {
          state: state as State,
        },
      },
    }),
  });

  return (
    <>
      <DashboardHeader heading="Charts" text="Global Statistiques" />
      <div className="flex flex-col gap-5 md:flex-row">
        <StateSelector />
        <DateRange
          startDate={startDate ? new Date(startDate) : new Date()}
          endDate={endDate ? new Date(endDate) : new Date()}
        />
      </div>
      <Tabs defaultValue={tab ?? "disponibility"} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="disponibility" className="text-xs md:text-base">
            Disponibilité
          </TabsTrigger>
          <TabsTrigger value="visits" className="text-xs md:text-base">
            Visites
          </TabsTrigger>
          <TabsTrigger value="presences" className="text-xs md:text-base">
            Présence
          </TabsTrigger>
          <TabsTrigger value="prices" className="text-xs md:text-base">
            Prix
          </TabsTrigger>
        </TabsList>
        <TabsContent value="disponibility" className="w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <SideBarChart
              totalPos={totalPos}
              startDate={startDate ? new Date(startDate) : new Date()}
              endDate={endDate ? new Date(endDate) : new Date()}
              productsAvailability={
                productsAvailability as { name: string; count: number }[]
              }
            />
            <MultipleBarChart
              companies={companies}
              companyA={posCompanyA.map((item) => {
                return {
                  createdAt: item.createdAt,
                  count: item._count.id,
                };
              })}
              companyB={posCompanyB.map((item) => {
                return {
                  createdAt: item.createdAt,
                  count: item._count.id,
                };
              })}
              companyAId={companyA}
              companyBId={companyB}
              startDate={startDate ? new Date(startDate) : new Date()}
              endDate={endDate ? new Date(endDate) : new Date()}
            />
          </div>
        </TabsContent>
        <TabsContent value="visits">
          <div>
            {/* <StateSelectors /> */}
            <PieChartComponent
              nbVisits={nbVisits}
              startDate={startDate ? new Date(startDate) : new Date()}
              endDate={endDate ? new Date(endDate) : new Date()}
            />
          </div>
        </TabsContent>
        <TabsContent value="presences">
          <HeatMap products={productsWithCompany} />
        </TabsContent>
        <TabsContent value="prices">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <SideBarChartPricing
              totalPos={totalPos}
              startDate={startDate ? new Date(startDate) : new Date()}
              endDate={endDate ? new Date(endDate) : new Date()}
              // @ts-ignore
              pricing={MidPriceByProduct.map((item) => {
                return {
                  name: products.find((p) => p.id === item.productId)?.name,
                  avg: item._avg.price?.toFixed(2),
                };
              })}
            />
            <DoubleLineCharts
              companies={companies}
              products={products}
              // @ts-ignore
              companyA={MidPriceByProductCompanyA.map((item) => {
                return {
                  productName: products.find((p) => p.id === item.productId)
                    ?.name,
                  avg: item._avg.price?.toFixed(2),
                };
              })}
              // @ts-ignore
              companyB={MidPriceByProductCompanyB.map((item) => {
                return {
                  productName: products.find((p) => p.id === item.productId)
                    ?.name,
                  avg: item._avg.price?.toFixed(2),
                };
              })}
              companyAId={companyA}
              companyBId={companyB}
              startDate={startDate ? new Date(startDate) : new Date()}
              endDate={endDate ? new Date(endDate) : new Date()}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
