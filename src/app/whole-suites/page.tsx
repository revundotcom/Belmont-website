import { TowerPage, type TowerContent } from "@/components/sections/TowerPage";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

const content: TowerContent = {
  tower: "B",
  path: "/whole-suites/",
  crumb: "Whole suites",
  eyebrow: "Tower B · Whole suites",
  title: "3 & 4-bedroom apartments for rent in Kitchener.",
  intro:
    "A whole suite on one lease, for families, friends and professionals, in Kitchener's Pioneer Park. All utilities included except hydro.",
  image: site.heroImageB,
  includedTitle: "In every suite",
  storyTitle: "Room for everyone.",
  story: [
    "Tower B rents complete 3 and 4-bedroom suites on a single 12-month lease. Every suite has two full bathrooms, a full kitchen, its own washer and dryer, a living room and a private balcony, and comes unfurnished so you can make it yours.",
  ],
  included: [
    "3 or 4 bedrooms and 2 full bathrooms",
    "Kitchen with fridge, stove, dishwasher and microwave",
    "Washer and dryer in the suite",
    "Living room and private balcony",
    "All utilities included except hydro; heat and A/C included",
    "Underground parking at $75 per vehicle per month",
  ],
  faqQuestions: [
    "Which utilities do I pay?",
    "How long is the lease?",
    "Is there laundry in the suite?",
    "Is there parking?",
    "How do I book a showing?",
  ],
};

export const metadata = pageMeta({
  title: "3 & 4 Bedroom Apartments for Rent in Kitchener",
  description:
    "Whole 3 and 4-bedroom suites for rent at The Bellmont, 200 Old Carriage Drive, Kitchener: two full baths, in-suite laundry, private balcony, utilities included except hydro. Schedule a tour online.",
  path: "/whole-suites/",
  image: `${process.env.NEXT_PUBLIC_PORTAL_BASE_URL || "https://portal.revun.com"}${site.heroImageB}`,
});

export default function WholeSuitesPage() {
  return <TowerPage c={content} />;
}
