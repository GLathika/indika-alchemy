import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Scroll, Crown, Sparkles } from "lucide-react";
import { ManuscriptGallery3D } from "@/components/ManuscriptGallery3D";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import manuscript1 from "@/assets/manuscript-1.jpg";
import manuscript2 from "@/assets/manuscript-2.jpg";
import manuscript3 from "@/assets/manuscript-3.jpg";
import manuscript4 from "@/assets/manuscript-4.jpg";
import scienceAncient from "@/assets/science-ancient.jpg";
import architectureBrihadeeswara from "@/assets/architecture-brihadeeswara.jpg";
import architectureKonark from "@/assets/architecture-konark.jpg";
import architectureAjanta from "@/assets/architecture-ajanta.jpg";

interface Manuscript {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

interface ExhibitItem {
  title: string;
  period: string;
  description: string;
  significance: string;
  image: string;
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

  // Default museum data with images
  const defaultManuscripts: Manuscript[] = [
    {
      id: '1',
      title: 'Rigveda Palm Leaf Manuscript',
      description: 'Ancient palm leaf manuscript containing hymns from the Rigveda, one of the oldest known Vedic Sanskrit texts dating back to 1500 BCE',
      image_url: '/src/assets/manuscript-1.jpg'
    },
    {
      id: '2',
      title: 'Charaka Samhita on Birch Bark',
      description: 'Birch bark manuscript from the foundational text of Ayurvedic medicine, containing detailed medical knowledge and surgical techniques',
      image_url: '/src/assets/manuscript-2.jpg'
    },
    {
      id: '3',
      title: 'Ayurvedic Herbal Encyclopedia',
      description: 'Illustrated manuscript documenting various medicinal plants, herbs, and their therapeutic properties used in traditional Ayurvedic medicine',
      image_url: '/src/assets/manuscript-3.jpg'
    },
    {
      id: '4',
      title: 'Aryabhata Astronomical Treatise',
      description: 'Ancient astronomical manuscript containing mathematical calculations, planetary positions, and celestial observations by mathematician Aryabhata',
      image_url: '/src/assets/manuscript-4.jpg'
    }
  ];

  const displayManuscripts = manuscripts.length > 0 ? manuscripts : defaultManuscripts;

  const exhibits = [
    {
      category: "Ancient Texts",
      icon: BookOpen,
      image: manuscript1,
      items: [
        {
          title: "Rigveda",
          period: "1500-1200 BCE",
          description: "Oldest of the four Vedas, collection of 1,028 hymns to Deities",
          significance: "Foundation of Hindu philosophy and Sanskrit literature",
          image: manuscript1,
        },
        {
          title: "Arthashastra",
          period: "4th Century BCE",
          description: "Ancient treatise on statecraft, economics, and military strategy",
          significance: "One of the earliest works on political economy",
          image: manuscript2,
        },
        {
          title: "Charaka Samhita",
          period: "2nd Century BCE",
          description: "Foundational text of Ayurvedic medicine",
          significance: "Comprehensive medical encyclopedia with surgical techniques",
          image: manuscript3,
        },
      ],
    },
    {
      category: "Architectural Marvels",
      icon: Crown,
      image: architectureBrihadeeswara,
      items: [
        {
          title: "Brihadeeswara Temple",
          period: "1010 CE",
          description: "UNESCO World Heritage Site in Tamil Nadu",
          significance: "Engineering marvel with 216-foot granite tower",
          image: architectureBrihadeeswara,
        },
        {
          title: "Konark Sun Temple",
          period: "13th Century CE",
          description: "Chariot-shaped temple dedicated to the sun god Surya",
          significance: "Exemplifies Kalinga architecture and astronomical precision",
          image: architectureKonark,
        },
        {
          title: "Ajanta Caves",
          period: "2nd Century BCE - 480 CE",
          description: "Rock-cut Buddhist cave monuments",
          significance: "Masterpieces of religious art and ancient painting",
          image: architectureAjanta,
        },
      ],
    },
    {
      category: "Scientific Achievements",
      icon: Sparkles,
      image: scienceAncient,
      items: [
        {
          title: "Zero Concept",
          period: "5th Century CE",
          description: "Invention of zero as a number by Aryabhata",
          significance: "Revolutionary contribution to mathematics",
          image: scienceAncient,
        },
        {
          title: "Plastic Surgery",
          period: "6th Century BCE",
          description: "Sushruta Samhita describes rhinoplasty and other procedures",
          significance: "Pioneer of surgical techniques still used today",
          image: scienceAncient,
        },
        {
          title: "Astronomy",
          period: "5th Century CE",
          description: "Aryabhata's calculations of π and Earth's circumference",
          significance: "Accurate astronomical observations without modern tools",
          image: scienceAncient,
        },
      ],
    },
    {
      category: "Manuscripts",
      icon: Scroll,
      image: manuscript4,
      items: [
        {
          title: "Palm Leaf Manuscripts",
          period: "Various periods",
          description: "Ancient texts written on dried palm leaves",
          significance: "Preservation of knowledge across millennia",
          image: manuscript1,
        },
        {
          title: "Bhojpatra Manuscripts",
          period: "Ancient to Medieval",
          description: "Texts written on birch bark",
          significance: "Durable medium used in Himalayan regions",
          image: manuscript2,
        },
        {
          title: "Illustrated Manuscripts",
          period: "Medieval period",
          description: "Beautifully illuminated religious and literary texts",
          significance: "Blend of art and scholarship",
          image: manuscript3,
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
            ) : (
              <ManuscriptGallery3D manuscripts={displayManuscripts} />
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
                    {exhibit.items.map((item: ExhibitItem, itemIndex) => (
                      <Dialog key={itemIndex}>
                        <DialogTrigger asChild>
                          <Card className="hover:shadow-elegant transition-all hover:-translate-y-1 cursor-pointer">
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
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
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                            <DialogDescription className="text-lg">{item.period}</DialogDescription>
                          </DialogHeader>
                          <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="aspect-video overflow-hidden rounded-lg">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Historical Significance</h3>
                                <p className="text-muted-foreground">{item.significance}</p>
                              </div>
                              <div className="p-4 bg-primary/5 rounded-lg">
                                <h3 className="font-semibold mb-2 text-primary">Period</h3>
                                <p className="text-sm">{item.period}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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