import { UserPlus, FileSearch, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Register with your valid ID and barangay information to set up your secure digital profile.",
  },
  {
    icon: FileSearch,
    title: "Browse Services",
    description:
      "Explore available documents, services, and features. Select what you need and fill out the required forms.",
  },
  {
    icon: CheckCircle,
    title: "Track & Receive",
    description:
      "Monitor your request status in real-time and receive notifications when your documents are ready.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these three easy steps to access
            all barangay services digitally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step Number */}
              <div className="w-12 h-12 bg-blue-800 text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-red-400">
                <step.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-12 h-0.5 bg-border transform -translate-y-1/2">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-border rotate-45 translate-x-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
