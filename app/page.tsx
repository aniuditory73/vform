import { Contacts } from "@/components/Contacts";
import { DtfBenefits } from "@/components/DtfBenefits";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroTypography } from "@/components/HeroTypography";
import { Portfolio } from "@/components/Portfolio";
import { Pricing } from "@/components/Pricing";
import { ScrollExperience } from "@/components/ScrollExperience";
import { TechnologyText } from "@/components/TechnologyText";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">К содержанию</a>
      <Header />
      <main id="main" className="site-main">
        <ScrollExperience hero={<HeroTypography />} technology={<TechnologyText />} />
        <Portfolio />
        <Pricing />
        <DtfBenefits />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
