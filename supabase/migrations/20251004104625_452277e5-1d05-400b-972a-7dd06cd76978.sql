-- Fix manuscripts public exposure by adding is_public column
ALTER TABLE public.manuscripts 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Update existing museum manuscripts to be public
UPDATE public.manuscripts 
SET is_public = true 
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Drop the overly permissive "Anyone can view manuscripts" policy
DROP POLICY IF EXISTS "Anyone can view manuscripts" ON public.manuscripts;

-- Create new policy that respects is_public flag
CREATE POLICY "Public and owned manuscripts viewable"
ON public.manuscripts
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Add missing UPDATE policy for ayurvedic_recommendations
CREATE POLICY "Users can update their own recommendations"
ON public.ayurvedic_recommendations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add missing UPDATE policy for sanskrit_translations
CREATE POLICY "Users can update their own translations"
ON public.sanskrit_translations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add updated_at column for audit tracking
ALTER TABLE public.ayurvedic_recommendations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public.sanskrit_translations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS set_updated_at_ayurvedic ON public.ayurvedic_recommendations;
CREATE TRIGGER set_updated_at_ayurvedic
  BEFORE UPDATE ON public.ayurvedic_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_sanskrit ON public.sanskrit_translations;
CREATE TRIGGER set_updated_at_sanskrit
  BEFORE UPDATE ON public.sanskrit_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();