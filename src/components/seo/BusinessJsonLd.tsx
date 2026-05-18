import { siteConfig } from "@/lib/site";

export function BusinessJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": `${siteConfig.url}#business`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: ["Didcot Taxi", "Didcot Airport Cabs", "SamCab Transport"],
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: `${siteConfig.url}/og.png`,
    priceRange: "££",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Apple Pay", "Google Pay"],
    currenciesAccepted: "GBP",
    openingHours: siteConfig.hours,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Didcot" },
      { "@type": "City", name: "Oxford" },
      { "@type": "City", name: "Abingdon" },
      { "@type": "City", name: "Wantage" },
      { "@type": "City", name: "Wallingford" },
      { "@type": "AdministrativeArea", name: "Oxfordshire" },
    ],
    serviceType: [
      "Airport Transfer",
      "Long-distance Taxi",
      "Executive Chauffeur",
      "Corporate Travel",
      "Group Transport",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.trustpilot.rating,
      reviewCount: siteConfig.trustpilot.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: Object.values(siteConfig.social),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
