"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Icon, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import {
  Company,
  Disponibility,
  Pos,
  Product,
  State,
  Visit,
} from "@prisma/client";
import { format, isAfter, isBefore } from "date-fns";
import {
  CalendarClock,
  Eye,
  LocateFixed,
  MapPin,
  Phone,
  PlusCircleIcon,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { FaDirections } from "react-icons/fa";

import { getStateCoordinates } from "@/lib/getStateCords";
import StatesFilter from "@/app/(protected)/dashboard/points-de-vente/_components/StatesFilter";
import { getPos } from "@/app/(protected)/dashboard/points-de-vente/get-pos.server";

import { ProductSelector } from "../dashboard/ProductSelector";
import DateRangePicker from "../shared/DateRangePicker";
import { Button } from "../ui/button";

const visitedIcon = new Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=87988&format=png&color=008000",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const unvisitedIcon = new Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=87988&format=png&color=FF0000",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export type ProductWithCompany = Product & {
  company: Company;
};

type PosWithVisits = Pos & {
  visits: (Visit & { disponibilities: Disponibility[] })[];
};

// Dynamically import the heatmap layer with no SSR
const HeatmapLayer = dynamic(
  () =>
    import("react-leaflet-heatmap-layer-v3").then((mod) => mod.HeatmapLayer),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function Map({ products }: { products: ProductWithCompany[] }) {
  const [state, setState] = useState<State | null | "all">(null);
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    //last 30 days
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [pos, setPos] = useState<PosWithVisits[]>([]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    const fetchPos = async () => {
      const pos = await getPos(
        state as State,
        selectedProduct as string,
        dateRange,
      );
      setPos(pos);
      state &&
        state !== "all" &&
        setPosition(getStateCoordinates(state?.toUpperCase() || ""));
    };
    fetchPos();
  }, [state, selectedProduct, dateRange]);

  const getMyPosition = async () => {
    window.navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  };
  useEffect(() => {
    if (!state) getMyPosition();
  }, []);

  function MapEvents() {
    const map = useMap();

    useEffect(() => {
      map.on("zoomend", () => {
        setZoom(map.getZoom());
      });
    }, [map]);

    return null;
  }

  const heatmapData = pos.map((p) => ({
    lat: Number(p.lat),
    lng: Number(p.lng),
    intensity: 1,
  }));

  return (
    <>
      <DateRangePicker
        defaultValue={dateRange}
        onChange={(date) => setDateRange(date as DateRange)}
        className="mb-4"
      />
      <div className="flex justify-between gap-2">
        <StatesFilter selectedState={state} setSelectedState={setState} />
        <ProductSelector
          products={products.map((p) => ({
            value: p.id,
            label: p.name,
            companyCode: p.company.code,
            companyName: p.company.name,
          }))}
          value={selectedProduct || ""}
          onChange={setSelectedProduct}
        />
      </div>
      {position && (
        <div className="relative">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "550px", width: "100%", zIndex: 10 }}
          >
            <ChangeView center={position} />
            <MapEvents />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {zoom < 10 && (
              <HeatmapLayer
                points={heatmapData}
                longitudeExtractor={(m) => m.lng}
                latitudeExtractor={(m) => m.lat}
                intensityExtractor={(m) => m.intensity}
                radius={20}
                max={1}
                minOpacity={0.4}
              />
            )}

            {zoom >= 10 &&
              pos.map((p) => {
                const visited = p.visits.some(
                  (v) =>
                    isBefore(v.createdAt, dateRange?.to) &&
                    isAfter(v.createdAt, dateRange?.from),
                );
                const lastVisit = p.visits?.sort(
                  (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
                )[0];

                return (
                  <Marker
                    icon={visited ? visitedIcon : unvisitedIcon}
                    key={p.id}
                    position={[Number(p.lat), Number(p.lng)]}
                  >
                    <Popup>
                      <div className="flex flex-col gap-2 space-y-2">
                        <span className="text-lg flex items-center gap-2 font-bold">
                          {p.nom}
                          <Link
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                          >
                            <FaDirections size={16} />
                          </Link>
                        </span>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span className="text-sm">{p.city}</span>
                        </div>
                        {p.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <a href={`tel:${p.phone}`} className="text-sm">
                              +216 {p.phone}
                            </a>
                          </div>
                        )}
                        {lastVisit && (
                          <div className="flex items-center gap-2">
                            <CalendarClock size={16} />
                            <Link
                              href={`/dashboard/visits/${lastVisit.id}`}
                              className="text-sm"
                            >
                              {format(lastVisit.createdAt, "dd/MM/yyyy, HH:mm")}
                            </Link>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Link
                              className="flex items-center"
                              href={`/dashboard/visits/create?pos=${p.id}`}
                            >
                              <PlusCircleIcon size={16} />
                              <span className="ml-2">Ajouter une visite</span>
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Link href={`/dashboard/points-de-vente/${p.id}`}>
                              <Eye size={16} />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
          <Button
            className="absolute bottom-4 right-4 z-[1000]"
            onClick={getMyPosition}
          >
            <LocateFixed className="mr-2" size={18} />
            Ma position
          </Button>
        </div>
      )}
    </>
  );
}
