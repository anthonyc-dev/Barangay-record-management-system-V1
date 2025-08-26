import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone Support",
    detail: "(02) 8123-4567",
    description: "Call us for immediate assistance",
  },
  {
    icon: Mail,
    title: "Email Support",
    detail: "support@barangay.gov.ph",
    description: "Send us your questions anytime",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    detail: "123 Barangay Hall St., Manila",
    description: "Walk-in assistance available",
  },
  {
    icon: Clock,
    title: "Office Hours",
    detail: "Mon-Fri: 8:00 AM - 5:00 PM",
    description: "We're here to help during business hours",
  },
];

export const ContactSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Contact & Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help? Our support team is ready to assist you with any
            questions or technical issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/20 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-xl flex items-center justify-center">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {info.title}
                </h3>
                <p className="text-primary font-medium mb-1">{info.detail}</p>
                <p className="text-sm text-muted-foreground">
                  {info.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-white/90 mb-6">
              Our dedicated support team is here to help you navigate the system
              and answer any questions about barangay services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30  hover:bg-white/10 hover:text-white"
              >
                Live Chat Support
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white bg-white/10"
              >
                Submit a Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
