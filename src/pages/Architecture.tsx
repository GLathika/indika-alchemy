import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import architectureBg from "@/assets/architecture-bg.jpg";
import brihadeeswara from "@/assets/architecture-brihadeeswara.jpg";
import konark from "@/assets/architecture-konark.jpg";
import ajanta from "@/assets/architecture-ajanta.jpg";
import { Building2, Leaf, Sun, Wind, Camera, Search, Loader2, MapPin, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TempleResult {
  name: string;
  location: string;
  period: string;
  history: string;
  architecture: string;
  deity: string;
  features: string[];
  timings?: string;
  imageDescription: string;
  error?: string;
}

export default function Architecture() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<TempleResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a temple name",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("temple-search", {
        body: { templeName: searchQuery }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Temple not found",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setSearchResult(data);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Unable to search for temple. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
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
            <p className="text-muted-foreground text-lg mb-6">
              Discover ancient Indian architectural wisdom and its modern applications
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              <Input
                type="text"
                placeholder="Search for any temple across India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-background/80 backdrop-blur-sm"
                disabled={isSearching}
              />
              <Button type="submit" disabled={isSearching} className="gap-2">
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Search Results */}
          {searchResult && (
            <Card className="mb-8 overflow-hidden border-primary/20 shadow-elegant">
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold text-primary">{searchResult.name}</h2>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {searchResult.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {searchResult.period}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {searchResult.deity && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Main Deity
                    </h3>
                    <p className="text-muted-foreground">{searchResult.deity}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-2">Historical Significance</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {searchResult.history}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Architectural Style</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {searchResult.architecture}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {searchResult.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {searchResult.timings && (
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <h3 className="font-semibold mb-1">Visiting Hours</h3>
                    <p className="text-sm text-muted-foreground">{searchResult.timings}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
