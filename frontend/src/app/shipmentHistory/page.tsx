"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Shipment {
  _id: string;
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
    uph: number;
  };
}

interface DCBreakdown {
  [dc: string]: {
    units: number;
    hours: number;
  };
}

interface AggregatedShipment {
  date: string;
  dcs: string[];
  projected: {
    totalUnits: number;
    totalHours: number;
    uph: number;
    byDC: DCBreakdown;
  };
  actual?: {
    totalUnits: number;
    totalHours: number;
    uph: number;
    byDC: DCBreakdown;
  };
}

const ShipmentHistoryPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch("http://localhost:8080/shipments");
        if (!response.ok) throw new Error("Failed to fetch shipments");

        const data: Shipment[] = await response.json();
        setShipments(data);
      } catch (err) {
        console.error(err);
        setError("Could not load shipments.");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const groupAndAggregateByDate = (): AggregatedShipment[] => {
    const grouped: Record<string, AggregatedShipment> = {};

    for (const shipment of shipments) {
      const dateKey = new Date(shipment.date).toISOString().split("T")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          dcs: [],
          projected: {
            totalUnits: 0,
            totalHours: 0,
            uph: 0,
            byDC: {},
          },
        };
      }

      const group = grouped[dateKey];

      // Track unique DCs
      if (!group.dcs.includes(shipment.dc)) {
        group.dcs.push(shipment.dc);
      }

      // Projected totals
      group.projected.totalUnits += shipment.Projected.units;
      group.projected.totalHours += shipment.Projected.hours;

      // Projected breakdown by DC
      if (!group.projected.byDC[shipment.dc]) {
        group.projected.byDC[shipment.dc] = { units: 0, hours: 0 };
      }
      group.projected.byDC[shipment.dc].units += shipment.Projected.units;
      group.projected.byDC[shipment.dc].hours += shipment.Projected.hours;

      // Actual totals
      if (shipment.Actual) {
        if (!group.actual) {
          group.actual = {
            totalUnits: 0,
            totalHours: 0,
            uph: 0,
            byDC: {},
          };
        }

        group.actual.totalUnits += shipment.Actual.units;
        group.actual.totalHours += shipment.Actual.hours;

        // Actual breakdown by DC
        if (!group.actual.byDC[shipment.dc]) {
          group.actual.byDC[shipment.dc] = { units: 0, hours: 0 };
        }
        group.actual.byDC[shipment.dc].units += shipment.Actual.units;
        group.actual.byDC[shipment.dc].hours += shipment.Actual.hours;
      }
    }

    // Finalize UPH calculations
    return Object.values(grouped).map((entry) => {
      entry.projected.uph =
        entry.projected.totalHours > 0
          ? parseFloat(
              (entry.projected.totalUnits / entry.projected.totalHours).toFixed(
                1
              )
            )
          : 0;

      if (entry.actual) {
        entry.actual.uph =
          entry.actual.totalHours > 0
            ? parseFloat(
                (entry.actual.totalUnits / entry.actual.totalHours).toFixed(1)
              )
            : 0;
      }

      return entry;
    });
  };

  const aggregated = groupAndAggregateByDate();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="px-36 py-20">
      <h1 className="text-3xl font-semibold mb-6">Shipment History</h1>

      <div className="flex flex-col gap-3">
        {aggregated.map((entry) => (
          <Link key={entry.date} href={`./shipment/${entry.date}`}>
            <h2 className="text-xl font-thin mb-2">
              {new Date(entry.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
              <p>
                <strong>DC(s):</strong> {entry.dcs.join(", ")}
              </p>

              <div>
                <p className="font-semibold">Projected:</p>
                <p>
                  {entry.projected.totalUnits} units /{" "}
                  {entry.projected.totalHours} hrs → {entry.projected.uph} UPH
                </p>
                <ul className="ml-4 list-disc text-sm text-gray-700">
                  {Object.entries(entry.projected.byDC).map(([dc, values]) => (
                    <li key={dc}>
                      {dc}: {values.units} units / {values.hours} hrs
                    </li>
                  ))}
                </ul>
              </div>

              {entry.actual && (
                <div>
                  <p className="font-semibold">Actual:</p>
                  <p>
                    {entry.actual.totalUnits} units / {entry.actual.totalHours}{" "}
                    hrs → {entry.actual.uph} UPH
                  </p>
                  <ul className="ml-4 list-disc text-sm text-gray-700">
                    {Object.entries(entry.actual.byDC).map(([dc, values]) => (
                      <li key={dc}>
                        {dc}: {values.units} units / {values.hours} hrs
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShipmentHistoryPage;
