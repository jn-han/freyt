import InfoCard from "./InfoCard";

type ShipmentInfoProps = {
  isProjected?: boolean;
  hours: number | null;
  units: number | null;
  uph: number | null;
  unitDiff?: number | null;
  hourDiff?: number | null;
  uphDiff?: number | null;
};

const ShipmentInfo = ({
  isProjected,
  units,
  hours,
  uph,
  unitDiff,
  hourDiff,
  uphDiff,
}: ShipmentInfoProps) => {
  return (
    <div className="flex flex-col w-full">
      <p className="my-3 text-xl">{isProjected ? "Projected" : "Actual"}</p>
      <div className="flex flex-row gap-3 justify-between ">
        <InfoCard
          title={"Units"}
          value={units}
          isProjected={isProjected}
          percentage={unitDiff}
        />
        <InfoCard
          title={"Hours"}
          value={hours}
          isProjected={isProjected}
          percentage={hourDiff}
        />
        <InfoCard
          title={"UPH"}
          value={uph}
          isProjected={isProjected}
          percentage={uphDiff}
        />
      </div>
    </div>
  );
};

export default ShipmentInfo;
