import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Scroll, Crown, Sparkles } from "lucide-react";
import { ManuscriptGallery3D } from "@/components/ManuscriptGallery3D";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Manuscript {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

export default function Museum() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManuscripts();
  }, []);

  const fetchManuscripts = async () => {
    try {
      const { data, error } = await supabase
        .from('manuscripts')
        .select('id, title, description, image_url')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setManuscripts(data || []);
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
    } finally {
      setLoading(false);
    }
  };
  const exhibits = [
    {
      category: "Ancient Texts",
      icon: BookOpen,
      items: [
        {
          title: "Rigveda",
          period: "1500-1200 BCE",
          description: "Oldest of the four Vedas, collection of 1,028 hymns to Deities",
          significance: "Foundation of Hindu philosophy and Sanskrit literature",
        },
        {
          title: "Arthashastra",
          period: "4th Century BCE",
          description: "Ancient treatise on statecraft, economics, and military strategy",
          significance: "One of the earliest works on political economy",
        },
        {
          title: "Charaka Samhita",
          period: "2nd Century BCE",
          description: "Foundational text of Ayurvedic medicine",
          significance: "Comprehensive medical encyclopedia with surgical techniques",
        },
      ],
    },
    {
      category: "Architectural Marvels",
      icon: Crown,
      items: [
        {
          title: "Brihadeeswara Temple",
          period: "1010 CE",
          description: "UNESCO World Heritage Site in Tamil Nadu",
          significance: "Engineering marvel with 216-foot granite tower",
        },
        {
          title: "Konark Sun Temple",
          period: "13th Century CE",
          description: "Chariot-shaped temple dedicated to the sun god Surya",
          significance: "Exemplifies Kalinga architecture and astronomical precision",
        },
        {
          title: "Ajanta Caves",
          period: "2nd Century BCE - 480 CE",
          description: "Rock-cut Buddhist cave monuments",
          significance: "Masterpieces of religious art and ancient painting",
        },
      ],
    },
    {
      category: "Scientific Achievements",
      icon: Sparkles,
      items: [
        {
          title: "Zero Concept",
          period: "5th Century CE",
          description: "Invention of zero as a number by Aryabhata",
          significance: "Revolutionary contribution to mathematics",
        },
        {
          title: "Plastic Surgery",
          period: "6th Century BCE",
          description: "Sushruta Samhita describes rhinoplasty and other procedures",
          significance: "Pioneer of surgical techniques still used today",
        },
        {
          title: "Astronomy",
          period: "5th Century CE",
          description: "Aryabhata's calculations of π and Earth's circumference",
          significance: "Accurate astronomical observations without modern tools",
        },
      ],
    },
    {
      category: "Manuscripts",
      icon: Scroll,
      items: [
        {
          title: "Palm Leaf Manuscripts",
          period: "Various periods",
          description: "Ancient texts written on dried palm leaves",
          significance: "Preservation of knowledge across millennia",
        },
        {
          title: "Bhojpatra Manuscripts",
          period: "Ancient to Medieval",
          description: "Texts written on birch bark",
          significance: "Durable medium used in Himalayan regions",
        },
        {
          title: "Illustrated Manuscripts",
          period: "Medieval period",
          description: "Beautifully illuminated religious and literary texts",
          significance: "Blend of art and scholarship",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-6xl mx-auto">
          <div className="rounded-xl p-8 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-elegant">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Virtual Cultural Museum
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore the rich heritage of ancient India through digital exhibits
            </p>
          </div>

          {/* 3D Manuscript Gallery */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Scroll className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">3D Manuscript Gallery</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Navigate through our 3D gallery of ancient manuscripts. Click and drag to rotate, scroll to zoom.
            </p>
            {loading ? (
              <Skeleton className="w-full h-[600px] rounded-xl" />
            ) : manuscripts.length > 0 ? (
              <ManuscriptGallery3D manuscripts={manuscripts} />
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No manuscripts available yet.</p>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            {exhibits.map((exhibit, categoryIndex) => {
              const Icon = exhibit.icon;
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{exhibit.category}</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {exhibit.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="hover:shadow-elegant transition-all hover:-translate-y-1">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <Badge variant="secondary">{item.period}</Badge>
                          </div>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="p-3 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium text-primary mb-1">Significance</p>
                            <p className="text-sm text-muted-foreground">{item.significance}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
