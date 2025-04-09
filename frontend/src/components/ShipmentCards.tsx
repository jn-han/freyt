"use client";

import { useState } from "react";
import { ShipmentData } from "@/app/dashboard/page";
import SortableInfoCard from "./SortableInfoCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getTotalUnits,
  getTotalHours,
  getUnitBreakdownByDC,
  getHourBreakdownByDC,
  getUPHBreakdownByDC,
  getPercentageDiff,
} from "@/utils/shipmentHelpers";

type ShipmentCardsProps = {
  isProjected?: boolean;
  shipments: ShipmentData[];
};

const ShipmentCards = ({
  isProjected = false,
  shipments,
}: ShipmentCardsProps) => {
  const unitTotal = getTotalUnits(shipments, isProjected);
  const hourTotal = Math.round(getTotalHours(shipments, isProjected) * 10) / 10;
  const uphTotal = Math.round((unitTotal / hourTotal) * 10) / 10;

  const unitBreakdown = getUnitBreakdownByDC(shipments, isProjected);
  const hourBreakdown = getHourBreakdownByDC(shipments, isProjected);
  const uphBreakdown = getUPHBreakdownByDC(shipments, isProjected);

  let unitDiff: number | undefined;
  let hourDiff: number | undefined;
  let uphDiff: number | undefined;

  let unitDiffAmount: number | undefined;
  let hourDiffAmount: number | undefined;
  let uphDiffAmount: number | undefined;

  const metricOrder = ["Units", "Hours", "UPH"] as const;
  type Metric = (typeof metricOrder)[number];

  const [items, setItems] = useState<Metric[]>([...metricOrder]);

  const sensors = useSensors(useSensor(PointerSensor));

  if (!isProjected) {
    const projectedUnits = getTotalUnits(shipments, true);
    const projectedHours = getTotalHours(shipments, true);
    const projectedUPH =
      projectedHours > 0 ? projectedUnits / projectedHours : 0;

    unitDiffAmount = unitTotal - projectedUnits;
    hourDiffAmount = Math.round((hourTotal - projectedHours) * 10) / 10;
    uphDiffAmount = Math.round((uphTotal - projectedUPH) * 10) / 10;

    unitDiff = getPercentageDiff(unitTotal, projectedUnits);
    hourDiff = getPercentageDiff(hourTotal, projectedHours);
    uphDiff = getPercentageDiff(uphTotal, projectedUPH);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        const oldIndex = items.indexOf(active.id as Metric);
        const newIndex = items.indexOf(over.id as Metric);

        if (oldIndex !== newIndex) {
          setItems(arrayMove(items, oldIndex, newIndex));
        }
      }}
    >
      <p className="text-xl">{isProjected ? "Projected" : "Actual"}</p>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className="flex flex-row w-full justify-between gap-4 ">
          {items.map((metric) => (
            <SortableInfoCard
              key={metric}
              id={metric}
              title={metric}
              total={
                metric === "Units"
                  ? unitTotal
                  : metric === "Hours"
                  ? hourTotal
                  : uphTotal
              }
              breakdown={
                metric === "Units"
                  ? unitBreakdown
                  : metric === "Hours"
                  ? hourBreakdown
                  : uphBreakdown
              }
              percentage={
                metric === "Units"
                  ? unitDiff
                  : metric === "Hours"
                  ? hourDiff
                  : uphDiff
              }
              diffAmount={
                metric === "Units"
                  ? unitDiffAmount
                  : metric === "Hours"
                  ? hourDiffAmount
                  : uphDiffAmount
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ShipmentCards;
