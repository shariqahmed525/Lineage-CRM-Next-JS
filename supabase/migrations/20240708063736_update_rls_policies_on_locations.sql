-- Enable row level security on the locations table
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS delete_location ON public.locations;
DROP POLICY IF EXISTS insert_location ON public.locations;
DROP POLICY IF EXISTS select_location ON public.locations;
DROP POLICY IF EXISTS update_location ON public.locations;

-- Create new policies
CREATE POLICY delete_location
ON public.locations
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY insert_location
ON public.locations
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY select_location
ON public.locations
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY update_location
ON public.locations
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());