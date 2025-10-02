import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import sanskritBg from "@/assets/sanskrit-bg.jpg";

export default function Sanskrit() {
  const [sanskritText, setSanskritText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sanskritText.trim()) {
      toast.error("Please enter Sanskrit text");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-sanskrit", {
        body: { text: sanskritText },
      });

      if (error) throw error;
      setTranslation(data.translation);
      toast.success("Translation completed!");
    } catch (error: any) {
      toast.error(error.message || "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-xl p-8 mb-8 shadow-elegant"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${sanskritBg})`,
              backgroundSize: "cover",
            }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sanskrit Text Analysis & Translation
            </h1>
            <p className="text-muted-foreground text-lg">
              Experience the beauty of ancient Sanskrit texts with AI-powered translation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Sanskrit</CardTitle>
                <CardDescription>Enter your Sanskrit text below</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter Sanskrit text here..."
                  value={sanskritText}
                  onChange={(e) => setSanskritText(e.target.value)}
                  className="min-h-[300px] font-serif text-lg"
                />
                <Button onClick={handleTranslate} disabled={loading} className="w-full mt-4">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    "Translate to English"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>English Translation</CardTitle>
                <CardDescription>AI-generated translation appears here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] p-4 bg-muted rounded-lg">
                  {translation ? (
                    <p className="text-foreground whitespace-pre-wrap">{translation}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Translation will appear here...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
