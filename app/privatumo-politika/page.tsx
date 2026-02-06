import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
            Privatumo politika
          </h1>
          <p className="text-gray-600">Paskutinis atnaujinimas: 2024 m.</p>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Įvadas</h2>
              <p className="text-gray-600 leading-relaxed">
                Chatco gerbia jūsų privatumą ir įsipareigoja apsaugoti jūsų asmens duomenis. Ši privatumo politika
                paaiškina, kaip mes renkame, naudojame ir saugome jūsų informaciją.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Renkami duomenys</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Mes renkame šiuos duomenis:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>El. pašto adresas ir vartotojo vardas (registracijos metu)</li>
                <li>Pokalbių istorija (kai naudojatės Chatco paslaugomis)</li>
                <li>Mokėjimo informacija (per Stripe)</li>
                <li>Slapukai ir naudojimo duomenys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Duomenų naudojimas</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Jūsų duomenis naudojame šiais tikslais:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Paslaugų teikimui ir pagerinimui</li>
                <li>Klausimų atsakymui ir palaikymui</li>
                <li>Mokėjimų tvarkymui</li>
                <li>Pranešimams siųsti</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Duomenų apsauga</h2>
              <p className="text-gray-600 leading-relaxed">
                Mes naudojame pramonės standartus atitinkančias saugumo priemones, kad apsaugotume jūsų duomenis
                nuo neteisėtos prieigos, atskleidimo, pakeitimo ar sunaikinimo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Jūsų teisės</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Jūs turite teisę:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Prieiti prie savo duomenų</li>
                <li>Taisyti neteisingus duomenis</li>
                <li>Ištrinti savo paskyrą ir duomenis</li>
                <li>Nesutikti su duomenų naudojimu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kontaktai</h2>
              <p className="text-gray-600 leading-relaxed">
                Jei turite klausimų dėl šios privatumo politikos, susisiekite su mumis el. paštu:{' '}
                <a href="mailto:info@chatco.lt" className="text-chatco-turquoise hover:underline">
                  info@chatco.lt
                </a>
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
