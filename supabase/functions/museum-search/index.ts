import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Searching for:', query);

    // First, get information about the place
    const infoPrompt = `As a cultural historian and architecture expert, provide detailed information about: "${query}".

This can be ANY religious site, temple, mosque, church, gurdwara, monastery, monument, or architectural wonder from ANY religion in India, including:
- Hindu temples (ancient and modern)
- Islamic mosques and monuments (including Taj Mahal, Qutub Minar, etc.)
- Christian churches and cathedrals
- Sikh gurdwaras
- Buddhist monasteries and stupas
- Jain temples
- Zoroastrian fire temples
- Jewish synagogues
- Archaeological sites and historical monuments

Please provide:
1. Full name and location in India
2. Historical period/era of construction
3. Detailed history (2-3 paragraphs about its origins, significance, and historical events)
4. Architectural style and features (describe the design, materials, unique elements)
5. Religious/cultural significance
6. Associated deity/saint/dedication (if applicable)

Format the response as a JSON object with these exact fields:
{
  "name": "Full name",
  "location": "City, State",
  "period": "Construction period",
  "history": "Detailed history text",
  "architecture": "Architectural description",
  "culturalSignificance": "Cultural significance",
  "deity": "Deity/dedication if applicable",
  "religion": "Religion/faith",
  "imageDescription": "A detailed description for generating an image"
}

If this is not a recognized place in India, return: { "error": "Place not found or not in India" }`;

    const infoResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert on Indian architecture, history, and religious sites across all faiths. You provide accurate, detailed information in JSON format.'
          },
          {
            role: 'user',
            content: infoPrompt
          }
        ],
      }),
    });

    if (!infoResponse.ok) {
      console.error('Info API error:', { status: infoResponse.status });
      throw new Error('Failed to get information');
    }

    const infoData = await infoResponse.json();
    let infoText = infoData.choices[0].message.content;
    
    // Clean up JSON response
    infoText = infoText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const placeInfo = JSON.parse(infoText);

    if (placeInfo.error) {
      return new Response(
        JSON.stringify({ error: placeInfo.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating image for:', placeInfo.name);

    // Generate an image
    const imagePrompt = `Create a detailed, photorealistic 3D architectural visualization of ${placeInfo.name} in ${placeInfo.location}, India. 
    
Capture the essence of this ${placeInfo.religion} site with:
- Accurate architectural details from the ${placeInfo.period}
- Traditional ${placeInfo.architecture}
- Cultural and religious elements
- Beautiful lighting to highlight the monument's grandeur
- Surrounding environment typical of its location

Style: Ultra high resolution, photorealistic architectural photography, cinematic lighting, wide angle view showing the full majesty of the structure.`;

    const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: imagePrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!imageResponse.ok) {
      console.error('Image generation error:', { status: imageResponse.status });
      // Return info without image if image generation fails
      return new Response(
        JSON.stringify(placeInfo),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    return new Response(
      JSON.stringify({
        ...placeInfo,
        imageData: imageUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in museum-search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
