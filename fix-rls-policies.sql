-- Fix RLS policies for verification code registration
-- This script should be run on the existing database to allow user registration via verification codes

-- Drop existing restrictive policies for users table
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create new policies that allow public access for registration
CREATE POLICY "Allow public insert for registration" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select by email" ON public.users FOR SELECT USING (true);

-- Keep existing policies for authenticated users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Also fix user_visas and user_favorites policies to allow public access for new users
DROP POLICY IF EXISTS "Users can insert own visas" ON public.user_visas;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;

CREATE POLICY "Allow public insert visas" ON public.user_visas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert favorites" ON public.user_favorites FOR INSERT WITH CHECK (true);

-- Keep existing policies for authenticated users
CREATE POLICY "Users can view own visas" ON public.user_visas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own visas" ON public.user_visas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own visas" ON public.user_visas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

SELECT 'RLS policies fixed successfully!' as status;
