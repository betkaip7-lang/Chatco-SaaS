import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uisskmzhgprnfeppbqoa.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ir5RhRbWSWQ_DCdCqz5QQQ_8tHvLWD5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string | null;
  role: string;
  trial_end_date: string | null;
  subscription_status: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
};

export type ContentSection = {
  id: string;
  section_key: string;
  section_content: string;
  section_type: string;
  created_at: string;
  updated_at: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  stripe_price_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};
