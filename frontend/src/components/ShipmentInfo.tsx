import InfoCard from "./InfoCard";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

type ShipmentInfoProps = {
  isProjected?: boolean;
  hours: number | null;
  units: number | null;
  uph: number | null;
  unitDiff?: number | null;
  hourDiff?: number | null;
  uphDiff?: number | null;
};

type Metric = "Units" | "Hours" | "UPH";

const ShipmentInfo = ({
  isProjected,
  units,
  hours,
  uph,
  unitDiff,
  hourDiff,
  uphDiff,
}: ShipmentInfoProps) => {
  const [items, setItems] = useState<Metric[]>(["Units", "Hours", "UPH"]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const metrics = {
    Units: { value: units, percentage: unitDiff },
    Hours: { value: hours, percentage: hourDiff },
    UPH: { value: uph, percentage: uphDiff },
  };

  return (
    <div className="flex flex-col w-full">
      <p className="my-3 text-xl">{isProjected ? "Projected" : "Actual"}</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-row gap-3 justify-between">
            {items.map((metric) => (
              <InfoCard
                key={metric}
                id={metric}
                title={metric}
                value={metrics[metric].value}
                percentage={metrics[metric].percentage}
                isProjected={isProjected}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ShipmentInfo;
