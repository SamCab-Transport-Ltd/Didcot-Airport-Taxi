import type { AirportSlug } from "./site";

export interface Airport {
  slug: AirportSlug;
  name: string;
  shortName: string;
  iata: string;
  city: string;
  distanceMiles: number;
  driveTimeMins: number;
  fareFrom: number;
  description: string;
  highlights: string[];
}

export const airports: Record<AirportSlug, Airport> = {
  heathrow: {
    slug: "heathrow",
    name: "London Heathrow Airport",
    shortName: "Heathrow",
    iata: "LHR",
    city: "London",
    distanceMiles: 55,
    driveTimeMins: 75,
    fareFrom: 85,
    description:
      "Direct, fixed-price transfers between Didcot and all Heathrow terminals (T2, T3, T4, T5). 60-minute free wait on inbound flights with live flight tracking.",
    highlights: [
      "All terminals: T2, T3, T4, T5",
      "Live flight tracking included",
      "60 min free wait on arrivals",
      "Meet-and-greet on request",
    ],
  },
  gatwick: {
    slug: "gatwick",
    name: "London Gatwick Airport",
    shortName: "Gatwick",
    iata: "LGW",
    city: "London",
    distanceMiles: 88,
    driveTimeMins: 105,
    fareFrom: 130,
    description:
      "North and South Terminal transfers from Didcot. Estate cars and 6/8-seaters available for families and groups with luggage.",
    highlights: [
      "North & South Terminal",
      "M40/M25 route monitoring",
      "Child seats available",
      "Corporate accounts welcome",
    ],
  },
  luton: {
    slug: "luton",
    name: "London Luton Airport",
    shortName: "Luton",
    iata: "LTN",
    city: "London",
    distanceMiles: 60,
    driveTimeMins: 85,
    fareFrom: 95,
    description:
      "Reliable Didcot to Luton taxi service for early-morning departures and late arrivals. Door-to-door, no shared rides.",
    highlights: [
      "Early-morning specialists",
      "DART terminal drop-off",
      "Receipt provided",
      "24/7 dispatch",
    ],
  },
  stansted: {
    slug: "stansted",
    name: "London Stansted Airport",
    shortName: "Stansted",
    iata: "STN",
    city: "London",
    distanceMiles: 110,
    driveTimeMins: 130,
    fareFrom: 160,
    description:
      "Long-distance Didcot to Stansted transfers with executive saloons and MPVs. Cross-country routing via M40/M25 with traffic monitoring.",
    highlights: [
      "Executive vehicles available",
      "Premium long-distance route",
      "Refreshments on request",
      "Wi-Fi & phone chargers",
    ],
  },
  birmingham: {
    slug: "birmingham",
    name: "Birmingham Airport",
    shortName: "Birmingham",
    iata: "BHX",
    city: "Birmingham",
    distanceMiles: 80,
    driveTimeMins: 95,
    fareFrom: 115,
    description:
      "Direct Didcot to Birmingham Airport transfers via M40. Ideal for Midlands and international long-haul departures.",
    highlights: [
      "Fast M40 access",
      "Terminal 1 & 2 drop-off",
      "Luggage assistance",
      "Pre-bookable from £115",
    ],
  },
  "london-city": {
    slug: "london-city",
    name: "London City Airport",
    shortName: "London City",
    iata: "LCY",
    city: "London",
    distanceMiles: 80,
    driveTimeMins: 110,
    fareFrom: 140,
    description:
      "Business-focused transfers from Didcot to London City Airport. Executive class with on-board Wi-Fi, ideal for client travel.",
    highlights: [
      "Executive saloons",
      "Business traveller friendly",
      "Card payment & invoicing",
      "Quiet, professional drivers",
    ],
  },
  bristol: {
    slug: "bristol",
    name: "Bristol Airport",
    shortName: "Bristol",
    iata: "BRS",
    city: "Bristol",
    distanceMiles: 70,
    driveTimeMins: 85,
    fareFrom: 110,
    description:
      "Didcot to Bristol Airport taxi via M4. Reliable, fixed-price, with flight tracking and free 60-min wait on arrivals.",
    highlights: [
      "Direct M4 route",
      "Family-friendly fleet",
      "Free arrivals wait",
      "Fixed price guarantee",
    ],
  },
  southampton: {
    slug: "southampton",
    name: "Southampton Airport",
    shortName: "Southampton",
    iata: "SOU",
    city: "Southampton",
    distanceMiles: 75,
    driveTimeMins: 95,
    fareFrom: 115,
    description:
      "South-coast transfers from Didcot to Southampton Airport — also serving cruise terminals on request.",
    highlights: [
      "Cruise terminal transfers",
      "Estate cars for luggage",
      "Pet-friendly on request",
      "Pre-paid receipts",
    ],
  },
  manchester: {
    slug: "manchester",
    name: "Manchester Airport",
    shortName: "Manchester",
    iata: "MAN",
    city: "Manchester",
    distanceMiles: 175,
    driveTimeMins: 195,
    fareFrom: 245,
    description:
      "Premium long-distance Didcot to Manchester Airport transfers. Executive vehicles, refreshments, and Wi-Fi for the journey.",
    highlights: [
      "Executive long-distance",
      "On-board refreshments",
      "Driver changes available",
      "Corporate invoicing",
    ],
  },
};

export const airportList: Airport[] = Object.values(airports);
