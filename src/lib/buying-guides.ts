export type GuideLink = { href: string; label: string };

export type CategoryGuide = {
  headline: string;
  /** One sentence used on the product page. */
  fit: string;
  body: string[];
  also: GuideLink[];
};

export type IndustryGuide = {
  headline: string;
  body: string[];
  startWith: GuideLink[];
};

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  "business-radios": {
    headline: "Best for one building or one property",
    fit: "For teams that stay on one site. Range depends on the building, not on a cell network.",
    body: [
      "Business handhelds are the usual starting point for hotels, shops, clinics, schools, and small yards. People press a button and talk. Training takes a few minutes, and the radios do not need a cell plan.",
      "Choose this group when everyone works in the same place. If the team leaves the property, or the site is too large for a handheld, look at nationwide PoC radios or a repeater.",
    ],
    also: [
      { href: "/categories/accessories", label: "Speaker mics and earpieces" },
      { href: "/categories/nationwide-radios", label: "Nationwide PoC radios" },
      { href: "/stay-connected", label: "Ask which model fits the building" },
    ],
  },
  "commercial-radios": {
    headline: "When the shift is longer or the site is louder",
    fit: "A step up from a basic business radio for longer shifts, more channels, or a noisier site.",
    body: [
      "Commercial portables sit between a simple business radio and a full professional radio. They suit crews who need more battery, more channels, or clearer audio than an entry model, and who still work mostly on one site.",
      "Pair them with a spare battery and a speaker mic if the radio has to stay on a belt through the day.",
    ],
    also: [
      { href: "/categories/business-radios", label: "Simpler business handhelds" },
      { href: "/categories/professional-radios", label: "Professional DMR portables" },
      { href: "/categories/accessories", label: "Batteries and speaker mics" },
    ],
  },
  "professional-radios": {
    headline: "Full-featured DMR for demanding sites",
    fit: "A full-featured DMR portable for security, emergency, and industrial teams.",
    body: [
      "Professional HP-series portables are for security, emergency response, and industrial teams that need more channels and more control than a basic business radio.",
      "If the work is in a hazardous area, use an intrinsically safe model with the certification the site requires. A standard professional radio is not a substitute.",
    ],
    also: [
      { href: "/categories/intrinsically-safe", label: "Intrinsically safe radios" },
      { href: "/categories/mobile-radios", label: "Vehicle and desk radios" },
      { href: "/stay-connected", label: "Plan a fleet" },
    ],
  },
  "mobile-radios": {
    headline: "For the vehicle or the dispatch desk",
    fit: "Installs in a vehicle or at a desk. Use a handheld for people who leave the vehicle.",
    body: [
      "Mobile radios belong in a truck, a site office, or a dispatch desk. They use the vehicle power and a fixed antenna, so they cover more than a handheld carried on foot.",
      "Most fleets need both: a mobile radio for the driver or dispatcher, and handhelds for the crew. We can program them onto the same channels before they ship.",
    ],
    also: [
      { href: "/categories/business-radios", label: "Handhelds for the crew" },
      { href: "/categories/repeaters", label: "Repeaters for a large site" },
      { href: "/categories/accessories", label: "Mics and power accessories" },
    ],
  },
  repeaters: {
    headline: "When handhelds cannot cover the site",
    fit: "Extends handheld coverage across a campus, yard, or plant. Placement should be planned first.",
    body: [
      "A repeater listens and retransmits, so handhelds and mobiles can reach each other across a campus, yard, or plant. It does not replace the radios. It connects them.",
      "Placement, antenna height, and licensing matter. Tell us the size of the site before you order, and we will say whether a repeater is the right fix or whether nationwide PoC is simpler.",
    ],
    also: [
      { href: "/categories/business-radios", label: "Handhelds the repeater serves" },
      { href: "/categories/nationwide-radios", label: "PoC if there is no site tower" },
      { href: "/contact", label: "Talk through coverage" },
    ],
  },
  "intrinsically-safe": {
    headline: "Only for hazardous areas",
    fit: "For hazardous areas. The certification on the radio has to match the site.",
    body: [
      "These radios are built and certified for mining, oil, gas, and other places where a spark is a hazard. Check the certification printed for the model — ATEX, IECEx, or UL913 — against what the site requires.",
      "A standard business or professional radio is not a stand-in, even if it looks similar. If you are unsure which rating the work area needs, ask us before you buy.",
    ],
    also: [
      { href: "/industries/mining-energy", label: "Mining and energy" },
      { href: "/categories/professional-radios", label: "Standard professional radios" },
      { href: "/contact", label: "Confirm a certification" },
    ],
  },
  "nationwide-radios": {
    headline: "When the team leaves the property",
    fit: "Push-to-talk over LTE and Wi-Fi, so the team can leave the property without a repeater.",
    body: [
      "Nationwide radios use the cell network and Wi-Fi for push-to-talk. They fit crews who move between job sites, cities, or properties, where a repeater on one roof cannot follow them.",
      "Coverage follows the carrier. A basement or a remote road with no signal is still a dead spot. For a single building with no need to leave, a business handheld is usually the simpler radio.",
    ],
    also: [
      { href: "/categories/business-radios", label: "On-site handhelds" },
      { href: "/categories/mobile-radios", label: "In-vehicle radios" },
      { href: "/stay-connected", label: "Ask about a PoC plan" },
    ],
  },
  accessories: {
    headline: "Match the accessory to the radio",
    fit: "Match this accessory to the radio series before you order. We can confirm the fit.",
    body: [
      "Batteries, chargers, speaker mics, earpieces, and cases are built for specific Hytera series. A charger for one portable will not necessarily fit the next model.",
      "If the product page does not name your radio, send us the model number. We would rather confirm the fit than ship the wrong part.",
    ],
    also: [
      { href: "/products", label: "Find the radio first" },
      { href: "/contact", label: "Check compatibility" },
    ],
  },
};

