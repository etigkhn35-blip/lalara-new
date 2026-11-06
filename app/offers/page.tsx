import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OffersContent from "@/components/OffersContent";

export const metadata = {
  title: "Special Offers | La Lara Restaurant & Bar Yalıkavak",
  description: "Explore Birthday Special, Lunch With A View, Vino Wednesday and Happy Hour at La Lara Restaurant & Bar.",
};

export default function OffersPage() {
  return <main className="lalara-offers-page"><Header locale="en"/><OffersContent/><Footer locale="en"/></main>;
}
