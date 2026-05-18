import type { AreaSlug } from "./site";

export interface Area {
  slug: AreaSlug;
  name: string;
  description: string;
  postcodePrefixes: string[];
}

export const areas: Record<AreaSlug, Area> = {
  didcot: {
    slug: "didcot",
    name: "Didcot",
    description:
      "Our home town. Local pickups across Didcot Parkway, Ladygrove, Northbourne and the town centre — usually with us within 10 minutes.",
    postcodePrefixes: ["OX11"],
  },
  abingdon: {
    slug: "abingdon",
    name: "Abingdon",
    description:
      "Door-to-door airport transfers from Abingdon-on-Thames. Direct A34 access keeps journey times short.",
    postcodePrefixes: ["OX14"],
  },
  wallingford: {
    slug: "wallingford",
    name: "Wallingford",
    description:
      "Premium taxi service for Wallingford residents — airport runs, long-distance and corporate travel.",
    postcodePrefixes: ["OX10"],
  },
  wantage: {
    slug: "wantage",
    name: "Wantage",
    description:
      "Reliable Wantage to airport transfers with fixed pricing, including Grove and surrounding villages.",
    postcodePrefixes: ["OX12"],
  },
  harwell: {
    slug: "harwell",
    name: "Harwell",
    description:
      "Specialist service for Harwell Campus visitors and residents — corporate accounts and meet-and-greet on request.",
    postcodePrefixes: ["OX11"],
  },
  "milton-park": {
    slug: "milton-park",
    name: "Milton Park",
    description:
      "Business-class transfers for Milton Park companies. Account billing, executive vehicles and reliable lead times.",
    postcodePrefixes: ["OX14"],
  },
  culham: {
    slug: "culham",
    name: "Culham",
    description:
      "Trusted Culham taxi service for UKAEA, Culham Science Centre and local residents.",
    postcodePrefixes: ["OX14"],
  },
  oxford: {
    slug: "oxford",
    name: "Oxford",
    description:
      "Oxford to airport transfers with the same fixed-price, premium experience. Stop-offs and group bookings welcome.",
    postcodePrefixes: ["OX1", "OX2", "OX3", "OX4"],
  },
};

export const areaList: Area[] = Object.values(areas);
