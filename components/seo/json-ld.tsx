import React from "react";

export function SoftwareAppJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Project Camp",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Tactile project management platform featuring 3-column kanban boards, collapsible 4-phase sprint roadmap matrix, and team collaboration.",
        "featureList": [
          "Fluid 3-column Kanban Board",
          "4-Phase Sprint Roadmap & Timeline Matrix",
          "Double-ruled Accounting Ledger Table View",
          "Role-based Project Access Control",
          "Tactile Papercraft & Physical Stationery Design",
        ],
      },
      {
        "@type": "Organization",
        "name": "Project Camp",
        "url": "https://projectcamp.io",
        "logo": "https://projectcamp.io/favicon.ico",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
