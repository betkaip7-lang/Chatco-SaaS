'use client';

import { useEffect, useState } from 'react';
import { supabase, PricingPlan } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function PricingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (data && !error) {
      setPlans(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Kraunama...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
            Pasirinkite savo planą
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pradėkite nemokamai ir rinkitės planą, kuris jums tinka geriausiai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isPopular = index === 1;
            const features = Array.isArray(plan.features) ? plan.features : [];

            return (
              <Card
                key={plan.id}
                className={`p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl relative ${
                  isPopular ? 'border-4 border-chatco-turquoise transform md:scale-105' : 'border-2 border-white'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-chatco-pink to-chatco-turquoise text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Populiariausias
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-chatco-pink to-chatco-turquoise bg-clip-text text-transparent">
                      {plan.price === 0 ? 'Nemokamai' : `€${plan.price.toFixed(2)}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 text-sm">/ mėn.</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-chatco-turquoise/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-chatco-turquoise" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={user ? '/profilis' : '/prisijungti'}>
                  <Button
                    className={`w-full rounded-full ${
                      isPopular
                        ? 'bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    size="lg"
                  >
                    {user ? 'Valdyti prenumeratą' : 'Pradėti'}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Visi planai apima 14 dienų nemokamą bandomąjį laikotarpį.{' '}
            <br className="hidden sm:block" />
            Galite atšaukti bet kuriuo metu.
          </p>
        </div>
      </div>
    </div>
  );
}
