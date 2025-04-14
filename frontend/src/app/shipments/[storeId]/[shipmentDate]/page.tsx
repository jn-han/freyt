"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShipmentInfoSection from "@/components/shipmentProps/ShipmentInfoSection";
import Link from "next/link";
import InfoCardSkeleton from "@/components/shipmentProps/InfoCardSkeleton";

export interface ShipmentData {
  _id?: string;
  date: string;
  store: string;
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
  const params = useParams();
  const storeId = params?.storeId as string;
  const shipmentDate = params?.shipmentDate as string;

  const [shipments, setShipments] = useState<ShipmentData[] | null>(null);
  const [error, setError] = useState("");

  const fetchShipment = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // fake load

      const res = await fetch(
        `http://localhost:8080/stores/${storeId}/shipments/${shipmentDate}`
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
      console.error("Fetch error:", err);
      setError("Failed to fetch shipment");
      setShipments(null);
    }
  };

  useEffect(() => {
    if (storeId && shipmentDate) {
      fetchShipment();
    }
  }, [storeId, shipmentDate]);

  const todayString = new Date().toLocaleDateString("sv-SE");

  return (
    <div className="px-36 py-20">
      <div className="mb-5">
        <h1 className="text-md font-semibold">Store: {storeId}</h1>
        <h1 className="text-4xl font-bold">
          {shipmentDate === todayString
            ? "Today's Shipment"
            : `Shipment for ${shipmentDate}`}
        </h1>
      </div>

      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold">Details</h1>
        <Link
          href={`/createShipment?store=${storeId}`}
          className="bg-btn-avail px-3 py-2 rounded-xl text-white text-sm"
        >
          Add Shipment
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {shipments ? (
          <>
            <div className="flex-1">
              <ShipmentInfoSection isProjected shipments={shipments} />
            </div>
            <div className="flex-1">
              <ShipmentInfoSection shipments={shipments} />
            </div>
          </>
        ) : error ? (
          <div className="text-gray-600 italic mt-4">{error}</div>
        ) : (
          <>
            <InfoCardSkeleton />
            <InfoCardSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default ShipmentPage;
