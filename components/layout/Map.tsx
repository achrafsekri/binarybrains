"use client";

import { useEffect, useState } from "react";
import { Icon, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { Pos } from "@prisma/client";

import { Button } from "../ui/button";

export default function Map({ pos }: { pos: Pos[] }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const housingIcon = new Icon({
    iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });
  const getMyPosition = async () => {
    window.navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  };
  useEffect(() => {
    getMyPosition();
  }, []);
  return (
    position && (
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "630px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pos.map((p) => (
          <Marker
            icon={housingIcon}
            key={p.id}
            position={[Number(p.lat), Number(p.lng)]}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">{p.nom}</span>
                <span className="text-sm">{p.city}</span>
                <Button variant="outline" size="sm">
                  Voir le point de vente
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    )
  );
}
