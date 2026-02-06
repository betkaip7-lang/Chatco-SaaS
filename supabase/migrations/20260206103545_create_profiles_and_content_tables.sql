/*
  # Initial Chatco Database Setup
  
  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `role` (text, default 'user') - either 'user' or 'admin'
      - `trial_end_date` (timestamptz) - 14 days from signup
      - `subscription_status` (text) - 'trial', 'active', 'inactive', 'cancelled'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `content_sections`
      - `id` (uuid, primary key)
      - `section_key` (text, unique) - identifier like 'homepage_slogan', 'about_page_intro'
      - `section_content` (text) - the actual content
      - `section_type` (text) - 'text', 'html', 'json'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `message` (text)
      - `role` (text) - 'user' or 'assistant'
      - `created_at` (timestamptz)
    
    - `pricing_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (decimal)
      - `currency` (text, default 'EUR')
      - `interval` (text) - 'month', 'year'
      - `features` (jsonb) - array of feature strings
      - `stripe_price_id` (text, nullable)
      - `is_active` (boolean, default true)
      - `sort_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, unique)
      - `plan_id` (uuid, references pricing_plans)
      - `status` (text) - 'active', 'cancelled', 'past_due'
      - `stripe_subscription_id` (text, nullable)
      - `stripe_customer_id` (text, nullable)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for admin users to access all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  role text NOT NULL DEFAULT 'user',
  trial_end_date timestamptz,
  subscription_status text NOT NULL DEFAULT 'trial',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create content_sections table
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  section_content text NOT NULL,
  section_type text NOT NULL DEFAULT 'text',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content sections"
  ON content_sections FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert content sections"
  ON content_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update content sections"
  ON content_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  interval text NOT NULL,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  stripe_price_id text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing plans"
  ON pricing_plans FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can insert pricing plans"
  ON pricing_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update pricing plans"
  ON pricing_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES pricing_plans(id),
  status text NOT NULL,
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, trial_end_date, subscription_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW() + INTERVAL '14 days',
    'trial'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default content sections
INSERT INTO content_sections (section_key, section_content, section_type) VALUES
  ('homepage_slogan', 'Trumpai ir aiškiai', 'text'),
  ('homepage_description', 'Gauk trumpus ir aiškius atsakymus į savo klausimus. Chatco - tai jūsų asmeninis AI asistentas lietuvių kalba.', 'text'),
  ('about_title', 'Kas yra Chatco?', 'text'),
  ('about_content', 'Chatco - tai moderna AI pokalbių platforma, sukurta lietuviams vartotojams. Mes teikiame trumpus, aiškius ir tikslus atsakymus į jūsų klausimus. Nesvarbu, ar esate studentas, profesionalas ar kasdieninis vartotojas - Chatco padės jums sutaupyti laiko ir gauti reikiamą informaciją greitai.', 'text'),
  ('about_who_title', 'Kam skirta Chatco?', 'text'),
  ('about_who_content', 'Chatco skirta visiems, kuriems reikia greito ir aiškaus atsakymo: studentams, ieškančiams pagalbos su namų darbais; profesionalams, kuriems reikia greitų atsakymų darbe; kasdieniniams vartotojams, turintiems klausimų apie įvairias temas.', 'text'),
  ('about_benefits_title', 'Privalumai', 'text'),
  ('about_benefits_content', '["Trumpi ir aiškūs atsakymai", "Sutaupo jūsų laiką", "Lengva naudoti", "Lietuvių kalba", "Prieinamas visur"]', 'json'),
  ('contact_email', 'info@chatco.lt', 'text'),
  ('contact_phone', '+370 600 00000', 'text'),
  ('contact_address', 'Vilnius, Lietuva', 'text'),
  ('contact_intro', 'Turite klausimų ar pasiūlymų? Susisiekite su mumis!', 'text')
ON CONFLICT (section_key) DO NOTHING;

-- Insert default pricing plans
INSERT INTO pricing_plans (name, price, currency, interval, features, sort_order) VALUES
  ('Nemokama Bandomoji', 0, 'EUR', 'trial', '["14 dienų nemokama", "Neriboti pokalbiai", "Lietuvių kalba", "Pagrindinės funkcijos"]'::jsonb, 1),
  ('Pagrindinis', 9.99, 'EUR', 'month', '["Neriboti pokalbiai", "Lietuvių kalba", "Prioritetinė pagalba", "Pokalbių istorija", "Mobilios aplikacijos prieiga"]'::jsonb, 2),
  ('Profesionalus', 19.99, 'EUR', 'month', '["Viskas iš Pagrindinio", "Išplėstinės AI funkcijos", "API prieiga", "Prioritetinis palaikymas 24/7", "Pokalbių eksportavimas"]'::jsonb, 3)
ON CONFLICT DO NOTHING;