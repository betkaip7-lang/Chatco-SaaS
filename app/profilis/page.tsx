'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, LogOut, Calendar, CreditCard, Loader2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/prisijungti');
      return;
    }
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [user, profile, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleUpdateUsername = async () => {
    if (!user || !username.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim() })
      .eq('id', user.id);

    if (error) {
      toast.error('Klaida atnaujinant vartotojo vardą');
    } else {
      toast.success('Vartotojo vardas atnaujintas!');
      await refreshProfile();
      setEditMode(false);
    }

    setLoading(false);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-chatco-pink" />
      </div>
    );
  }

  const trialEndDate = profile.trial_end_date
    ? new Date(profile.trial_end_date)
    : null;
  const daysLeft = trialEndDate
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
              Mano profilis
            </h1>
          </div>

          <div className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center space-x-2">
                <User className="w-6 h-6 text-chatco-pink" />
                <span>Paskyros informacija</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vartotojo vardas
                  </label>
                  {editMode ? (
                    <div className="flex space-x-2">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="rounded-xl border-2"
                        placeholder="Vartotojo vardas"
                      />
                      <Button
                        onClick={handleUpdateUsername}
                        disabled={loading}
                        className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Išsaugoti'}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          setUsername(profile.username || '');
                        }}
                        variant="outline"
                        className="rounded-full"
                      >
                        Atšaukti
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-800">{profile.username || 'Nenustatyta'}</span>
                      <Button
                        onClick={() => setEditMode(true)}
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    El. paštas
                  </label>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rolė
                  </label>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <span className="text-gray-800 capitalize">
                      {profile.role === 'admin' ? 'Administratorius' : 'Vartotojas'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-chatco-turquoise" />
                <span>Prenumerata</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Statusas:</span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      profile.subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : profile.subscription_status === 'trial'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profile.subscription_status === 'trial'
                      ? 'Bandomasis laikotarpis'
                      : profile.subscription_status === 'active'
                      ? 'Aktyvi'
                      : 'Neaktyvi'}
                  </span>
                </div>

                {profile.subscription_status === 'trial' && trialEndDate && (
                  <div className="bg-gradient-to-r from-chatco-pink/10 to-chatco-turquoise/10 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-chatco-pink" />
                      <span className="font-semibold text-gray-800">
                        Bandomasis laikotarpis baigiasi
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {trialEndDate.toLocaleDateString('lt-LT')} (liko {daysLeft} d.)
                    </p>
                    <Link href="/planai">
                      <Button className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90">
                        Pasirinkti planą
                      </Button>
                    </Link>
                  </div>
                )}

                {profile.subscription_status === 'active' && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                    <p className="text-gray-800">
                      Jūsų prenumerata yra aktyvi. Ačiū, kad naudojatės Chatco!
                    </p>
                  </div>
                )}

                {profile.subscription_status === 'inactive' && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-gray-700 mb-4">
                      Jūsų bandomasis laikotarpis baigėsi. Pasirinkite planą, kad galėtumėte toliau naudotis Chatco.
                    </p>
                    <Link href="/planai">
                      <Button className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90">
                        Peržiūrėti planus
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {profile.role === 'admin' && (
              <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-chatco-turquoise">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Administravimas
                </h2>
                <p className="text-gray-600 mb-4">
                  Jūs turite administratoriaus teises. Galite valdyti svetainės turinį ir vartotojus.
                </p>
                <Link href="/admin">
                  <Button className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90">
                    Atidaryti admin skydelį
                  </Button>
                </Link>
              </Card>
            )}

            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full rounded-full"
                size="lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Atsijungti
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
