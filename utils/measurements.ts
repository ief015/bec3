export type Unit = 'nm' | 'μm' | 'mm' | 'm' | 'km' | 'au' | 'ly' | 'kpc' | 'mpc' | 'gpc';

export interface ConvertedDistance {
  distance: number;
  unit: Unit;
}

export interface UnitDefinition {
  unit: Unit;
  factor: number;
}

export interface ConvertOptions {
  to?: Unit|'auto';
  from?: Unit;
}

const units: UnitDefinition[] = [
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

export function determineBestMeasurement(distanceInMeters: number): UnitDefinition {
  let best: UnitDefinition = units[0];
  for (const unit of units) {
    const { factor } = unit;
    if (distanceInMeters < factor)
      break;
    best = unit;
  }
  return best;
}

export function convertDistance(
  distance: number,
  options?: ConvertOptions,
): ConvertedDistance {
  const { from, to } = Object.assign({ to: 'auto', from: 'm' }, options ?? {});
  const fromUnitDef = units.find(u => u.unit === from);
  if (!fromUnitDef)
    throw new Error(`Unknown unit: ${from}`);
  const distanceInMeters = distance * fromUnitDef.factor;
  const toUnitDef = to === 'auto'
    ? determineBestMeasurement(distanceInMeters)
    : units.find(u => u.unit === to);
  if (!toUnitDef)
    throw new Error(`Unknown unit: ${to}`);
  const convertedDistance = distanceInMeters / toUnitDef.factor;
  return {
    distance: convertedDistance,
    unit: toUnitDef.unit
  };
}
