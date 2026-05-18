export const siteConfig = {
  name: "Didcot Airport Taxi",
  legalName: "SamCab Transport Ltd.",
  tagline: "Premium airport & long-distance transfers from Didcot.",
  description:
    "Pre-bookable, fixed-price airport taxis from Didcot to Heathrow, Gatwick, Luton, Stansted, Birmingham and beyond. Executive vehicles, flight tracking, 24/7 dispatch.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://didcotairporttaxi.co.uk").replace(/\/$/, ""),
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+441235000000",
  phoneDisplay: "01235 000 000",
  whatsapp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "+441235000000",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "bookings@didcotairporttaxi.co.uk",
  address: {
    streetAddress: "Didcot",
    addressLocality: "Didcot",
    addressRegion: "Oxfordshire",
    postalCode: "OX11",
    addressCountry: "GB",
  },
  geo: { latitude: 51.6064, longitude: -1.2419 },
  hours: "Mo-Su 00:00-24:00",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
  },
  trustpilot: {
    rating: 4.9,
    reviews: 1280,
  },
} as const;

export type AirportSlug =
  | "heathrow"
  | "gatwick"
  | "luton"
  | "stansted"
  | "birmingham"
  | "london-city"
  | "bristol"
  | "southampton"
  | "manchester";

export type AreaSlug =
  | "didcot"
  | "abingdon"
  | "wallingford"
  | "wantage"
  | "harwell"
  | "milton-park"
  | "culham"
  | "oxford";
