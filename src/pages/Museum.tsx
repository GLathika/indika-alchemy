import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import MuseumImage3D from "@/components/MuseumImage3D";

interface MuseumSearchResult {
  name: string;
  location: string;
  period: string;
  history: string;
  collections: string;
  architecture: string;
  founder?: string;
  culturalSignificance: string;
  imageData?: string;
}

export default function Museum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<MuseumSearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("museum-search", {
        body: { query: searchQuery }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setSearchResult(data);
      toast.success("Item found!");
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Virtual Cultural Museum
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Search for museums and cultural institutions across India
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              <Input
                type="text"
                placeholder="Search for museums (e.g., National Museum Delhi, Indian Museum Kolkata, CSMVS Mumbai, Salar Jung Hyderabad)..."
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
                  <div>Location: {searchResult.location}</div>
                  <div>•</div>
                  <div>Established: {searchResult.period}</div>
                </div>
              </div>

              <CardContent className="p-6">
                {searchResult.imageData && (
                  <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                    <MuseumImage3D imageUrl={searchResult.imageData} alt={searchResult.name} />
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">History</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {searchResult.history}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Collections & Exhibits</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {searchResult.collections}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Architecture</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {searchResult.architecture}
                    </p>
                  </div>

                  {searchResult.founder && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Founder</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {searchResult.founder}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <h3 className="font-semibold mb-2">Cultural Significance</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {searchResult.culturalSignificance}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          {!searchResult && (
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle>Discover India's Museums</CardTitle>
                <CardDescription>
                  Search for museums and cultural institutions from across India
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our AI-powered virtual museum provides detailed 3D visualizations and information about:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• National Museum, New Delhi - India's largest museum with artifacts from ancient to modern times</li>
                  <li>• Indian Museum, Kolkata - Oldest museum in India (established 1814)</li>
                  <li>• Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS), Mumbai - Art, archaeology, and natural history</li>
                  <li>• Salar Jung Museum, Hyderabad - One of the world's largest museums with global art collections</li>
                  <li>• National Gallery of Modern Art (NGMA), Delhi, Mumbai, Bangalore - Modern and contemporary Indian art</li>
                  <li>• Government Museum, Chennai - Bronze sculptures and South Indian art</li>
                  <li>• Victoria Memorial Hall, Kolkata - British colonial history and art</li>
                  <li>• Tribal Museums, Railway Museums, Science Museums, and many more...</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}