"use client";

import { useEffect, useState } from "react";
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
import { isAfter, isBefore } from "date-fns";
import { LocateFixed } from "lucide-react";
import { DateRange } from "react-day-picker";

import { getStateCoordinates } from "@/lib/getStateCords";
import StatesFilter from "@/app/(protected)/dashboard/points-de-vente/_components/StatesFilter";
import { getPos } from "@/app/(protected)/dashboard/points-de-vente/get-pos.server";

import { ProductSelector } from "../dashboard/ProductSelector";
import DateRangePicker from "../shared/DateRangePicker";
import { Button } from "../ui/button";

const visitedIcon = new Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=87988&format=png&color=008000",
  iconSize: [32, 32], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const unvisitedIcon = new Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=87988&format=png&color=FF0000",
  iconSize: [32, 32], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
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
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pos.map((p) => {
              const visited = p.visits.some(
                (v) =>
                  isBefore(v.createdAt, dateRange?.to) &&
                  isAfter(v.createdAt, dateRange?.from),
              );

              return (
                <Marker
                  icon={visited ? visitedIcon : unvisitedIcon}
                  key={p.id}
                  position={[Number(p.lat), Number(p.lng)]}
                >
                  <Popup>
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-bold">{p.nom}</span>
                      <span className="text-sm">{p.city}</span>
                      {p.phone && (
                        <a href={`tel:${p.phone}`} className="text-sm">
                          +216 {p.phone}
                        </a>
                      )}
                      <Button variant="outline" size="sm">
                        <Link href={`/dashboard/points-de-vente/${p.id}`}>
                          Voir le point de vente
                        </Link>
                      </Button>
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
