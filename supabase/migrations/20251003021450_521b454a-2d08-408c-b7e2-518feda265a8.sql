-- Allow public read access to manuscripts for the museum
CREATE POLICY "Anyone can view manuscripts"
ON public.manuscripts
FOR SELECT
USING (true);