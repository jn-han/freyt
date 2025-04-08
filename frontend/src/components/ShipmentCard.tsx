type ShipmentCardProps = {
    isProjected?: boolean;
    hours: number;
    units: number;
    uph: number;

};

const ShipmentCard = ({ isProjected, units, hours, uph }: ShipmentCardProps) => {

    return (
        <div className="border  p-3 rounded-lg m-3">
            <h1 className="text-2xl">{isProjected ? "Projected" : "Actual"}</h1>
            <p className='text-lg'>Units: {units}</p>
            <p className='text-lg'>Hours: {hours}</p>
            <p className='text-lg'>UPH: {uph}</p>
        </div >
    );
};

export default ShipmentCard;