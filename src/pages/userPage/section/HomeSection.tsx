import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#162340] to-[#1f3f98]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={
            "https://i0.wp.com/peoplaid.com/wp-content/uploads/2021/04/Lala-Municipal-Hall.jpg?resize=723%2C457&ssl=1"
          }
          alt="Modern barangay hall building"
          className="w-full h-full object-cover opacity-80"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(30,58,138,0.8) 100%)",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="block text-white"> Simpak</span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
          Barangay Record
          <span className="block text-red-400"> Management System</span>
        </h1>

        <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Access certificates, file complaints, stay updated with community
          announcements, and manage your resident profile all in one convenient
          digital platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={"/complaint"}>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 min-w-[200px] hover:bg-white/20 hover:border-white/30 hover:text-white"
            >
              Incident Report
            </Button>
          </Link>
          <Link to={"/documentReq"}>
            <Button
              variant="ghost"
              size="lg"
              className="text-lg text-white  px-8 py-6 min-w-[200px] bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white transition"
            >
              Request a Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full p-1">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
