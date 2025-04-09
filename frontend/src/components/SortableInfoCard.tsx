import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import InfoCard from "./InfoCard";

type SortableInfoCardProps = React.ComponentProps<typeof InfoCard> & {
  id: string;
};

const SortableInfoCard = ({ id, ...props }: SortableInfoCardProps) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full"
      {...attributes}
      {...listeners}
    >
      <InfoCard {...props} />
    </div>
  );
};

export default SortableInfoCard;
