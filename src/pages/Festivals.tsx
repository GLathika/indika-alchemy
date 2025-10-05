import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Calendar } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FestivalResult {
  name: string;
  religion: string;
  region: string;
  timeOfYear: string;
  history: string;
  significance: string;
  howToCelebrate: string;
  traditions: string[];
  specialFoods?: string;
}

export default function Festivals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<FestivalResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a festival name");
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("festival-search", {
        body: { festivalName: searchQuery }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setSearchResult(data);
      toast.success("Festival found!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl p-8 mb-8 shadow-elegant bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Indian Festivals Guide
              </h1>
            </div>
            <p className="text-muted-foreground text-lg mb-6">
              Discover the history and celebration traditions of festivals from all religions across India
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              <Input
                type="text"
                placeholder="Search for festivals (e.g., Diwali, Eid, Christmas, Holi, Pongal, Baisakhi)..."
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
                <h2 className="text-3xl font-bold text-primary mb-2">{searchResult.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div>Religion: {searchResult.religion}</div>
                  <div>•</div>
                  <div>Region: {searchResult.region}</div>
                  <div>•</div>
                  <div>Time: {searchResult.timeOfYear}</div>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">History & Origin</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {searchResult.history}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Significance</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {searchResult.significance}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">How to Celebrate</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
                    {searchResult.howToCelebrate}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-base mb-2">Key Traditions:</h4>
                    {searchResult.traditions.map((tradition, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{tradition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {searchResult.specialFoods && (
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <h3 className="font-semibold mb-2">Special Foods</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {searchResult.specialFoods}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          {!searchResult && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Hindu Festivals
                  </CardTitle>
                  <CardDescription>Diwali, Holi, Navaratri, Pongal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Celebrations marking seasons, harvests, and mythological events
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Islamic Festivals
                  </CardTitle>
                  <CardDescription>Eid ul-Fitr, Eid ul-Adha, Muharram</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Religious observances marking important Islamic events
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Other Festivals
                  </CardTitle>
                  <CardDescription>Christmas, Guru Nanak Jayanti, Buddha Purnima</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Celebrations from Christianity, Sikhism, Buddhism, Jainism and more
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
