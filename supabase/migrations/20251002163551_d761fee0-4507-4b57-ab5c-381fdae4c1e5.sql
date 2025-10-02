-- Create manuscripts table for digital preservation
CREATE TABLE public.manuscripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  enhanced_image_url TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;

-- Create policies for manuscripts
CREATE POLICY "Users can view their own manuscripts" 
ON public.manuscripts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own manuscripts" 
ON public.manuscripts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own manuscripts" 
ON public.manuscripts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own manuscripts" 
ON public.manuscripts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create sanskrit_translations table
CREATE TABLE public.sanskrit_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sanskrit_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for translations
CREATE POLICY "Users can view their own translations" 
ON public.sanskrit_translations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own translations" 
ON public.sanskrit_translations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own translations" 
ON public.sanskrit_translations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create ayurvedic_recommendations table
CREATE TABLE public.ayurvedic_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  age INTEGER,
  weight DECIMAL,
  symptoms TEXT,
  body_type TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ayurvedic_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.ayurvedic_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
ON public.ayurvedic_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations" 
ON public.ayurvedic_recommendations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for manuscripts
INSERT INTO storage.buckets (id, name, public)
VALUES ('manuscripts', 'manuscripts', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for manuscript storage
CREATE POLICY "Users can upload manuscripts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view manuscripts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manuscripts');

CREATE POLICY "Users can update their own manuscripts" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own manuscripts" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);