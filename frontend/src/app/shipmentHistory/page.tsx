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
  [dc: string]: number;
}

interface AggregatedShipment {
  date: string;
  ids: string[];
  projected: {
    units: number;
    hours: number;
    avgUph: number;
    breakdown: DCBreakdown;
  };
  actual?: {
    units: number;
    hours: number;
    avgUph: number;
    breakdown: DCBreakdown;
  };
}

const ShipmentHistory = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const response = await fetch("http://localhost:8080/shipments");
      const data = await response.json();
      setShipments(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteByDate = async (isoDate: string) => {
    // Normalize to YYYY-MM-DD
    const date = new Date(isoDate).toISOString().split("T")[0];

    const confirmed = window.confirm(`Delete shipments for ${date}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/shipments/${date}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setShipments((prev) =>
        prev.filter((s) => !new Date(s.date).toISOString().startsWith(date))
      );
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
  useEffect(() => {
    fetchShipments();
  }, []);

  const aggregate = (): AggregatedShipment[] => {
    const map: Record<string, AggregatedShipment> = {};

    for (const s of shipments) {
      const dateKey = new Date(s.date).toISOString().split("T")[0];
      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          ids: [],
          projected: { units: 0, hours: 0, avgUph: 0, breakdown: {} },
        };
      }
      const entry = map[dateKey];
      entry.ids.push(s._id);

      entry.projected.units += s.Projected.units;
      entry.projected.hours += s.Projected.hours;
      entry.projected.avgUph += s.Projected.uph;
      entry.projected.breakdown[s.dc] =
        (entry.projected.breakdown[s.dc] || 0) + s.Projected.units;

      if (s.Actual) {
        if (!entry.actual) {
          entry.actual = {
            units: 0,
            hours: 0,
            avgUph: 0,
            breakdown: {},
          };
        }
        entry.actual.units += s.Actual.units;
        entry.actual.hours += s.Actual.hours;
        entry.actual.avgUph += s.Actual.uph;
        entry.actual.breakdown[s.dc] =
          (entry.actual.breakdown[s.dc] || 0) + s.Actual.units;
      }
    }

    return Object.values(map).map((entry) => {
      const count = entry.ids.length;
      entry.projected.avgUph = parseFloat(
        (entry.projected.avgUph / count).toFixed(1)
      );
      if (entry.actual) {
        entry.actual.avgUph = parseFloat(
          (entry.actual.avgUph / count).toFixed(1)
        );
      }
      return entry;
    });
  };

  const aggregated = aggregate();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="px-36 py-20">
      <h1 className="text-3xl font-semibold mb-6">Shipment History</h1>
      <div className="flex flex-col gap-4">
        {aggregated.map((entry) => (
          <div
            key={entry.date}
            className="relative bg-white border rounded p-6 shadow"
          >
            <button
              onClick={() => deleteByDate(entry.date)}
              className="absolute top-2 right-3 text-red-600 hover:text-red-800 font-bold"
            >
              X
            </button>
            <Link href={`./shipment/${entry.date}`}>
              <h2 className="text-xl font-semibold mb-2 hover:underline">
                {entry.date.slice(0, 10)}
              </h2>
            </Link>
            <div className="space-y-1">
              <p>
                <strong>Projected:</strong> {entry.projected.units} units /{" "}
                {entry.projected.hours} hrs → {entry.projected.avgUph} UPH
              </p>
              <ul className="ml-4 list-disc text-sm text-gray-700">
                {Object.entries(entry.projected.breakdown).map(
                  ([dc, units]) => (
                    <li key={dc}>
                      {dc}: {units} units
                    </li>
                  )
                )}
              </ul>
              {entry.actual && (
                <>
                  <p>
                    <strong>Actual:</strong> {entry.actual.units} units /{" "}
                    {entry.actual.hours} hrs → {entry.actual.avgUph} UPH
                  </p>
                  <ul className="ml-4 list-disc text-sm text-gray-700">
                    {Object.entries(entry.actual.breakdown).map(
                      ([dc, units]) => (
                        <li key={dc}>
                          {dc}: {units} units
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentHistory;
