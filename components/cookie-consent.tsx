'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <Cookie className="w-6 h-6 text-chatco-pink flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Slapukai</h3>
              <p className="text-sm text-gray-600">
                Mes naudojame slapukus, kad pagerintume jūsų patirtį mūsų svetainėje. Tęsdami naršymą, jūs sutinkate su mūsų{' '}
                <a href="/privatumo-politika" className="text-chatco-pink underline hover:text-chatco-turquoise">
                  privatumo politika
                </a>.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button
              onClick={declineCookies}
              variant="outline"
              size="sm"
              className="rounded-full flex-1 sm:flex-none"
            >
              Atmesti
            </Button>
            <Button
              onClick={acceptCookies}
              size="sm"
              className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90 flex-1 sm:flex-none"
            >
              Priimti
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
