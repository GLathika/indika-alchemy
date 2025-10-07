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
    const { templeName } = await req.json();
    
    if (!templeName || templeName.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Temple name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a knowledgeable Indian architecture and history expert. When given an architectural site, monument, or structure name, provide detailed information in JSON format with the following structure:
{
  "name": "Full official name",
  "location": "City, State",
  "period": "Time period or year built",
  "history": "2-3 paragraphs of detailed historical information about its significance, construction, and cultural importance",
  "architecture": "Description of architectural style (e.g., Nagara, Dravidian, Mughal, Indo-Saracenic, Vesara, etc.) and unique features",
  "deity": "Main deity or religious significance OR ruler/founder (if applicable)",
  "features": ["feature1", "feature2", "feature3", "feature4"],
  "timings": "Visiting hours if known"
}

This can include ANY architectural site from India including:
- Ancient: Indus Valley sites, Buddhist stupas/caves, Hindu temples (Nagara/Dravidian/Vesara styles), Jain temples
- Medieval: Islamic/Indo-Islamic monuments, Mughal architecture, Rajput forts and palaces
- Colonial: Portuguese churches, British Indo-Saracenic buildings, Gothic revival architecture
- Modern: Contemporary temples, monuments like Statue of Unity, modern buildings

If the site doesn't exist or you're not sure, respond with: {"error": "Architecture site not found. Please check the name and try again."}`;

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
          { role: "user", content: `Provide detailed information about: ${templeName}` }
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
      throw new Error("Failed to get temple information");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let templeInfo;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      templeInfo = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid response format from AI");
    }

    // Fetch real image from Wikipedia/Wikimedia
    console.log("Fetching real image from Wikipedia...");
    try {
      // Search Wikipedia for the architecture site
      const searchQuery = encodeURIComponent(templeInfo.name);
      const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*`;
      
      const searchResponse = await fetch(wikiSearchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.query?.search?.length > 0) {
        const pageTitle = searchData.query.search[0].title;
        
        // Get the main image from the page
        const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=1000&origin=*`;
        const imageResponse = await fetch(imageUrl);
        const imageData = await imageResponse.json();
        
        const pages = imageData.query?.pages;
        const pageId = Object.keys(pages)[0];
        const thumbnailUrl = pages[pageId]?.thumbnail?.source;
        
        if (thumbnailUrl) {
          templeInfo.imageUrl = thumbnailUrl;
          console.log("Successfully fetched image from Wikipedia");
        } else {
          // Try Wikimedia Commons search as fallback
          const commonsSearchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*&srnamespace=6`;
          const commonsResponse = await fetch(commonsSearchUrl);
          const commonsData = await commonsResponse.json();
          
          if (commonsData.query?.search?.length > 0) {
            const fileName = commonsData.query.search[0].title;
            const fileInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
            const fileResponse = await fetch(fileInfoUrl);
            const fileData = await fileResponse.json();
            
            const filePages = fileData.query?.pages;
            const filePageId = Object.keys(filePages)[0];
            const imageUrl = filePages[filePageId]?.imageinfo?.[0]?.url;
            
            if (imageUrl) {
              templeInfo.imageUrl = imageUrl;
              console.log("Successfully fetched image from Wikimedia Commons");
            } else {
              templeInfo.imageUrl = null;
            }
          } else {
            templeInfo.imageUrl = null;
          }
        }
      } else {
        templeInfo.imageUrl = null;
      }
    } catch (imageError) {
      console.error("Failed to fetch real image:", imageError);
      templeInfo.imageUrl = null;
    }

    return new Response(
      JSON.stringify(templeInfo),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Temple search error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
