import { ShipmentData } from "@/app/dashboard/page";

export const getTotalUnits = (
  shipments: ShipmentData[],
  isProjected: boolean
) =>
  shipments.reduce(
    (sum, s) => sum + (isProjected ? s.Projected.units : s.Actual?.units ?? 0),
    0
  );

export const getTotalHours = (
  shipments: ShipmentData[],
  isProjected: boolean
) =>
  shipments.reduce(
    (sum, s) => sum + (isProjected ? s.Projected.hours : s.Actual?.hours ?? 0),
    0
  );

export const getUnitBreakdownByDC = (
  shipments: ShipmentData[],
  isProjected: boolean
) =>
  shipments.reduce<Record<string, number>>((acc, s) => {
    const dc = s.dc;
    const val = isProjected ? s.Projected.units : s.Actual?.units ?? 0;
    acc[dc] = (acc[dc] || 0) + val;
    return acc;
  }, {});

export const getHourBreakdownByDC = (
  shipments: ShipmentData[],
  isProjected: boolean
) =>
  shipments.reduce<Record<string, number>>((acc, s) => {
    const dc = s.dc;
    const val = isProjected ? s.Projected.hours : s.Actual?.hours ?? 0;
    acc[dc] = (acc[dc] || 0) + val;
    return acc;
  }, {});

export const getUPHBreakdownByDC = (
  shipments: ShipmentData[],
  isProjected: boolean
) => {
  const temp = shipments.reduce<Record<string, { sum: number; count: number }>>(
    (acc, s) => {
      const dc = s.dc;
      const units = isProjected ? s.Projected.units : s.Actual?.units ?? 0;
      const hours = isProjected ? s.Projected.hours : s.Actual?.hours ?? 0;
      const uph = hours > 0 ? units / hours : 0;

      if (!acc[dc]) acc[dc] = { sum: 0, count: 0 };

      acc[dc].sum += uph;
      acc[dc].count += 1;

      return acc;
    },
    {}
  );

  return Object.fromEntries(
    Object.entries(temp).map(([dc, { sum, count }]) => [
      dc,
      Math.round((sum / count) * 10) / 10,
    ])
  );
};

export const getPercentageDiff = (
  actual: number,
  projected: number
): number => {
  if (projected === 0) return 0;
  return Math.round(((actual - projected) / projected) * 100 * 10) / 10;
};
