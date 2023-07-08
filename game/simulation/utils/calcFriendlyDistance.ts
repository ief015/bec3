export interface ConvertedDistance {
  distance: number;
  unit: string;
}

const units = [
  { unit: 'nm', factor: 1e-9 },
  { unit: 'μm', factor: 1e-6 },
  { unit: 'mm', factor: 1e-3 },
  { unit: 'm', factor: 1 },
  { unit: 'km', factor: 1e3 },
  { unit: 'au', factor: 149597870700 },
  { unit: 'ly', factor: 9.461e15 },
  { unit: 'kpc', factor: 3.086e19 },
  { unit: 'mpc', factor: 3.086e22 },
  { unit: 'gpc', factor: 3.086e25 }
];

export function calcFriendlyDistance(distanceInMeters: number): ConvertedDistance {
  let bestUnit: string = units[0].unit;
  let bestFactor: number = units[0].factor;
  for (const { unit, factor } of units) {
    if (distanceInMeters < factor)
      break;
    bestUnit = unit;
    bestFactor = factor;
  }
  const convertedDistance: ConvertedDistance = {
    distance: distanceInMeters / bestFactor,
    unit: bestUnit
  };
  return convertedDistance;
}