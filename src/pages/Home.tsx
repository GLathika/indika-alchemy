import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Flower2, Building2, Library, Sparkles, ScrollText } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Sanskrit Translation",
      description: "AI-powered translation of ancient Sanskrit texts to English",
      icon: BookOpen,
      path: "/sanskrit",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Holy Manuscripts",
      description: "Search and download information about religious texts from all faiths",
      icon: ScrollText,
      path: "/manuscripts",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      title: "Ayurvedic Wellness",
      description: "Personalized health recommendations based on Ayurvedic principles",
      icon: Flower2,
      path: "/ayurveda",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Architecture Insights",
      description: "Explore ancient Indian architectural wisdom and sustainable design",
      icon: Building2,
      path: "/architecture",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Cultural Museum",
      description: "Virtual galleries showcasing India's rich heritage and artifacts",
      icon: Library,
      path: "/museum",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Ancient India + Modern AI
              </h1>
              <Sparkles className="h-8 w-8 text-secondary animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-gray-200">
              Bridging millennia of wisdom with cutting-edge artificial intelligence
            </p>
            <Button
              size="lg"
              className="text-lg px-8 shadow-glow"
              onClick={() => navigate("/sanskrit")}
            >
              Begin Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore Ancient Wisdom
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover how AI brings ancient Indian knowledge to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-elegant transition-all hover:-translate-y-2 group"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Rich Heritage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access thousands of years of documented knowledge from ancient Indian civilization
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI-Powered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced AI models analyze and interpret ancient texts with modern understanding
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library className="h-5 w-5 text-secondary" />
                  Digital Preservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Helping preserve and make accessible India's cultural treasures for future generations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
