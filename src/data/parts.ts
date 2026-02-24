export interface Part {
  id: string;
  name: string;
  description: string;
  types?: string[];
  specifications: Record<string, string>;
  applications: string[];
  importance: string;
  compatibleProducts: string[];
  image: string;
}

export const parts: Part[] = [
  {
    id: "load-cells",
    name: "Load Cells",
    description: "Load cells are the heart of any weighing system, converting mechanical force into electrical signals. Our range includes various types to suit different weighing applications, from precision laboratory balances to heavy-duty industrial weighbridges.",
    types: [
      "Single Point Load Cells - For platform scales and bench scales",
      "Shear Beam Load Cells - For tank weighing and floor scales",
      "Compression Load Cells - For heavy-capacity applications",
      "Double Ended Shear Beam - For weighbridges and large platforms",
      "S-Type Load Cells - For tension and compression measurement"
    ],
    specifications: {
      "Capacity Range": "5 kg to 100 Ton",
      "Material Options": "Alloy Steel / Stainless Steel (SS304/SS316)",
      "Accuracy Class": "C3 / C4 (OIML)",
      "Protection Rating": "IP65 / IP67 / IP68",
      "Cable Length": "3m to 20m (customizable)",
      "Operating Temperature": "-20°C to +60°C"
    },
    applications: [
      "Electronic weighbridges",
      "Platform and floor scales",
      "Tank and hopper weighing",
      "Industrial automation",
      "Force measurement systems"
    ],
    importance: "Load cells are the primary sensing element that determines the accuracy, reliability, and longevity of your weighing system. Choosing the right load cell type and capacity ensures optimal performance and measurement precision.",
    compatibleProducts: [
      "All Weighbridges",
      "Platform Scales",
      "Industrial Scales",
      "Custom Systems"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "weighing-indicators",
    name: "Weighing Indicators / Cards",
    description: "Digital weighing indicators process signals from load cells and display accurate weight readings. Our indicators feature advanced electronics, multiple connectivity options, and user-friendly interfaces for efficient operation.",
    types: [
      "Basic Weight Display Indicators",
      "Price Computing Indicators",
      "Process Control Indicators",
      "Multi-function Programmable Indicators",
      "Batch Weighing Controllers"
    ],
    specifications: {
      "Display Type": "LED (7-segment) / LCD (graphical)",
      "Display Size": "0.56\" to 2\" digit height",
      "Resolution": "Up to 30,000 divisions",
      "Communication": "RS232 / RS485 / USB / Ethernet",
      "Power Supply": "230V AC / 12V DC / Battery",
      "Functions": "Tare, Zero, Hold, Peak Hold, Calibration"
    },
    applications: [
      "Weighbridge operations",
      "Industrial weighing",
      "Retail and commercial scales",
      "Process automation",
      "Quality control systems"
    ],
    importance: "The indicator is the brain of the weighing system, providing the interface between the load cells and the operator. A quality indicator ensures accurate readings, easy operation, and reliable data management.",
    compatibleProducts: [
      "All Weighing Scales",
      "Weighbridges",
      "Custom Systems"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "batteries",
    name: "Batteries",
    description: "Reliable power backup batteries ensure uninterrupted weighing operations during power outages. Our batteries are specifically designed for weighing applications, offering long backup duration and extended service life.",
    types: [
      "Sealed Lead Acid (SLA) Batteries",
      "Lithium-ion Rechargeable Batteries",
      "Ni-MH Battery Packs",
      "UPS Battery Systems"
    ],
    specifications: {
      "Voltage Options": "6V / 12V / 24V",
      "Capacity Range": "1.2Ah to 100Ah",
      "Backup Duration": "4 to 48 hours (depending on usage)",
      "Charging Time": "4 to 8 hours",
      "Cycle Life": "300 to 1000 cycles",
      "Safety Features": "Overcharge and short-circuit protection"
    },
    applications: [
      "Portable weighing scales",
      "Remote location installations",
      "Power backup for weighbridges",
      "Mobile weighing units",
      "Emergency operation support"
    ],
    importance: "Reliable battery backup ensures continuous weighing operations during power interruptions, protecting against data loss and operational downtime in critical weighing applications.",
    compatibleProducts: [
      "Portable Scales",
      "Crane Scales",
      "Table Top Scales",
      "Weighing Indicators"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "cable-5amp",
    name: "Cable 5 Amp",
    description: "High-quality 5 Amp cables designed for reliable power and signal transmission in electronic weighing systems. Built to withstand industrial environments with durable insulation and secure connectors.",
    types: [
      "Shielded Signal Cables",
      "Power Supply Cables",
      "Extension Cables",
      "Multi-core Cables"
    ],
    specifications: {
      "Current Rating": "5 Amp",
      "Conductor Material": "Copper (tinned/bare)",
      "Insulation": "PVC / Silicone",
      "Shielding": "Braided / Foil shielded",
      "Length Options": "1m to 50m (customizable)",
      "Operating Temperature": "-20°C to +70°C"
    },
    applications: [
      "Load cell connections",
      "Indicator power supply",
      "Weighbridge wiring",
      "Industrial scale installations",
      "Signal transmission"
    ],
    importance: "Quality cables ensure accurate signal transmission and reliable power delivery, minimizing electrical noise and interference that can affect weighing accuracy.",
    compatibleProducts: [
      "All Weighbridges",
      "Platform Scales",
      "Industrial Scales",
      "Weighing Indicators"
    ],
    image: "/placeholder.svg"
  }
];

export const getPartById = (id: string): Part | undefined => {
  return parts.find(part => part.id === id);
};
