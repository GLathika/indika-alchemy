import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const ayurvedicSchema = z.object({
  age: z.number().int().min(1, 'Age must be at least 1').max(150, 'Age must be less than 150'),
  weight: z.number().positive('Weight must be positive').max(500, 'Weight must be less than 500kg').optional(),
  symptoms: z.string().min(1, 'Symptoms are required').max(2000, 'Symptoms must be less than 2000 characters').trim(),
  bodyType: z.enum(['Vata', 'Pitta', 'Kapha', 'Mixed']).optional()
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input with Zod
    const validationResult = ayurvedicSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return new Response(
        JSON.stringify({ error: `Validation failed: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { age, weight, symptoms, bodyType } = validationResult.data;

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
      console.error('AI API error:', { status: response.status, statusText: response.statusText });
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
    // Sanitized error logging
    const errorInfo = error instanceof Error 
      ? { name: error.name, message: error.message }
      : { message: 'Unknown error' };
    console.error('Error in ayurvedic-recommendations function:', errorInfo);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