export const INDUSTRY_GUIDES: Record<string, IndustryGuide> = {
  schools: {
    headline: "Campus staff, not a student phone tree",
    body: [
      "Schools usually need radios for the office, custodians, and staff who move between buildings. A business handheld covers hallways and a front office. A campus with several buildings often needs a repeater, or nationwide PoC radios for staff who leave the grounds.",
    ],
    startWith: [
      { href: "/categories/business-radios", label: "Business handhelds" },
      { href: "/categories/repeaters", label: "Repeaters" },
      { href: "/stay-connected", label: "Describe the campus" },
    ],
  },
  security: {
    headline: "Instant talk for a patrol",
    body: [
      "Guards need to reach each other without unlocking a phone. A professional or commercial portable covers one site. A speaker mic lets the radio stay on a belt. Nationwide PoC is the better fit when the same team covers more than one property.",
    ],
    startWith: [
      { href: "/categories/professional-radios", label: "Professional portables" },
      { href: "/categories/nationwide-radios", label: "Nationwide PoC" },
      { href: "/categories/accessories", label: "Speaker mics" },
    ],
  },
  retail: {
    headline: "Floor, stockroom, and the front door",
    body: [
      "A compact business radio is enough for most stores. One channel group covers the floor and the back room. An earpiece keeps the conversation off the sales floor. Add a spare battery if the store is open long hours.",
    ],
    startWith: [
      { href: "/categories/business-radios", label: "Business handhelds" },
      { href: "/categories/accessories", label: "Earpieces" },
    ],
  },
  construction: {
    headline: "The site is loud, and people are spread out",
    body: [
      "A rugged portable covers the crew on foot. A mobile radio covers the truck or the site office. Noise and distance are the usual problems, so a speaker mic and a spare battery matter as much as the radio itself. A large yard may need a repeater.",
    ],
    startWith: [
      { href: "/categories/commercial-radios", label: "Commercial portables" },
      { href: "/categories/mobile-radios", label: "Vehicle radios" },
      { href: "/categories/accessories", label: "Speaker mics and batteries" },
    ],
  },
  hospitality: {
    headline: "Housekeeping, the desk, and the kitchen",
    body: [
      "Hotels and restaurants need discreet radios. A business handheld plus an earpiece keeps guest areas quiet. Range is usually one building. Tell us how many departments need their own channel and we will program them before the radios ship.",
    ],
    startWith: [
      { href: "/categories/business-radios", label: "Business handhelds" },
      { href: "/categories/accessories", label: "Earpieces" },
      { href: "/stay-connected", label: "Plan the channels" },
    ],
  },
  healthcare: {
    headline: "Care teams inside a clinic or campus",
    body: [
      "Clinics and hospital campuses use business or commercial portables, often with an earpiece in patient areas. Confirm the radio is acceptable for the department before a large order. Staff who travel between sites may need nationwide PoC instead of an on-site radio.",
    ],
    startWith: [
      { href: "/categories/business-radios", label: "Business handhelds" },
      { href: "/categories/nationwide-radios", label: "Nationwide PoC" },
      { href: "/contact", label: "Check a department" },
    ],
  },
  "mining-energy": {
    headline: "Use the certification the site requires",
    body: [
      "Hazardous areas need an intrinsically safe radio. Match ATEX, IECEx, or UL913 to the work area. A standard portable is not a substitute, even for a short job. Send us the site requirement and we will point at a certified model.",
    ],
    startWith: [
      { href: "/categories/intrinsically-safe", label: "Intrinsically safe radios" },
      { href: "/contact", label: "Match a certification" },
    ],
  },
};

const FIT_PRIORITY = [
  "intrinsically-safe",
  "nationwide-radios",
  "repeaters",
  "mobile-radios",
  "professional-radios",
  "commercial-radios",
  "business-radios",
  "accessories",
] as const;

export function productFitNote(categorySlugs: string[]): { slug: string; note: string } | null {
  const match = FIT_PRIORITY.find((slug) => categorySlugs.includes(slug));
  if (!match) return null;
  const guide = CATEGORY_GUIDES[match];
  return guide ? { slug: match, note: guide.fit } : null;
}
