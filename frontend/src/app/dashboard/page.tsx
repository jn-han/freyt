"use client";

import ShipmentInfoSection from "@/components/shipmentProps/ShipmentInfoSection";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { ShipmentData, DataPoint } from "@/types/shipment";
import InfoCardSkeleton from "@/components/shipmentProps/InfoCardSkeleton";

import Chart from "@/components/data/Chart";
import KPIChartCard from "@/components/data/KPIChartCard";

const mockSalesData = [
  { name: "2025-03-30", value: 14000 },
  { name: "2025-03-31", value: 19000 },
  { name: "2025-04-01", value: 20000 },
  { name: "2025-04-02", value: 21000 },
  { name: "2025-04-03", value: 12000 },
  { name: "2025-04-04", value: 18000 },
  { name: "2025-04-05", value: 15000 },
];

const Dashboard = () => {
  const [shipments, setShipments] = useState<ShipmentData[] | null>(null);
  const [allShipments, setAllShipments] = useState<ShipmentData[] | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string>("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() - 1);
  const todayDateString = new Date().toLocaleDateString("sv-SE");

  const fetchAllShipments = async () => {
    try {
      const res = await fetch("http://localhost:8080/shipments");
      if (!res.ok) throw new Error("Failed to fetch all shipments");
      const data: ShipmentData[] = await res.json();
      setAllShipments(data);
    } catch (err) {
      console.error("Error fetching all shipments:", err);
    }
  };

  const formatChartData = (shipments: ShipmentData[]): DataPoint[] => {
    // group by date, sum units & hours, average UPH
    const grouped: Record<string, { totalUnits: number; totalHours: number }> =
      {};

    for (const s of shipments) {
      const key = new Date(s.date).toISOString().split("T")[0];
      const units = s.Actual?.units ?? s.Projected.units;
      const hours = s.Actual?.hours ?? s.Projected.hours;

      if (!grouped[key]) {
        grouped[key] = { totalUnits: 0, totalHours: 0 };
      }

      grouped[key].totalUnits += units;
      grouped[key].totalHours += hours;
    }

    return Object.entries(grouped).map(
      ([date, { totalUnits, totalHours }]) => ({
        name: date,
        value: parseFloat((totalUnits / totalHours).toFixed(1)),
      })
    );
  };

  const chartData = formatChartData(allShipments ?? []).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const fetchShipment = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/shipments/${todayDateString}`
      );

      if (!res.ok) {
        const { message } = await res.json();
        setShipments(null);
        setError(message || "No shipment found for today.");
      } else {
        const data: ShipmentData[] = await res.json();
        setShipments(data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch shipment");
      setShipments(null);
    } finally {
      setLoading(false); // ✅ Done loading regardless of success or error
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

    const uphProjected = projHours > 0 ? projUnits / projHours : 0;
    const uphActual = actHours > 0 ? actUnits / actHours : 0;

    const uphChange =
      uphProjected !== 0
        ? ((uphActual - uphProjected) / uphProjected) * 100
        : 0;
  }, [shipments]);

  useEffect(() => {
    fetchShipment();
    fetchAllShipments();
  }, []);

  return (
    <div className="px-36 py-20 flex flex-col gap-3">
      <div className="">
        <h1 className="text-md font-semibold">Store: 1007</h1>
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold">Shipment</h1>
        <Link
          href="/createShipment"
          className="bg-btn-avail px-3 py-2 rounded-xl text-white text-sm"
        >
          Add Shipment Information
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {loading ? (
          <>
            <InfoCardSkeleton />
            <InfoCardSkeleton />
          </>
        ) : shipments ? (
          <>
            <div className="flex-1">
              <ShipmentInfoSection isProjected shipments={shipments} />
            </div>
            <div className="flex-1">
              <ShipmentInfoSection shipments={shipments} />
            </div>
          </>
        ) : (
          <div className="text-gray-600 italic mt-4">
            {error || "No shipment data for today yet."}
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold">Performance</h1>
      <div className="flex flex-row mt-4 gap-7">
        <KPIChartCard
          title="Sales KPIs"
          label="This Week"
          metricType="sales"
          goal={20000}
          changeClassName="text-positive"
          data={mockSalesData}
        />
        <KPIChartCard
          title="UPH Over Time"
          metricType="uph"
          goal={76}
          label="Most Recent"
          changeClassName="text-positive"
          data={chartData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
