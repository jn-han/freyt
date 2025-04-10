"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShipmentCards from "@/components/ShipmentCards";
import Link from "next/link";

export interface ShipmentData {
  _id?: string;
  date: string;
  storeNumber: string;
  dc: "DC01" | "DC03";
  Projected: {
    units: number;
    hours: number;
    uph: number;
  };
  Actual?: {
    units: number;
    hours: number;
    uph: number | null;
  };
}

const ShipmentPage = () => {
  const shipmentDate = useParams()?.shipmentDate as string;
  const [shipments, setShipments] = useState<ShipmentData[] | null>(null);
  const [error, setError] = useState("");

  const fetchShipment = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/shipments/${shipmentDate}`
      );
      if (!res.ok) {
        const { message } = await res.json();
        setShipments(null);
        setError(message || "No shipment found for that date.");
        return;
      }
      const data: ShipmentData[] = await res.json();
      setShipments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch shipment");
      setShipments(null);
    }
  };

  useEffect(() => {
    if (shipmentDate) fetchShipment();
  }, [shipmentDate]);

  return (
    <div className="px-36 py-20">
      <div className="mb-5">
        <h1 className="text-md font-semibold">Store: 1007</h1>
        <h1 className="text-4xl font-bold">
          {shipmentDate === new Date().toLocaleDateString("sv-SE")
            ? "Today's Shipment"
            : `Shipment for ${shipmentDate}`}
        </h1>
      </div>

      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold">Details</h1>
        <Link
          href="/createShipment"
          className="bg-btn-avail px-3 py-2 rounded-xl text-white text-sm"
        >
          Add Shipment
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {shipments ? (
          <>
            <div className="flex-1">
              <ShipmentCards isProjected shipments={shipments} />
            </div>
            <div className="flex-1">
              <ShipmentCards shipments={shipments} />
            </div>
          </>
        ) : (
          <div className="text-gray-600 italic mt-4">
            {error || "Loading shipment data..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentPage;
