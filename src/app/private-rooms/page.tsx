import { TowerPage, type TowerContent } from "@/components/sections/TowerPage";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

const content: TowerContent = {
  tower: "A",
  path: "/private-rooms/",
  crumb: "Private rooms",
  eyebrow: "Tower A · Private rooms",
  title: "Furnished rooms for rent in Kitchener.",
  intro:
    "Your own furnished bedroom in a 3 or 4-bedroom suite, on your own 12-month lease — minutes from Conestoga College. All utilities included except hydro.",
  image: site.heroImage,
  includedTitle: "What you get",
  storyTitle: "Your room, your lease.",
  story: [
    "Each bedroom in Tower A is rented on its own individual lease, so your rent covers your room and nothing is split with anyone. The kitchen, living room, balcony and two full bathrooms are shared with your suitemates, each on their own lease.",
  ],
  included: [
    "A private bedroom with a bed, a desk, a chair and a closet",
    "Your own door and your own window",
    "Individual 12-month lease in your name",
    "Shared kitchen with fridge, stove, dishwasher and microwave",
    "Washer and dryer inside the suite",
    "All utilities included except hydro; heat and A/C included",
  ],
  faqQuestions: [
    "Which utilities do I pay?",
    "How long is the lease?",
    "Are the rooms furnished?",
    "How far is The Bellmont from Conestoga College?",
    "Is there parking?",
  ],
};

export const metadata = pageMeta({
  title: "Furnished Rooms for Rent near Conestoga College, Kitchener",
  description:
    "Private furnished rooms for rent at The Bellmont, 200 Old Carriage Drive, Kitchener. Individual 12-month leases, utilities included except hydro, minutes from Conestoga College. Schedule a tour online.",
  path: "/private-rooms/",
  image: `${process.env.NEXT_PUBLIC_PORTAL_BASE_URL || "https://portal.revun.com"}${site.heroImage}`,
});

export default function PrivateRoomsPage() {
  return <TowerPage c={content} />;
}
