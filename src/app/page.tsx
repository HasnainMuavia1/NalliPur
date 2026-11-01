import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import ServeFilm from "@/components/ServeFilm";
import FireFilm from "@/components/FireFilm";
import FeastFilm from "@/components/FeastFilm";
import MenuSection from "@/components/MenuSection";
import Ticker from "@/components/Ticker";
import Stories from "@/components/Stories";
import { DaigSection, VisitSection, Footer } from "@/components/InfoSections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <ServeFilm />
        <FireFilm />
        <FeastFilm />
        <Ticker />
        <Stories />
        <MenuSection />
        <Ticker tone="red" tilt={2} />
        <DaigSection />
        <VisitSection />
      </main>
      <Footer />
    </>
  );
}
