'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, ContentSection, Profile, PricingPlan } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users as UsersIcon, DollarSign, FileText, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function AdminPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/prisijungti');
      return;
    }

    if (profile && profile.role !== 'admin') {
      router.push('/');
      return;
    }

    if (profile && profile.role === 'admin') {
      loadData();
    }
  }, [user, profile, router]);

  const loadData = async () => {
    setLoading(true);

    const [contentData, usersData, plansData] = await Promise.all([
      supabase.from('content_sections').select('*').order('section_key'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('pricing_plans').select('*').order('sort_order'),
    ]);

    if (contentData.data) {
      setContentSections(contentData.data);
      const contentMap: Record<string, string> = {};
      contentData.data.forEach((item) => {
        contentMap[item.section_key] = item.section_content;
      });
      setEditedContent(contentMap);
    }

    if (usersData.data) setUsers(usersData.data);
    if (plansData.data) setPlans(plansData.data);

    setLoading(false);
  };

  const handleSaveContent = async (sectionKey: string) => {
    setSaving(true);

    const { error } = await supabase
      .from('content_sections')
      .update({ section_content: editedContent[sectionKey] })
      .eq('section_key', sectionKey);

    if (error) {
      toast.error('Klaida išsaugant turinį');
    } else {
      toast.success('Turinys išsaugotas!');
      await loadData();
    }

    setSaving(false);
  };

  if (loading || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-chatco-pink" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Valdykite svetainės turinį ir vartotojus</p>
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="content">
                <FileText className="w-4 h-4 mr-2" />
                Turinys
              </TabsTrigger>
              <TabsTrigger value="users">
                <UsersIcon className="w-4 h-4 mr-2" />
                Vartotojai
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="w-4 h-4 mr-2" />
                Planai
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="space-y-6">
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Redaguoti turinį</h2>
                  <div className="space-y-6">
                    {contentSections.map((section) => (
                      <div key={section.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {section.section_key}
                        </label>
                        {section.section_type === 'text' ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editedContent[section.section_key] || ''}
                              onChange={(e) =>
                                setEditedContent({
                                  ...editedContent,
                                  [section.section_key]: e.target.value,
                                })
                              }
                              className="rounded-xl border-2 min-h-[100px]"
                            />
                            <Button
                              onClick={() => handleSaveContent(section.section_key)}
                              disabled={saving}
                              className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise"
                              size="sm"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Išsaugoti
                            </Button>
                          </div>
                        ) : section.section_type === 'json' ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editedContent[section.section_key] || ''}
                              onChange={(e) =>
                                setEditedContent({
                                  ...editedContent,
                                  [section.section_key]: e.target.value,
                                })
                              }
                              className="rounded-xl border-2 min-h-[150px] font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500">JSON formatas</p>
                            <Button
                              onClick={() => handleSaveContent(section.section_key)}
                              disabled={saving}
                              className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise"
                              size="sm"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Išsaugoti
                            </Button>
                          </div>
                        ) : (
                          <Input
                            value={editedContent[section.section_key] || ''}
                            onChange={(e) =>
                              setEditedContent({
                                ...editedContent,
                                [section.section_key]: e.target.value,
                              })
                            }
                            className="rounded-xl border-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Vartotojai</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Vartotojo vardas</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rolė</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Statusas</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Registracija</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-800">{u.username || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u.role === 'admin'
                                  ? 'bg-chatco-pink/20 text-chatco-pink'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {u.role === 'admin' ? 'Admin' : 'Vartotojas'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u.subscription_status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : u.subscription_status === 'trial'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {u.subscription_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {new Date(u.created_at).toLocaleDateString('lt-LT')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Kainodaros planai</h2>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:border-chatco-turquoise transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                          <p className="text-2xl font-bold text-chatco-turquoise">
                            €{plan.price.toFixed(2)} / {plan.interval === 'month' ? 'mėn.' : 'metai'}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            plan.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {plan.is_active ? 'Aktyvus' : 'Neaktyvus'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">Funkcijos:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  Norėdami redaguoti planus, naudokite Supabase admin sąsają arba SQL užklausas.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
