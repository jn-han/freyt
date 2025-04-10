"use client";

import Chart from "@/components/data/Chart";
import { useState } from "react";

type DataPoint = {
  name: string; // ISO date string like "2025-04-09"
  value: number;
};

type KPIChartCardProps = {
  title: string;
  label: string;
  goal: number;
  changeClassName?: string;
  data: DataPoint[];
  metricType: "sales" | "uph";
};

const KPIChartCard = ({
  title,
  label,
  goal,
  changeClassName = "",
  data,
  metricType,
}: KPIChartCardProps) => {
  const [filter, setFilter] = useState<"week" | "month" | "season">("week");

  const filteredData = filterDataByType(data, filter);

  const averageValue =
    filteredData.reduce((sum, d) => sum + d.value, 0) / filteredData.length ||
    0;

  const diff =
    goal === 0
      ? "N/A"
      : `${(averageValue - goal) / goal > 0 ? "+" : ""}${Math.round(
          ((averageValue - goal) / goal) * 100
        )}% `;

  return (
    <div className="w-1/2 flex flex-col items-start rounded-xl bg-background-dark gap-3 p-6">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-md font-light">{title}</h1>
        <div className="flex bg-background-light rounded-full overflow-hidden text-sm">
          {["week", "month", "season"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as "week" | "month" | "season")}
              className={`px-4 py-1 transition-all ${
                filter === type
                  ? "bg-background-light text-black font-semibold"
                  : "text-black hover:bg-white/50"
              }`}
            >
              {type === "week" && "Weeks"}
              {type === "month" && "Months"}
              {type === "season" && "Days"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-3xl font-bold">
        {metricType === "sales"
          ? `$${averageValue.toFixed(0)}`
          : `${averageValue.toFixed(1)} UPH`}
      </p>

      <div className="flex flex-row justify-start items-end text-sm gap-2">
        <p>{label}</p>
        <p className={changeClassName}>{diff}from goal</p>
      </div>

      <div className="w-full p-4">
        <Chart metricType={metricType} data={filteredData} />
      </div>
    </div>
  );
};

function filterDataByType(
  data: DataPoint[],
  type: "week" | "month" | "season"
): DataPoint[] {
  const now = new Date();

  const groupByWeeks = (totalDays: number, numWeeks: number): DataPoint[] => {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - totalDays);

    const weeklyBuckets: { [key: string]: number[] } = {};
    const labels: string[] = [];

    for (let i = 0; i < numWeeks; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const dateLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      const weekLabel = `Week ${i + 1}\n${dateLabel}`;

      labels.push(weekLabel);

      weeklyBuckets[weekLabel] = data
        .filter((d) => {
          const dDate = new Date(d.name);
          return dDate >= weekStart && dDate <= weekEnd;
        })
        .map((d) => d.value);
    }

    return labels.map((label) => {
      const values = weeklyBuckets[label];
      return {
        name: label,
        value:
          values.length > 0
            ? parseFloat(
                (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(
                  1
                )
              )
            : 0,
      };
    });
  };

  switch (type) {
    case "week":
      const last7Days = new Date(now);
      last7Days.setDate(now.getDate() - 7);

      return data
        .filter((d) => new Date(d.name) >= last7Days)
        .map((d) => ({
          ...d,
          name: new Date(d.name).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
          }),
        }));

    case "month":
      return groupByWeeks(28, 4);

    case "season":
      return groupByWeeks(42, 6);

    default:
      return data;
  }
}

export default KPIChartCard;
