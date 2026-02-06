import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-chatco-pink/10 via-chatco-peach/10 to-chatco-turquoise/10 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-chatco-pink to-chatco-turquoise bg-clip-text text-transparent">
                Chatco
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Trumpai ir aiškiai - jūsų asmeninis AI asistentas lietuvių kalba. Gaukite greitus ir aiškius atsakymus į savo klausimus.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Puslapiai</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-chatco-pink transition-colors text-sm">
                  Pagrindinis
                </Link>
              </li>
              <li>
                <Link href="/apie" className="text-gray-600 hover:text-chatco-pink transition-colors text-sm">
                  Apie Chatco
                </Link>
              </li>
              <li>
                <Link href="/planai" className="text-gray-600 hover:text-chatco-pink transition-colors text-sm">
                  Planai
                </Link>
              </li>
              <li>
                <Link href="/kontaktai" className="text-gray-600 hover:text-chatco-pink transition-colors text-sm">
                  Kontaktai
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Informacija</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privatumo-politika" className="text-gray-600 hover:text-chatco-pink transition-colors text-sm">
                  Privatumo politika
                </Link>
              </li>
              <li>
                <Link href="/naudojimo-salygos" className="text-gray-600 hover:text-chatco-pink transition-colors text-sm">
                  Naudojimo sąlygos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Chatco. Visos teisės saugomos.
          </p>
        </div>
      </div>
    </footer>
  );
}
