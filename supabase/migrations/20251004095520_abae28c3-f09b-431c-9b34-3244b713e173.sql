-- Ensure unique user per admin
CREATE UNIQUE INDEX IF NOT EXISTS admins_user_id_idx ON public.admins(user_id);

-- Function to add admin by email (SECURITY DEFINER to access auth.users)
CREATE OR REPLACE FUNCTION public.add_admin_by_email(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = admin_email;
  IF uid IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  INSERT INTO public.admins(user_id)
  SELECT uid
  WHERE NOT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = uid
  );
END;
$$;

-- Function to list admins with emails
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT a.user_id, u.email
  FROM public.admins a
  JOIN auth.users u ON u.id = a.user_id
  ORDER BY u.email;
$$;