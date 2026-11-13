/**
 * Everything about The Bellmont that is not a live listing.
 *
 * Listings, prices, photos, availability and showing slots all come from the
 * portal (see src/lib/portal.ts). What is here is taken from the building's own
 * portal record and listing copy, so the site and the listings never disagree.
 */
export const site = {
  name: "The Bellmont",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.thebellmont.ca").replace(/\/$/, ""),
  tagline: "Two buildings. One community.",
  description:
    "The Bellmont at 200 Old Carriage Drive, Kitchener: private rooms and whole 3 and 4-bedroom suites across two towers, minutes from Conestoga College. See live availability, book a showing and apply online.",
  phone: "833-501-7501",
  phoneHref: "tel:+18335017501",
  phoneHours: "24 hours a day, 7 days a week",
  address: {
    street: "200 Old Carriage Drive",
    city: "Kitchener",
    region: "Ontario",
    regionCode: "ON",
    postalCode: "N2P 1Z7",
    country: "CA",
  },
  neighbourhood: "Pioneer Park",
  crossStreet: "Old Carriage Drive and Homer Watson Boulevard",
  mapQuery: "200 Old Carriage Drive, Kitchener, ON N2P 1Z7",
  /** Building covers (Tower A = portal building 463, Tower B = 468), as the portal serves them. */
  heroImage: "/storage/property-media/463/6ae226ec653a9.webp",
  heroImageB: "/storage/property-media/468/6ae226f6b706c.webp",
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.regionCode} ${site.address.postalCode}`;

export const amenityGroups = [
  {
    title: "Fitness",
    items: ["Fitness centre", "Yoga room"],
  },
  {
    title: "Downtime",
    items: ["Theatre room", "Lounge", "Games room with table tennis"],
  },
  {
    title: "Work & study",
    items: ["Five meeting rooms", "Two study rooms", "Free Wi-Fi in common areas"],
  },
  {
    title: "Everyday",
    items: ["Lobby and elevators", "Underground parking", "Property management and maintenance on site"],
  },
] as const;

export const inSuite = [
  "Kitchen with fridge, stove, dishwasher and microwave",
  "Washer and dryer in every suite",
  "Living room and private balcony",
  "Heat and air conditioning included",
] as const;

export const nearby = [
  { label: "Conestoga College, Kitchener campus", value: "A few minutes" },
  { label: "University of Waterloo", value: "About 20 minutes" },
  { label: "Wilfrid Laurier University", value: "About 20 minutes" },
  { label: "Pioneer Park Public School", value: "Elementary" },
  { label: "Huron Heights Secondary School", value: "Secondary" },
] as const;

export const faqs = [
  {
    q: "Which utilities do I pay?",
    a: "Hydro only. Everything else is included, heat and air conditioning too.",
  },
  {
    q: "How long is the lease?",
    a: "Leases are 12 months. In Tower A each bedroom is rented on its own individual lease, so your rent covers your room and nothing is split with suitemates.",
  },
  {
    q: "What's the difference between Tower A and Tower B?",
    a: "Tower A rents private, furnished bedrooms inside shared 3 and 4-bedroom suites. Tower B rents whole 3 and 4-bedroom suites on a single lease.",
  },
  {
    q: "Is there parking?",
    a: "Yes. Underground parking is $75 per vehicle per month.",
  },
  {
    q: "How do I book a showing?",
    a: "Pick a time on any suite's page and it's booked straight into our calendar. You can also call 833-501-7501, any time, any day.",
  },
  {
    q: "How do I apply?",
    a: "Press Apply Now on the suite you want. You'll create an account (or sign in) on our secure leasing portal and finish your application there.",
  },
] as const;

export const nav = [
  { label: "Suites", href: "/suites/" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Neighbourhood", href: "/#neighbourhood" },
  { label: "Contact", href: "/#contact" },
] as const;
