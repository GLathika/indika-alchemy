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
    const { festivalName } = await req.json();
    
    if (!festivalName) {
      return new Response(
        JSON.stringify({ error: 'Festival name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Searching for festival:', festivalName);

    const prompt = `As a cultural expert on Indian festivals, provide detailed information about the festival: "${festivalName}".

This can be ANY festival from ANY religion celebrated in India, including:
- Hindu festivals (Diwali, Holi, Navaratri, Pongal, Onam, Durga Puja, Ganesh Chaturthi, etc.)
- Islamic festivals (Eid ul-Fitr, Eid ul-Adha, Muharram, Ramadan, etc.)
- Christian festivals (Christmas, Easter, Good Friday, etc.)
- Sikh festivals (Baisakhi, Guru Nanak Jayanti, Lohri, etc.)
- Buddhist festivals (Buddha Purnima, Losar, Hemis Festival, etc.)
- Jain festivals (Mahavir Jayanti, Paryushana, Diwali, etc.)
- Regional festivals (Bihu, Makar Sankranti, Ugadi, etc.)
- National festivals (Republic Day, Independence Day, Gandhi Jayanti, etc.)

Please provide:
1. Full name of the festival
2. Religion/origin
3. Main regions where celebrated in India
4. Time of year (specific dates or period)
5. Historical background and origin story (2-3 paragraphs)
6. Religious/cultural significance
7. How to celebrate (detailed description of customs and rituals)
8. Key traditions and practices (list format)
9. Special foods prepared during the festival

Format the response as a JSON object with these exact fields:
{
  "name": "Festival name",
  "religion": "Religion/origin",
  "region": "Main regions",
  "timeOfYear": "When celebrated",
  "history": "Historical background and origin",
  "significance": "Religious/cultural significance",
  "howToCelebrate": "How people celebrate",
  "traditions": ["Tradition 1", "Tradition 2", ...],
  "specialFoods": "Special foods and their significance"
}

If this is not a recognized festival in India, return: { "error": "Festival not found or not celebrated in India" }`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: 'You are an expert on Indian festivals, culture, and religious traditions across all faiths. You provide accurate, detailed, and respectful information in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', { status: response.status });
      throw new Error('Failed to get festival information');
    }

    const data = await response.json();
    let festivalText = data.choices[0].message.content;
    
    // Clean up JSON response
    festivalText = festivalText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const festivalInfo = JSON.parse(festivalText);

    if (festivalInfo.error) {
      return new Response(
        JSON.stringify({ error: festivalInfo.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch a real image from Wikipedia/Wikimedia based on the festival name
    let imageUrl: string | null = null;
    try {
      const q = encodeURIComponent(`${festivalInfo.name} festival`);
      const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&format=json&origin=*`;
      const wikiRes = await fetch(wikiSearchUrl);
      const wikiData = await wikiRes.json();
      const first = wikiData.query?.search?.[0];
      if (first?.title) {
        const pageImagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(first.title)}&prop=pageimages&format=json&pithumbsize=1200&origin=*`;
        const pageImagesRes = await fetch(pageImagesUrl);
        const pageImagesData = await pageImagesRes.json();
        const pages = pageImagesData.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          imageUrl = pages[pageId]?.thumbnail?.source ?? null;
        }
      }

      // Fallback to Wikimedia Commons if needed
      if (!imageUrl) {
        const commonsSearchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${q}&srnamespace=6&srlimit=1&origin=*`;
        const commonsRes = await fetch(commonsSearchUrl);
        const commonsData = await commonsRes.json();
        if (commonsData.query?.search?.[0]?.title) {
          const imageTitle = commonsData.query.search[0].title;
          const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(imageTitle)}&origin=*`;
          const imageInfoRes = await fetch(imageInfoUrl);
          const imageInfoData = await imageInfoRes.json();
          const pages2 = imageInfoData.query?.pages;
          if (pages2) {
            const pid = Object.keys(pages2)[0];
            imageUrl = pages2[pid]?.imageinfo?.[0]?.url ?? null;
          }
        }
      }
    } catch (e) {
      console.error('Festival image fetch error:', e);
      imageUrl = null;
    }

    const result = { ...festivalInfo, imageUrl };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in festival-search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
