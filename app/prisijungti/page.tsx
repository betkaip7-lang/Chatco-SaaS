'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      toast.error('Neteisingas el. paštas arba slaptažodis');
    } else {
      toast.success('Sėkmingai prisijungėte!');
      router.push('/');
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Slaptažodžiai nesutampa');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Slaptažodis turi būti bent 6 simbolių ilgio');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          username: signupData.username,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Paskyra sukurta! Prisijunkite.');
      setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
    }

    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!loginData.email) {
      toast.error('Įveskite savo el. paštą');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(loginData.email);

    if (error) {
      toast.error('Klaida siunčiant slaptažodžio atkūrimo nuorodą');
    } else {
      toast.success('Slaptažodžio atkūrimo nuoroda išsiųsta į el. paštą');
    }

    setLoading(false);
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
              Sveiki sugrįžę!
            </h1>
            <p className="text-gray-600">Prisijunkite arba sukurkite paskyrą</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Prisijungti</TabsTrigger>
              <TabsTrigger value="signup">Registruotis</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    El. paštas
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="rounded-xl border-2"
                    placeholder="jusu@email.lt"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Slaptažodis
                  </label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="rounded-xl border-2 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-chatco-turquoise hover:text-chatco-pink p-0 h-auto"
                  onClick={handlePasswordReset}
                  disabled={loading}
                >
                  Pamiršote slaptažodį?
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Prisijungti
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Vartotojo vardas
                  </label>
                  <Input
                    id="signup-username"
                    type="text"
                    required
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                    className="rounded-xl border-2"
                    placeholder="vartotojas"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    El. paštas
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="rounded-xl border-2"
                    placeholder="jusu@email.lt"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Slaptažodis
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="rounded-xl border-2"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Patvirtinkite slaptažodį
                  </label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="rounded-xl border-2"
                    placeholder="••••••••"
                  />
                </div>

                <p className="text-xs text-gray-600">
                  Registruodamiesi, sutinkate su{' '}
                  <Link href="/naudojimo-salygos" className="text-chatco-turquoise hover:underline">
                    naudojimo sąlygomis
                  </Link>{' '}
                  ir{' '}
                  <Link href="/privatumo-politika" className="text-chatco-turquoise hover:underline">
                    privatumo politika
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registruotis
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}
