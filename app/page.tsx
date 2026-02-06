'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
};

export default function Home() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user && profile) {
      loadChatHistory();
    }
  }, [user, profile]);

  const loadChatHistory = async () => {
    if (!user) return;

    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data && !error) {
      setMessages(data);
    }
    setLoadingHistory(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user || !profile) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      message: userMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    const { data: savedUserMessage, error: userError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        message: userMessage,
        role: 'user',
      })
      .select()
      .single();

    if (savedUserMessage && !userError) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempUserMessage.id ? savedUserMessage : msg))
      );
    }

    setTimeout(async () => {
      const aiResponse = `Atsakymas į "${userMessage}": Tai yra demonstracinis atsakymas. Vėliau čia bus integruota tikra AI API.`;

      const tempAiMessage: Message = {
        id: `temp-ai-${Date.now()}`,
        role: 'assistant',
        message: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempAiMessage]);

      const { data: savedAiMessage, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: aiResponse,
          role: 'assistant',
        })
        .select()
        .single();

      if (savedAiMessage && !aiError) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempAiMessage.id ? savedAiMessage : msg))
        );
      }

      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
              Trumpai ir aiškiai
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Gauk trumpus ir aiškius atsakymus į savo klausimus. Chatco - tai jūsų asmeninis AI asistentas lietuvių kalba.
            </p>
          </div>

          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-white">
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-chatco-pink/10 to-chatco-turquoise/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Prisijunkite norėdami naudotis Chatco
                </h2>
                <p className="text-gray-600 mb-6">
                  Sukurkite paskyrą ir gaukite 14 dienų nemokamą bandomąjį laikotarpį!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/prisijungti">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90 text-white px-8"
                    >
                      Prisijungti
                    </Button>
                  </Link>
                  <Link href="/apie">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-full border-2"
                    >
                      Sužinoti daugiau
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-chatco-pink/20 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-chatco-pink" />
                  </div>
                  <h3 className="font-semibold mb-2">Trumpi atsakymai</h3>
                  <p className="text-sm text-gray-600">Be nereikalingos informacijos</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-chatco-turquoise/20 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-chatco-turquoise" />
                  </div>
                  <h3 className="font-semibold mb-2">Lietuvių kalba</h3>
                  <p className="text-sm text-gray-600">Viskas jūsų kalba</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-chatco-peach/20 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-chatco-peach" />
                  </div>
                  <h3 className="font-semibold mb-2">Lengva naudoti</h3>
                  <p className="text-sm text-gray-600">Paprasta ir aiški sąsaja</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const canChat = profile?.subscription_status === 'trial' || profile?.subscription_status === 'active';

  if (!canChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20 flex items-center justify-center p-4">
        <Card className="p-8 max-w-lg bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Jūsų bandomasis laikotarpis baigėsi</h2>
            <p className="text-gray-600 mb-6">
              Norėdami toliau naudotis Chatco, pasirinkite planą.
            </p>
            <Link href="/planai">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90"
              >
                Peržiūrėti planus
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-white overflow-hidden">
          <div className="bg-gradient-to-r from-chatco-pink to-chatco-turquoise p-6">
            <h1 className="text-3xl font-bold text-white text-center">Chatco</h1>
            <p className="text-white/90 text-center mt-2">Trumpai ir aiškiai</p>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-chatco-pink" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="w-16 h-16 text-chatco-pink mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Pradėkite pokalbį!
                </h3>
                <p className="text-gray-500">
                  Užduokite klausimą ir gaukite trumpą bei aiškų atsakymą.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-chatco-pink to-chatco-peach text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-chatco-turquoise" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Įveskite savo klausimą..."
                className="flex-1 rounded-full border-2 focus:border-chatco-pink"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
