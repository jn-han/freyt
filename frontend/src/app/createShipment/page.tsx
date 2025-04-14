"use client";

import React, { FormEvent, useState, useEffect } from "react";

const CreateShipmentPage = () => {
  const [date, setDate] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [dc, setDc] = useState("DC01");

  const [projected, setProjected] = useState({ units: "", hours: "" });
  const [actual, setActual] = useState({ units: "", hours: "" });
  const [includeActual, setIncludeActual] = useState(false);

  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roster, setRoster] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    const isoDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString();

    const formattedShipment: any = {
      date: isoDate,
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
    if (roster.length > 0) {
      formattedShipment.roster = roster;
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:8080/employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };

    fetchEmployees();
  }, []);

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

        <div>
          <h2 className="font-semibold mb-2">Add Employees to Roster</h2>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 w-full rounded mb-2"
          />
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
            {employees
              .filter((emp) =>
                `${emp.first_name} ${emp.last_name} ${emp._id}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((emp) => (
                <div
                  key={emp._id}
                  className="flex justify-between items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    if (!roster.includes(emp._id)) {
                      setRoster([...roster, emp._id]);
                    }
                  }}
                >
                  <span>
                    {emp.first_name} {emp.last_name}
                  </span>
                  <span className="text-sm text-gray-500">{emp._id}</span>
                </div>
              ))}
          </div>

          {roster.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-medium mb-1">Selected Roster:</h3>
              <ul className="text-sm list-disc list-inside">
                {roster.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
