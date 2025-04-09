"use client";

import ShipmentCards from "@/components/ShipmentCards";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import ShipmentMetricCard from "@/components/InfoCard";

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

const Dashboard = () => {
  const [shipments, setShipments] = useState<ShipmentData[] | null>(null);

  const [error, setError] = useState<string>("");
  const [unitDiff, setUnitDiff] = useState(0);
  const [hourDiff, setHourDiff] = useState(0);
  const [uphDiff, setUphDiff] = useState(0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayDateString = new Date().toISOString().split("T")[0];

  const fetchShipment = async () => {
    console.log(todayDateString);
    try {
      const res = await fetch(
        `http://localhost:8080/shipments/${todayDateString}`
      );

      if (!res.ok) {
        const { message } = await res.json();
        setShipments(null);
        setError(message || "No shipment found for today.");
        return;
      }

      const data: ShipmentData[] = await res.json();
      setShipments(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch shipment");
      setShipments(null);
    }
  };

  useEffect(() => {
    if (!shipments || shipments.length === 0) return;

    // Totals
    const projUnits = shipments.reduce((sum, s) => sum + s.Projected.units, 0);
    const projHours = shipments.reduce((sum, s) => sum + s.Projected.hours, 0);
    const actUnits = shipments.reduce(
      (sum, s) => sum + (s.Actual?.units || 0),
      0
    );
    const actHours = shipments.reduce(
      (sum, s) => sum + (s.Actual?.hours || 0),
      0
    );

    // Percentage Diffs
    const unitChange =
      projUnits !== 0 ? ((actUnits - projUnits) / projUnits) * 100 : 0;

    const hourChange =
      projHours !== 0 ? ((actHours - projHours) / projHours) * 100 : 0;

    const uphProjected = projHours > 0 ? projUnits / projHours : 0;
    const uphActual = actHours > 0 ? actUnits / actHours : 0;

    const uphChange =
      uphProjected !== 0
        ? ((uphActual - uphProjected) / uphProjected) * 100
        : 0;

    setUnitDiff(parseFloat(unitChange.toFixed(1)));
    setHourDiff(parseFloat(hourChange.toFixed(1)));
    setUphDiff(parseFloat(uphChange.toFixed(1)));
  }, [shipments]);

  useEffect(() => {
    fetchShipment();
  }, []);

  return (
    <div className="px-36 py-20">
      <div className="mb-5">
        <h1 className="text-md font-semibold">Store: 1007</h1>
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold">Today's Shipment</h1>
        <Link
          href="/createShipment"
          className="bg-btn-avail px-3 py-2 rounded-xl text-white text-sm"
        >
          Add Shipment Information
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
            {error || "No shipment data for today yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
