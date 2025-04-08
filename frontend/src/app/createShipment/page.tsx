"use client";

import React, { FormEvent, useState } from "react";

const CreateShipmentPage = () => {
  const [date, setDate] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [dc, setDc] = useState("DC01");

  const [projected, setProjected] = useState({ units: "", hours: "" });
  const [actual, setActual] = useState({ units: "", hours: "" });
  const [includeActual, setIncludeActual] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedShipment: any = {
      date,
      storeNumber,
      dc,
      Projected: {
        units: Number(projected.units),
        hours: Number(projected.hours),
      },
    };

    if (
      includeActual &&
      actual.units !== "" &&
      actual.hours !== "" &&
      !isNaN(Number(actual.units)) &&
      !isNaN(Number(actual.hours))
    ) {
      formattedShipment.Actual = {
        units: Number(actual.units),
        hours: Number(actual.hours),
      };
    }

    try {
      const res = await fetch("http://localhost:8080/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedShipment),
      });

      if (res.ok) {
        alert("Shipment submitted successfully!");
        // Clear form
        setDate("");
        setStoreNumber("");
        setDc("DC01");
        setProjected({ units: "", hours: "" });
        setActual({ units: "", hours: "" });
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Shipment</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="border px-3 py-2 w-full rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Store Number</label>
          <input
            type="text"
            className="border px-3 py-2 w-full rounded"
            value={storeNumber}
            onChange={(e) => setStoreNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Distribution Center (DC)
          </label>
          <select
            value={dc}
            onChange={(e) => setDc(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          >
            <option value="DC01">DC01</option>
            <option value="DC03">DC03</option>
          </select>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Projected</h2>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Units"
              value={projected.units}
              onChange={(e) =>
                setProjected({ ...projected, units: e.target.value })
              }
              className="border px-2 py-1 rounded w-1/2"
              required
            />
            <input
              type="number"
              placeholder="Hours"
              value={projected.hours}
              onChange={(e) =>
                setProjected({ ...projected, hours: e.target.value })
              }
              className="border px-2 py-1 rounded w-1/2"
              required
            />
          </div>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={includeActual}
              onChange={(e) => setIncludeActual(e.target.checked)}
              className="mr-2"
            />
            Include Actual Data
          </label>
        </div>

        {includeActual && (
          <div>
            <h2 className="font-semibold mb-2">Actual</h2>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Units"
                value={actual.units}
                onChange={(e) =>
                  setActual({ ...actual, units: e.target.value })
                }
                className="border px-2 py-1 rounded w-1/2"
              />
              <input
                type="number"
                placeholder="Hours"
                value={actual.hours}
                onChange={(e) =>
                  setActual({ ...actual, hours: e.target.value })
                }
                className="border px-2 py-1 rounded w-1/2"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Shipment
        </button>
      </form>
    </div>
  );
};

export default CreateShipmentPage;
