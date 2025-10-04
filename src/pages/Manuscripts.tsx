import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Loader2, Download, ScrollText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface HolyBookResult {
  title: string;
  originalLanguage: string;
  period: string;
  overview: string;
  keyTeachings: string[];
  chapters: Array<{
    title: string;
    summary: string;
  }>;
  culturalSignificance: string;
  error?: string;
}

export default function Manuscripts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<HolyBookResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a book name",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("holy-book-search", {
        body: { bookName: searchQuery }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Book not found",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setSearchResult(data);
      toast({
        title: "Book found!",
        description: "Click download to get a PDF with the information",
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Unable to search for book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = () => {
    if (!searchResult) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(searchResult.title, margin, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Original Language: ${searchResult.originalLanguage}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Period: ${searchResult.period}`, margin, yPosition);
    yPosition += 12;

    // Overview
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Overview", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const overviewLines = doc.splitTextToSize(searchResult.overview, maxWidth);
    doc.text(overviewLines, margin, yPosition);
    yPosition += overviewLines.length * 5 + 8;

    // Key Teachings
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Key Teachings", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    searchResult.keyTeachings.forEach((teaching) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      const teachingLines = doc.splitTextToSize(`• ${teaching}`, maxWidth - 5);
      doc.text(teachingLines, margin + 5, yPosition);
      yPosition += teachingLines.length * 5 + 3;
    });
    yPosition += 5;

    // Chapters
    if (searchResult.chapters && searchResult.chapters.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Chapters Overview", margin, yPosition);
      yPosition += 8;

      searchResult.chapters.forEach((chapter, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${chapter.title}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const summaryLines = doc.splitTextToSize(chapter.summary, maxWidth);
        doc.text(summaryLines, margin + 5, yPosition);
        yPosition += summaryLines.length * 5 + 6;
      });
    }

    // Cultural Significance
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cultural Significance", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const significanceLines = doc.splitTextToSize(searchResult.culturalSignificance, maxWidth);
    doc.text(significanceLines, margin, yPosition);

    // Save PDF
    doc.save(`${searchResult.title.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "PDF Downloaded!",
      description: "The book information has been saved as a PDF",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl p-8 mb-8 shadow-elegant bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <ScrollText className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Holy Manuscripts Library
              </h1>
            </div>
            <p className="text-muted-foreground text-lg mb-6">
              Search for ancient Indian holy books and scriptures, get detailed information and download as PDF
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              <Input
                type="text"
                placeholder="Search for holy books (e.g., Bhagavad Gita, Vedas, Upanishads)..."
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
                      <BookOpen className="h-6 w-6 text-primary" />
                      <h2 className="text-3xl font-bold text-primary">{searchResult.title}</h2>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div>Language: {searchResult.originalLanguage}</div>
                      <div>•</div>
                      <div>Period: {searchResult.period}</div>
                    </div>
                  </div>
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {searchResult.overview}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Key Teachings</h3>
                  <div className="space-y-2">
                    {searchResult.keyTeachings.map((teaching, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{teaching}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {searchResult.chapters && searchResult.chapters.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Chapters Overview</h3>
                    <div className="space-y-4">
                      {searchResult.chapters.map((chapter, idx) => (
                        <Card key={idx} className="bg-secondary/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{idx + 1}. {chapter.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{chapter.summary}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <h3 className="font-semibold mb-2">Cultural Significance</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {searchResult.culturalSignificance}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Vedas
                </CardTitle>
                <CardDescription>Ancient Sanskrit texts of knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The oldest scriptures of Hinduism, containing hymns, rituals, and philosophical teachings.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Upanishads
                </CardTitle>
                <CardDescription>Philosophical treatises</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ancient texts exploring the nature of reality, consciousness, and the ultimate truth.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Bhagavad Gita
                </CardTitle>
                <CardDescription>Song of the Divine</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A 700-verse dialogue on dharma, duty, and the path to spiritual liberation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
