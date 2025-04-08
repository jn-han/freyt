type InfoCardProps = {
  title: string;
  value: number | null;
  isProjected?: boolean;
  percentage?: number | null;
};

const InfoCard = ({ title, value, isProjected, percentage }: InfoCardProps) => {
  const formattedValue = value === null ? "-" : value;

  const shouldShowPercentage =
    percentage !== undefined && percentage !== null && !isProjected;
  const formattedPercentage = shouldShowPercentage
    ? `${percentage > 0 ? "+" : ""}${percentage}%`
    : null;

  const percentageColor =
    shouldShowPercentage && percentage >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="flex flex-col bg-background-dark w-full rounded-xl p-5 my-3">
      <p className="text-md font-extralight">{title}</p>
      <p className="text-2xl font-extrabold">{formattedValue}</p>
      {formattedPercentage !== null && (
        <p className={`text-sm ${percentageColor}`}>{formattedPercentage}</p>
      )}
    </div>
  );
};

export default InfoCard;
