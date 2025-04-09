import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type InfoCardProps = {
  id: string; // required for useSortable
  title: string;
  value: number | null;
  isProjected?: boolean;
  percentage?: number | null;
};

const InfoCard = ({ id, title, value, isProjected, percentage }: InfoCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const formattedValue = value === null ? "-" : value;

  const shouldShowPercentage =
    percentage !== undefined && percentage !== null && !isProjected;

  const formattedPercentage = shouldShowPercentage
    ? `${percentage > 0 ? "+" : ""}${percentage}%`
    : null;

  const percentageColor =
    shouldShowPercentage && percentage >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col bg-background-dark w-full rounded-xl p-5 my-3"
    >
      <p className="text-md font-light">{title}</p>
      <p className="text-2xl font-bold">{formattedValue}</p>
      {formattedPercentage !== null && (
        <p className={`text-sm ${percentageColor}`}>{formattedPercentage}</p>
      )}
    </div>
  );
};

export default InfoCard;
