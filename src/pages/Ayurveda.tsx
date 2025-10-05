import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ayurvedaBg from "@/assets/ayurveda-bg.jpg";

export default function Ayurveda() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    if (!age || !symptoms) {
      toast.error("Please fill in age and symptoms");
      return;
    }

    setLoading(true);
    try {
      const body: any = {
        age: parseInt(age),
        symptoms,
      };
      
      if (weight) body.weight = parseFloat(weight);
      if (bodyType) body.bodyType = bodyType;
      
      const { data, error } = await supabase.functions.invoke("ayurvedic-recommendations", {
        body,
      });

      if (error) throw error;
      setRecommendations(data.recommendations);
      toast.success("Recommendations generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate recommendations");
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
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${ayurvedaBg})`,
              backgroundSize: "cover",
            }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ayurvedic Medicine Recommendations
            </h1>
            <p className="text-muted-foreground text-lg">
              Get personalized wellness advice based on ancient Ayurvedic wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Health Profile</CardTitle>
                <CardDescription>Enter your details for personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyType">Body Type (Dosha)</Label>
                  <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your dosha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vata">Vata (Air & Space)</SelectItem>
                      <SelectItem value="Pitta">Pitta (Fire & Water)</SelectItem>
                      <SelectItem value="Kapha">Kapha (Earth & Water)</SelectItem>
                      <SelectItem value="Mixed">Not sure / Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms or health concerns..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                <Button onClick={handleGetRecommendations} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Recommendations</CardTitle>
                <CardDescription>AI-powered Ayurvedic guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] p-4 bg-muted rounded-lg overflow-y-auto">
                  {recommendations ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">{recommendations}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Your personalized recommendations will appear here...
                    </p>
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
