export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  applications: string[];
  specifications: {
    capacity: string;
    accuracy: string;
    material: string;
    displayType: string;
    powerSupply: string;
  };
  features: string[];
  image: string;
}

export const products: Product[] = [
  {
    id: "electronic-weighbridge",
    name: "Electronic Weighbridge",
    shortDescription: "Heavy-duty weighbridge for trucks and large vehicles with digital precision.",
    description: "Our Electronic Weighbridge is designed for accurate and reliable weighing of heavy vehicles and goods. Built with robust steel construction and high-precision load cells, it delivers consistent performance in demanding industrial environments.",
    applications: [
      "Mining and quarry operations",
      "Logistics and transport hubs",
      "Manufacturing plants",
      "Agricultural produce weighing",
      "Waste management facilities"
    ],
    specifications: {
      capacity: "20 Ton to 200 Ton",
      accuracy: "± 20 kg (Class III)",
      material: "Mild Steel / Stainless Steel",
      displayType: "LED/LCD Digital Display",
      powerSupply: "230V AC / 12V DC Battery Backup"
    },
    features: [
      "High precision load cells",
      "Weather-resistant construction",
      "Anti-corrosion coating",
      "Easy installation and calibration",
      "Software integration capability",
      "Remote monitoring support"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "platform-scale",
    name: "Platform Scale",
    shortDescription: "Versatile platform scales for medium-capacity industrial weighing.",
    description: "Platform Scales are designed for accurate weighing of goods and materials in warehouses, factories, and logistics centers. Available in various sizes and capacities to meet diverse industrial requirements.",
    applications: [
      "Warehouse operations",
      "Shipping and receiving",
      "Quality control",
      "Inventory management",
      "Manufacturing processes"
    ],
    specifications: {
      capacity: "100 kg to 5000 kg",
      accuracy: "± 50 g to ± 500 g",
      material: "Stainless Steel / Mild Steel",
      displayType: "LED/LCD with tare function",
      powerSupply: "230V AC / Rechargeable battery"
    },
    features: [
      "Low profile design",
      "Easy loading and unloading",
      "Portable models available",
      "Multiple size options",
      "High overload capacity",
      "Digital calibration"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "industrial-weighing-scale",
    name: "Industrial Weighing Scale",
    shortDescription: "Heavy-duty scales built for rigorous industrial environments.",
    description: "Industrial Weighing Scales are engineered for demanding factory environments. With rugged construction and precise measurement capabilities, they handle daily heavy-duty weighing operations with reliability.",
    applications: [
      "Steel and metal industries",
      "Chemical plants",
      "Food processing units",
      "Textile mills",
      "Paper and packaging industries"
    ],
    specifications: {
      capacity: "500 kg to 10,000 kg",
      accuracy: "± 100 g to ± 1 kg",
      material: "Heavy-gauge Steel / SS304",
      displayType: "Industrial LED display",
      powerSupply: "230V AC with surge protection"
    },
    features: [
      "Rugged construction",
      "Dust and moisture resistant",
      "High repeatability",
      "Shock loading resistance",
      "Easy maintenance",
      "Long-term stability"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "table-top-scale",
    name: "Table Top Scale",
    shortDescription: "Compact and precise scales for countertop and retail applications.",
    description: "Table Top Scales offer precision weighing in a compact form factor. Ideal for retail shops, laboratories, and small businesses requiring accurate measurements in limited space.",
    applications: [
      "Retail stores",
      "Grocery shops",
      "Small businesses",
      "Laboratories",
      "Postal services"
    ],
    specifications: {
      capacity: "1 kg to 50 kg",
      accuracy: "± 1 g to ± 10 g",
      material: "ABS Plastic / Stainless Steel pan",
      displayType: "Bright LCD with backlight",
      powerSupply: "AC adapter / AA batteries"
    },
    features: [
      "Compact design",
      "Price computing function",
      "Tare and zero functions",
      "Memory storage",
      "Easy to clean",
      "Portable"
    ],
    image: "table-top-scale"
  },
  {
    id: "crane-scale",
    name: "Crane Scale",
    shortDescription: "Suspended weighing scales for overhead crane and hoist applications.",
    description: "Crane Scales are designed for suspended weighing applications. With wireless remote display options and rugged construction, they integrate seamlessly with overhead cranes and hoists for dynamic weighing.",
    applications: [
      "Steel plants",
      "Shipyards",
      "Foundries",
      "Scrap yards",
      "Heavy machinery handling"
    ],
    specifications: {
      capacity: "500 kg to 50 Ton",
      accuracy: "± 0.1% of capacity",
      material: "Alloy Steel housing",
      displayType: "LED with wireless remote",
      powerSupply: "Rechargeable Li-ion battery"
    },
    features: [
      "360° rotating hook",
      "Wireless remote display",
      "Overload protection",
      "Heat-resistant design",
      "Long battery life",
      "Impact resistant"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "jewellery-scale",
    name: "Jewellery Scale",
    shortDescription: "High-precision scales for gold, silver, and precious stone weighing.",
    description: "Jewellery Scales provide exceptional precision for weighing precious metals and stones. With readability in milligrams and multiple weighing units, they meet the exacting standards of the jewelry industry.",
    applications: [
      "Jewellery shops",
      "Bullion traders",
      "Pawn shops",
      "Gold refineries",
      "Precious metal assaying"
    ],
    specifications: {
      capacity: "100 g to 2000 g",
      accuracy: "± 0.01 g (10 mg)",
      material: "High-grade ABS with SS pan",
      displayType: "HD LCD with blue backlight",
      powerSupply: "AC adapter / AAA batteries"
    },
    features: [
      "Milligram precision",
      "Multiple units (g, oz, ct, gn)",
      "Piece counting",
      "Windshield for accuracy",
      "Calibration weight included",
      "Auto power-off"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "personal-scale",
    name: "Personal Scale",
    shortDescription: "Accurate and stylish personal weighing scales for home and gym use.",
    description: "Our Personal Scales are designed for everyday health and fitness tracking. With sleek designs and precise measurements, they are perfect for home, gym, and wellness centers.",
    applications: [
      "Home use",
      "Gyms and fitness centers",
      "Hospitals and clinics",
      "Wellness centers",
      "Hotels and spas"
    ],
    specifications: {
      capacity: "5 kg to 200 kg",
      accuracy: "± 100 g",
      material: "Tempered Glass / ABS Plastic",
      displayType: "LCD with backlight",
      powerSupply: "AAA batteries / Rechargeable"
    },
    features: [
      "Slim and portable design",
      "Auto on/off function",
      "Multiple unit display (kg/lb)",
      "Non-slip surface",
      "Overload indicator",
      "Low battery indicator"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "custom-weighing-solutions",
    name: "Custom Weighing Solutions",
    shortDescription: "Tailored weighing systems designed for your specific requirements.",
    description: "We design and manufacture custom weighing solutions tailored to your unique operational requirements. From specialized load cells to complete turnkey weighing systems, our engineering team delivers solutions that perfectly match your needs.",
    applications: [
      "Specialized industrial processes",
      "Unique capacity requirements",
      "Integration with existing systems",
      "Automation projects",
      "Research and development"
    ],
    specifications: {
      capacity: "As per requirement",
      accuracy: "Customized to application",
      material: "Application-specific selection",
      displayType: "Custom interface options",
      powerSupply: "Flexible power options"
    },
    features: [
      "Bespoke design",
      "Engineering consultation",
      "Prototype development",
      "System integration",
      "On-site installation",
      "Training provided"
    ],
    image: "/placeholder.svg"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
