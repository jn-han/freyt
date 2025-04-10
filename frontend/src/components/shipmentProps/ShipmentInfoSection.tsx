"use client";

import { useState } from "react";
import { ShipmentData } from "@/types/shipment";
import SortableInfoCard from "../SortableInfoCard";
import { Percent, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import {
  getTotalUnits,
  getTotalHours,
  getUnitBreakdownByDC,
  getHourBreakdownByDC,
  getUPHBreakdownByDC,
  getPercentageDiff,
} from "@/utils/shipmentHelpers";

type ShipmentInfoSectionProps = {
  isProjected?: boolean;
  shipments: ShipmentData[];
};

const ShipmentInfoSection = ({
  isProjected = false,
  shipments,
}: ShipmentInfoSectionProps) => {
  const unitTotal = getTotalUnits(shipments, isProjected);
  const hourTotal = Math.round(getTotalHours(shipments, isProjected) * 10) / 10;
  const uphTotal = Math.round((unitTotal / hourTotal) * 10) / 10;

  const unitBreakdown = getUnitBreakdownByDC(shipments, isProjected);
  const hourBreakdown = getHourBreakdownByDC(shipments, isProjected);
  const uphBreakdown = getUPHBreakdownByDC(shipments, isProjected);
  const [showPercentage, setShowPercentage] = useState(true);

  let unitDiff: number | undefined;
  let hourDiff: number | undefined;
  let uphDiff: number | undefined;

  let unitDiffAmount: number | undefined;
  let hourDiffAmount: number | undefined;
  let uphDiffAmount: number | undefined;

  const metricOrder = ["Units", "Hours Required", "UPH"] as const;
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
      <div className="flex flex-row w-full justify-between ">
        <p className="text-xl">{isProjected ? "Projected" : "Actual"}</p>
        {!isProjected ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1.05, rotate: 4 }}
            className="px-3"
            onClick={() => setShowPercentage(!showPercentage)}
          >
            {showPercentage ? <Percent /> : <Hash />}
          </motion.div>
        ) : (
          ""
        )}
      </div>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className="flex flex-row w-full justify-between gap-4 ">
          {items.map((metric) => (
            <SortableInfoCard
              key={metric}
              id={metric}
              title={metric}
              showPercentage={showPercentage}
              total={
                metric === "Units"
                  ? unitTotal
                  : metric === "Hours Required"
                  ? hourTotal
                  : uphTotal
              }
              breakdown={
                metric === "Units"
                  ? unitBreakdown
                  : metric === "Hours Required"
                  ? hourBreakdown
                  : uphBreakdown
              }
              percentage={
                metric === "Units"
                  ? unitDiff
                  : metric === "Hours Required"
                  ? hourDiff
                  : uphDiff
              }
              diffAmount={
                metric === "Units"
                  ? unitDiffAmount
                  : metric === "Hours Required"
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

export default ShipmentInfoSection;
