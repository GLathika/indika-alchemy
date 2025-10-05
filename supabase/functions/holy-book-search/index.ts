import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookName } = await req.json();
    
    if (!bookName || bookName.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Book name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert on religious texts and holy books from ALL religions practiced in India and worldwide. This includes:
- Hindu texts (Vedas, Upanishads, Bhagavad Gita, Ramayana, Mahabharata, Puranas, etc.)
- Islamic texts (Quran, Hadith collections, etc.)
- Christian texts (Bible - Old Testament, New Testament, etc.)
- Sikh texts (Guru Granth Sahib, etc.)
- Buddhist texts (Tripitaka, Dhammapada, etc.)
- Jain texts (Agamas, Tattvartha Sutra, etc.)
- Zoroastrian texts (Avesta, etc.)
- Jewish texts (Torah, Talmud, etc.)
- Any other religious or spiritual texts

When given a book name, provide comprehensive information in JSON format with the following structure:
{
  "title": "Full official name of the text",
  "originalLanguage": "Original language (e.g., Sanskrit, Pali, Arabic, Hebrew, etc.)",
  "period": "Time period or approximate date",
  "overview": "2-3 paragraphs describing the text's content, purpose, and historical context",
  "keyTeachings": ["teaching1", "teaching2", "teaching3", "teaching4", "teaching5"],
  "chapters": [
    {"title": "Chapter/Book name", "summary": "Brief summary of the chapter/section"},
    {"title": "Chapter/Book name", "summary": "Brief summary of the chapter/section"}
  ],
  "culturalSignificance": "1-2 paragraphs about the text's impact on culture, philosophy, and spirituality"
}

Provide detailed, accurate, and respectful information for ALL religious texts. If the book doesn't exist or you're not sure, respond with: {"error": "Holy book not found. Please check the name and try again."}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Provide detailed information about: ${bookName}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service unavailable. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get book information");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let bookInfo;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      bookInfo = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid response format from AI");
    }

    return new Response(
      JSON.stringify(bookInfo),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Holy book search error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
