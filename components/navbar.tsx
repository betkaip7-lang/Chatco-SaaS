'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Chatco' },
    { href: '/apie', label: 'Apie Chatco' },
    { href: '/planai', label: 'Planai' },
    { href: '/kontaktai', label: 'Susisiek su mumis' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-chatco-pink to-chatco-turquoise bg-clip-text text-transparent">
                Chatco
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-chatco-pink text-chatco-pink bg-opacity-20'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && profile ? (
              <div className="flex items-center space-x-4">
                {profile.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="rounded-full">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/profilis">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <User className="w-4 h-4 mr-2" />
                    {profile.username || 'Profilis'}
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/prisijungti">
                <Button className="rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise hover:opacity-90">
                  Prisijungti
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-chatco-pink text-chatco-pink bg-opacity-20'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              {user && profile ? (
                <div className="space-y-2">
                  {profile.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full rounded-full">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/profilis" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full rounded-full">
                      <User className="w-4 h-4 mr-2" />
                      {profile.username || 'Profilis'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/prisijungti" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full bg-gradient-to-r from-chatco-pink to-chatco-turquoise">
                    Prisijungti
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
