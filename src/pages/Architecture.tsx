import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import architectureBg from "@/assets/architecture-bg.jpg";
import { Building2, Leaf, Sun, Wind } from "lucide-react";

export default function Architecture() {
  const architecturalFeatures = [
    {
      title: "Vastu Shastra Principles",
      description: "Ancient Indian architectural guidelines for harmonious living spaces",
      icon: Building2,
      insights: [
        "Directional alignment for positive energy flow",
        "Natural ventilation and light optimization",
        "Sacred geometry in temple construction",
        "Integration with natural elements",
      ],
    },
    {
      title: "Sustainable Design",
      description: "Eco-friendly practices from ancient India",
      icon: Leaf,
      insights: [
        "Passive cooling through courtyard design",
        "Rainwater harvesting systems",
        "Use of locally sourced materials",
        "Natural lighting through jaalis (lattice screens)",
      ],
    },
    {
      title: "Solar Architecture",
      description: "Ancient understanding of sun's path and energy",
      icon: Sun,
      insights: [
        "Orientation for maximum solar gain in winter",
        "Shading strategies for summer cooling",
        "Sun temples aligned with solstices",
        "Day-lighting through strategic openings",
      ],
    },
    {
      title: "Natural Ventilation",
      description: "Wind towers and cross-ventilation techniques",
      icon: Wind,
      insights: [
        "Wind catchers (Baoli) for cooling",
        "Cross-ventilation through opposite openings",
        "Stack effect in multi-story buildings",
        "Jalousie windows for airflow control",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-xl p-8 mb-8 shadow-elegant"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${architectureBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Traditional Architecture Insights
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover ancient Indian architectural wisdom and its modern applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {architecturalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-elegant transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Modern Applications</CardTitle>
              <CardDescription>How ancient wisdom informs sustainable modern design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-lg">
                  <h3 className="font-semibold mb-2">Energy Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Traditional passive design reduces energy consumption by 40-60%
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h3 className="font-semibold mb-2">Carbon Footprint</h3>
                  <p className="text-sm text-muted-foreground">
                    Local materials and natural cooling minimize environmental impact
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h3 className="font-semibold mb-2">Well-being</h3>
                  <p className="text-sm text-muted-foreground">
                    Natural light and ventilation improve occupant health and comfort
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
