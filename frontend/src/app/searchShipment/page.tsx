"use client";

import React, { useState } from "react";

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

const SearchShipmentPage: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [error, setError] = useState<string>("");

  const fetchShipment = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/shipments/${date}`);

      if (!res.ok) {
        const { message } = await res.json();
        setShipment(null);
        setError(message || "Shipment not found");
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Shipment by Date</h1>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <button
          onClick={fetchShipment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {shipment && (
        <div className="bg-gray-100 p-4 rounded shadow space-y-3">
          <h2 className="font-semibold text-lg">Shipment Details</h2>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(shipment.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Store Number:</strong> {shipment.storeNumber}
          </p>

          <div>
            <h3 className="font-semibold mt-2">Projected</h3>
            <p>Units: {shipment.Projected.units}</p>
            <p>Hours: {shipment.Projected.hours}</p>
            <p>UPH: {shipment.Projected.uph.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="font-semibold mt-2">Actual</h3>
            <p>Units: {shipment.Actual.units}</p>
            <p>Hours: {shipment.Actual.hours}</p>
            <p>UPH: {shipment.Actual.uph.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchShipmentPage;
