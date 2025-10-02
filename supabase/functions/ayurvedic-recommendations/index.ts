import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, weight, symptoms, bodyType } = await req.json();
    
    if (!age || !symptoms) {
      throw new Error('Age and symptoms are required');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating Ayurvedic recommendations...');

    const prompt = `As an Ayurvedic health expert, provide personalized recommendations based on:
    - Age: ${age} years
    - Weight: ${weight || 'Not specified'} kg
    - Body Type (Dosha): ${bodyType || 'Not specified'}
    - Symptoms: ${symptoms}

    Please provide:
    1. Dosha analysis and balance recommendations
    2. Herbal remedies (with Sanskrit and English names)
    3. Dietary suggestions (foods to include/avoid)
    4. Lifestyle recommendations (daily routine, yoga, meditation)
    5. Seasonal considerations

    Format the response in a clear, structured manner suitable for a health dashboard.`;

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
            content: 'You are an expert Ayurvedic practitioner with deep knowledge of ancient Indian medicine, herbs, and holistic healing practices. Provide accurate, safe, and traditional Ayurvedic recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error('Failed to generate recommendations');
    }

    const data = await response.json();
    const recommendations = data.choices[0].message.content;

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        await supabase.from('ayurvedic_recommendations').insert({
          user_id: user.id,
          age,
          weight,
          symptoms,
          body_type: bodyType,
          recommendations
        });
      }
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ayurvedic-recommendations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
