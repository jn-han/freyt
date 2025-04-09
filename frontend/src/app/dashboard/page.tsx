"use client";

import ShipmentInfo from "@/components/ShipmentInfo";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";

type ShipmentData = {
  date: string;
  storeNumber: string;
  Projected: {
    units: number;
    hours: number;
    uph: number;
  };
  Actual: {
    units: number;
    hours: number;
    uph: number;
  };
};

const Dashboard = () => {
  const [dc01Shipment, setdc01Shipment] = useState<ShipmentData | null>(null);
  const [dc03Shipment, setdc03Shipment] = useState<ShipmentData | null>(null);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
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
        setShipment(null);
        setError(message || "No shipment found for today.");
        return;
      }

      const data: ShipmentData = await res.json();
      setShipment(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch shipment");
      setShipment(null);
    }
  };

  useEffect(() => {
    if (!shipment?.Actual || !shipment?.Projected) return;

    const { Actual, Projected } = shipment;

    const unitChange =
      Projected.units !== 0
        ? ((Actual.units - Projected.units) / Projected.units) * 100
        : 0;

    const hourChange =
      Projected.hours !== 0
        ? ((Actual.hours - Projected.hours) / Projected.hours) * 100
        : 0;

    const uphChange =
      Projected.uph !== 0
        ? ((Actual.uph - Projected.uph) / Projected.uph) * 100
        : 0;

    setUnitDiff(parseFloat(unitChange.toFixed(1)));
    setHourDiff(parseFloat(hourChange.toFixed(1)));
    setUphDiff(parseFloat(uphChange.toFixed(1)));
  }, [shipment]);

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
        {shipment ? (
          <>
            <div className="flex-1">
              <ShipmentInfo
                isProjected
                units={shipment.Projected.units}
                hours={shipment.Projected.hours}
                uph={shipment.Projected.uph}
              />
            </div>
            <div className="flex-1">
              <ShipmentInfo
                units={shipment.Actual?.units ?? null}
                hours={shipment.Actual?.hours ?? null}
                uph={shipment.Actual?.uph ?? null}
                unitDiff={shipment.Actual ? unitDiff : null}
                hourDiff={shipment.Actual ? hourDiff : null}
                uphDiff={shipment.Actual ? uphDiff : null}
              />
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
