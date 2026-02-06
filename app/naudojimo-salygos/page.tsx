import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-chatco-pink/20 via-chatco-peach/20 to-chatco-turquoise/20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-chatco-pink to-chatco-turquoise mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-chatco-pink via-chatco-peach to-chatco-turquoise bg-clip-text text-transparent">
            Naudojimo sąlygos
          </h1>
          <p className="text-gray-600">Paskutinis atnaujinimas: 2024 m.</p>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Bendrosios nuostatos</h2>
              <p className="text-gray-600 leading-relaxed">
                Naudodamiesi Chatco paslaugomis, jūs sutinkate su šiomis naudojimo sąlygomis. Prašome atidžiai
                perskaityti šias sąlygas prieš naudojantis mūsų paslauga.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Paskyros kūrimas</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Norėdami naudotis Chatco, turite sukurti paskyrą. Jūs esate atsakingas už:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Tikslios informacijos pateikimą registracijos metu</li>
                <li>Savo paskyros saugumo užtikrinimą</li>
                <li>Visus veiksmus, atliktus naudojant jūsų paskyrą</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Paslaugų naudojimas</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Jūs sutinkate:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Naudoti Chatco tik teisėtais tikslais</li>
                <li>Nepažeisti kitų vartotojų teisių</li>
                <li>Neplatinti kenkėjiškos programinės įrangos</li>
                <li>Nepiktnaudžiauti paslaugomis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Prenumerata ir mokėjimai</h2>
              <p className="text-gray-600 leading-relaxed">
                Chatco siūlo įvairius prenumeratos planus. Mokėjimai tvarkomi per Stripe. Prenumeratą galite atšaukti
                bet kuriuo metu savo paskyros nustatymuose. Pinigai negrąžinami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Intelektinė nuosavybė</h2>
              <p className="text-gray-600 leading-relaxed">
                Visi Chatco turinys, dizainas ir funkcionalumas yra Chatco nuosavybė ir saugomi autorių teisių bei
                prekių ženklų įstatymais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Atsakomybės apribojimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Chatco teikiamas "kaip yra" pagrindu. Mes negalime garantuoti, kad paslauga bus visada prieinama,
                saugi ar be klaidų. Naudojatės savo rizika.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sąlygų keitimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Mes galime bet kuriuo metu pakeisti šias sąlygas. Apie svarbiausius pakeitimus informuosime
                el. paštu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kontaktai</h2>
              <p className="text-gray-600 leading-relaxed">
                Jei turite klausimų dėl šių sąlygų, susisiekite su mumis el. paštu:{' '}
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
