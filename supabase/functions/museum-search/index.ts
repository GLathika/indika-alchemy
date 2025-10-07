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

    // First, get information about the museum
    const infoPrompt = `As a museum expert, provide detailed information about: "${query}".

This should ONLY be a MUSEUM in India, including:

MUSEUMS IN INDIA:
- National Museum (New Delhi) - India's largest museum with artifacts from prehistoric to modern times
- Indian Museum (Kolkata) - Oldest museum in India with rare collections
- Chhatrapati Shivaji Maharaj Vastu Sangrahalaya / CSMVS (Mumbai) - Art, archaeology, natural history
- Salar Jung Museum (Hyderabad) - One of the largest museums with global art collections
- National Gallery of Modern Art / NGMA (Delhi, Mumbai, Bangalore) - Modern and contemporary Indian art
- Dr. Bhau Daji Lad Museum (Mumbai) - Decorative arts and industrial arts
- Government Museum (Chennai/Egmore Museum) - Bronze gallery, archaeological artifacts
- Shankar's International Dolls Museum (Delhi) - Dolls from around the world
- Victoria Memorial Hall (Kolkata) - British colonial history and art
- Birla Industrial & Technological Museum (Kolkata) - Science and technology
- Tribal Museums (Bhopal, Odisha, Chhattisgarh) - Indigenous cultures
- Railway Museums (Delhi, Mysore) - Railway heritage
- Regional museums, specialized museums, art galleries
- State museums, archaeological museums, folk art museums

If the query is NOT a museum in India, return: { "error": "This is not a museum in India. Please search for museums only." }

Please provide:
1. Full name and location in India
2. Establishment year and historical period
3. Detailed history (2-3 paragraphs about its origins, significance, and evolution)
4. Collections and exhibits (describe major galleries, notable artifacts, and special collections)
5. Architectural style of the building (if notable)
6. Cultural and historical significance
7. Founder or key benefactors
8. Visiting information (timings, entry fees if known)

Format the response as a JSON object with these exact fields:
{
  "name": "Full name",
  "location": "City, State",
  "period": "Establishment year",
  "history": "Detailed history text",
  "collections": "Description of collections, exhibits, and galleries",
  "architecture": "Architectural description of the museum building",
  "culturalSignificance": "Cultural/historical significance",
  "founder": "Founder or key benefactors",
  "type": "Museum",
  "imageDescription": "A detailed description for generating an image"
}

If this is not a museum in India, return: { "error": "This is not a museum in India. Please search for museums only." }`;

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
        content: 'You are an expert on Indian museums and cultural institutions. You provide accurate, detailed information ONLY about museums in India in JSON format. If asked about temples, monuments, or other non-museum sites, you return an error.'
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

    // Enforce museum-only results
    if ((placeInfo.type || '').toLowerCase() !== 'museum') {
      return new Response(
        JSON.stringify({ error: 'This is not a museum in India. Please search for museums only.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating image for:', placeInfo.name);

    // Generate museum image with a clear 3D-perspective render
    const imagePrompt = `Create a highly realistic 3D-perspective architectural render of ${placeInfo.name} in ${placeInfo.location}, India.

Include only the actual museum building and its authentic architectural details.

Requirements:
- Exterior facade and entrance captured from a three-quarter angle (3D perspective)
- Style and materials consistent with the period: ${placeInfo.period}
- Architectural style: ${placeInfo.architecture}
- Subtle presence of visitors for scale (no crowds)
- Natural lighting (late afternoon) to emphasize depth and shadows
- Surrounding elements that truly exist at the site (avoid fictional features)
- Signage consistent with the real museum when visible
- Additional details to guide accuracy: ${placeInfo.imageDescription || 'Focus on the museum’s real-world appearance'}

Constraints:
- Do NOT invent futuristic elements or non-existent additions
- Do NOT show interiors; show exterior building with depth and shadowing

Output: Ultra high resolution, photorealistic, crisp, architectural visualization.`;

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
