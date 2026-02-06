'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function ContactPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .in('section_key', [
        'contact_email',
        'contact_phone',
        'contact_address',
        'contact_intro',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('contact_submissions').insert({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    if (error) {
      toast.error('Klaida siunčiant žinutę. Bandykite dar kartą.');
    } else {
      toast.success('Žinutė išsiųsta sėkmingai!');
      setFormData({ name: '', email: '', message: '' });
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Kraunama...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
              Susisiek su mumis
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.contact_intro ||
                'Turite klausimų ar pasiūlymų? Susisiekite su mumis!'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Kontaktinė informacija
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-chatco-pink/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-chatco-pink" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">El. paštas</h3>
                    <a
                      href={`mailto:${content.contact_email || 'info@chatco.lt'}`}
                      className="text-chatco-turquoise hover:underline"
                    >
                      {content.contact_email || 'info@chatco.lt'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-chatco-turquoise/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-chatco-turquoise" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Telefonas</h3>
                    <a
                      href={`tel:${content.contact_phone?.replace(/\s/g, '') || '+37060000000'}`}
                      className="text-chatco-turquoise hover:underline"
                    >
                      {content.contact_phone || '+370 600 00000'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-chatco-peach/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-chatco-peach" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Adresas</h3>
                    <p className="text-gray-600">
                      {content.contact_address || 'Vilnius, Lietuva'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Parašykite mums
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Vardas
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-xl border-2"
                    placeholder="Jūsų vardas"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    El. paštas
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-xl border-2"
                    placeholder="jusu@email.lt"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Žinutė
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="rounded-xl border-2 min-h-[150px]"
                    placeholder="Jūsų žinutė..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Siunčiama...' : 'Siųsti žinutę'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
