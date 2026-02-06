'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Sparkles, Users, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .in('section_key', [
        'about_title',
        'about_content',
        'about_who_title',
        'about_who_content',
        'about_benefits_title',
        'about_benefits_content',
      ]);

    if (data && !error) {
      const contentMap: Record<string, string> = {};
      data.forEach((item) => {
        contentMap[item.section_key] = item.section_content;
      });
      setContent(contentMap);
    }
    setLoading(false);
  };

  const benefits = content.about_benefits_content
    ? JSON.parse(content.about_benefits_content)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Kraunama...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
            Apie Chatco
          </h1>
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {content.about_title || 'Kas yra Chatco?'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {content.about_content ||
                'Chatco - tai moderna AI pokalbių platforma, sukurta lietuviams vartotojams.'}
            </p>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-chatco-turquoise/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-chatco-turquoise" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {content.about_who_title || 'Kam skirta Chatco?'}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {content.about_who_content ||
                'Chatco skirta visiems, kuriems reikia greito ir aiškaus atsakymo.'}
            </p>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-chatco-peach/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-chatco-peach" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {content.about_benefits_title || 'Privalumai'}
              </h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-chatco-pink mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
