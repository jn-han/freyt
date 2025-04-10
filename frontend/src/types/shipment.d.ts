export interface ShipmentData {
  _id?: string;
  date: string;
  storeNumber: string;
  dc: "DC01" | "DC03";
  Projected: {
    units: number;
    hours: number;
    uph: number;
  };
  Actual?: {
    units: number;
    hours: number;
    uph: number | null;
  };
}

type DataPoint = {
  name: string;
  value: number;
};
