export interface Vehicle {
  id: "saloon" | "estate" | "mpv" | "executive" | "8-seater";
  name: string;
  tagline: string;
  passengers: number;
  luggage: string;
  features: string[];
  multiplier: number;
}

export const fleet: Vehicle[] = [
  {
    id: "saloon",
    name: "Standard Saloon",
    tagline: "Toyota Prius / Skoda Octavia class",
    passengers: 4,
    luggage: "2 large, 2 cabin",
    features: ["Air-con", "Phone charger", "Bottled water"],
    multiplier: 1,
  },
  {
    id: "estate",
    name: "Estate",
    tagline: "Skoda Superb Estate / VW Passat",
    passengers: 4,
    luggage: "3 large, 3 cabin",
    features: ["Extra luggage space", "Air-con", "Phone charger"],
    multiplier: 1.15,
  },
  {
    id: "mpv",
    name: "MPV 6-Seater",
    tagline: "VW Caravelle / Ford Galaxy",
    passengers: 6,
    luggage: "5 large, 5 cabin",
    features: ["Spacious cabin", "Child seats available", "Climate zones"],
    multiplier: 1.35,
  },
  {
    id: "executive",
    name: "Executive",
    tagline: "Mercedes E-Class / BMW 5 Series",
    passengers: 3,
    luggage: "2 large, 2 cabin",
    features: ["Leather interior", "On-board Wi-Fi", "Bottled water", "Quiet drive"],
    multiplier: 1.6,
  },
  {
    id: "8-seater",
    name: "8-Seater",
    tagline: "Mercedes Vito / VW Caravelle",
    passengers: 8,
    luggage: "8 large bags",
    features: ["Group travel", "Tour-friendly", "High roof"],
    multiplier: 1.7,
  },
];
