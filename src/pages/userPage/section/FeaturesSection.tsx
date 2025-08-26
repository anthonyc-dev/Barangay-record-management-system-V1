import { FileText, MessageSquare, Bell, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Online Certificate Requests",
    description:
      "Request barangay clearance, certificates of residency, and other documents online. Track your application status in real-time.",
  },
  {
    icon: MessageSquare,
    title: "Complaint Filing",
    description:
      "File complaints and concerns directly through our digital platform. Get updates on resolution progress and communicate with officials.",
  },
  {
    icon: Bell,
    title: "Community Announcements",
    description:
      "Stay informed with the latest barangay news, events, and important announcements delivered straight to your dashboard.",
  },
  {
    icon: User,
    title: "Resident Profile Management",
    description:
      "Maintain and update your personal information, family records, and contact details in one secure location.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive system brings all barangay services to your
            fingertips, making civic engagement easier than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
