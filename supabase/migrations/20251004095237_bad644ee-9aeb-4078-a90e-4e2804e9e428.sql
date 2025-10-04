-- Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can view admins" ON public.admins;

-- Create a SECURITY DEFINER function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE admins.user_id = $1
  )
$$;

-- Create a new policy using the secure function
CREATE POLICY "Admins can view all admin records"
ON public.admins
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow admins to insert new admins
CREATE POLICY "Admins can insert admin records"
ON public.admins
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to delete admin records
CREATE POLICY "Admins can delete admin records"
ON public.admins
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));