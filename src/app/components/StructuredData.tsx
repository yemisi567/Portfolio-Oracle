export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Portfolio Project Oracle",
    description:
      "AI-powered portfolio project ideas tailored to your skills and career goals. Generate personalized projects, track milestones, and get market insights to build an impressive developer portfolio.",
    url: "https://portfolio-project-oracle.vercel.app",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Mojisola Alegbe",
    },
    featureList: [
      "AI-powered project generation",
      "Personalized project recommendations",
      "Milestone tracking",
      "Market insights and trends",
      "Skill-based project matching",
      "Progress monitoring",
    ],
    screenshot: "https://portfolio-project-oracle.vercel.app/og-image.png",
    softwareVersion: "1.0.0",
    datePublished: "2025-09-21",
    dateModified: "2025-09-21",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareHelp: "https://portfolio-project-oracle.vercel.app/support",
    author: {
      "@type": "Person",
      name: "Mojisola Alegbe",
    },
    publisher: {
      "@type": "Organization",
      name: "Portfolio Project Oracle",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
