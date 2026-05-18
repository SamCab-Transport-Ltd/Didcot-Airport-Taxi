import { airports } from "./airports";
import { fleet, type Vehicle } from "./fleet";

const knownDestinations: Record<string, { miles: number; baseFare: number }> = {};
for (const a of Object.values(airports)) {
  knownDestinations[a.shortName.toLowerCase()] = { miles: a.distanceMiles, baseFare: a.fareFrom };
  knownDestinations[a.name.toLowerCase()] = { miles: a.distanceMiles, baseFare: a.fareFrom };
  knownDestinations[a.iata.toLowerCase()] = { miles: a.distanceMiles, baseFare: a.fareFrom };
}

export interface FareInput {
  from: string;
  to: string;
  vehicleId: Vehicle["id"];
  passengers: number;
  pickupAt?: Date | string;
  returnTrip?: boolean;
}

export interface FareEstimate {
  base: number;
  surcharge: number;
  total: number;
  estimatedMiles: number;
  estimatedMins: number;
  isApproximate: boolean;
}

function normalise(s: string): string {
  return s.trim().toLowerCase();
}

function hashLength(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function estimateFare(input: FareInput): FareEstimate {
  const vehicle = fleet.find((v) => v.id === input.vehicleId) ?? fleet[0];
  const toKey = normalise(input.to);

  let miles = 0;
  let baseFare = 0;
  let isApproximate = true;

  for (const key of Object.keys(knownDestinations)) {
    if (toKey.includes(key) || key.includes(toKey)) {
      miles = knownDestinations[key].miles;
      baseFare = knownDestinations[key].baseFare;
      isApproximate = false;
      break;
    }
  }

  if (miles === 0) {
    miles = 25 + (hashLength(`${input.from}|${input.to}`) % 80);
    baseFare = Math.max(35, Math.round(miles * 1.6));
  }

  const date = input.pickupAt ? new Date(input.pickupAt) : new Date();
  const hour = date.getHours();
  const isNight = hour < 6 || hour >= 22;
  const nightSurcharge = isNight ? Math.round(baseFare * 0.1) : 0;

  const groupSurcharge = input.passengers > 4 ? 15 : 0;

  let total = Math.round(baseFare * vehicle.multiplier) + nightSurcharge + groupSurcharge;
  if (input.returnTrip) total = Math.round(total * 1.85);

  const estimatedMins = Math.round((miles / 55) * 60);

  return {
    base: baseFare,
    surcharge: nightSurcharge + groupSurcharge,
    total,
    estimatedMiles: miles,
    estimatedMins,
    isApproximate,
  };
}
