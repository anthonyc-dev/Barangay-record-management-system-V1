import { HeroSection } from "./section/HomeSection";
import { FeaturesSection } from "./section/FeaturesSection";
import { HowItWorksSection } from "./section/HowltWorksSection";
import { ContactSection } from "./section/ContactSection";
import Map from "./section/Map";

const HomeUser = () => {
  return (
    <div>
      <div className="min-h-screen">
        {/* <Header /> */}
        <main>
          <div id="home">
            <HeroSection />
          </div>

          <div id="features">
            <FeaturesSection />
          </div>
          <div id="how-it-works">
            <HowItWorksSection />
          </div>
          <div id="map">
            <Map />
          </div>
          <div id="contact">
            <ContactSection />
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default HomeUser;
