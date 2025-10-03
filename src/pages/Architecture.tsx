import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import architectureBg from "@/assets/architecture-bg.jpg";
import brihadeeswara from "@/assets/architecture-brihadeeswara.jpg";
import konark from "@/assets/architecture-konark.jpg";
import ajanta from "@/assets/architecture-ajanta.jpg";
import { Building2, Leaf, Sun, Wind, Camera } from "lucide-react";

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

  const architecturalMarvels = [
    {
      title: "Brihadeeswara Temple",
      location: "Thanjavur, Tamil Nadu",
      period: "1010 CE",
      description: "A UNESCO World Heritage Site showcasing Chola architecture with its towering vimana reaching 216 feet.",
      image: brihadeeswara,
      features: ["Granite construction", "Shadow-less vimana", "Acoustic engineering", "Astronomical alignment"]
    },
    {
      title: "Konark Sun Temple",
      location: "Konark, Odisha", 
      period: "13th Century CE",
      description: "A masterpiece of Kalinga architecture designed as a chariot of the sun god with intricate stone carvings.",
      image: konark,
      features: ["Chariot design", "Sundial wheels", "Erotic sculptures", "Maritime influence"]
    },
    {
      title: "Ajanta Caves",
      location: "Maharashtra",
      period: "2nd Century BCE - 480 CE", 
      description: "Rock-cut Buddhist monasteries and prayer halls adorned with exquisite murals and sculptures.",
      image: ajanta,
      features: ["Rock-cut architecture", "Ancient murals", "Buddhist art", "Natural acoustics"]
    }
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

          {/* Architectural Marvels Gallery */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Architectural Marvels</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {architecturalMarvels.map((marvel, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-elegant transition-all hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={marvel.image} 
                      alt={marvel.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{marvel.title}</CardTitle>
                    <CardDescription>
                      {marvel.location} • {marvel.period}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{marvel.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Features:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {marvel.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            <span className="text-xs text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
