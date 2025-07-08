import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <SEO 
        title="Termeni și Condiții - Imobiliare Altfel"
        description="Termenii și condițiile de utilizare ale serviciilor Imobiliare Altfel. Politica de confidențialitate și protecția datelor personale."
        keywords={[
          'imobiliare Arad',
          'agenție imobiliară Arad',
          'servicii imobiliare premium',
          'imobiliare altfel Arad',
          'termeni și condiții imobiliare',
          'politică de confidențialitate',
          'protecția datelor personale',
          'consultanță imobiliară Arad',
          'servicii imobiliare Arad',
          'agenție imobiliară multilingvă'
        ]}
      />
      {/* Hero Section */}
      <section className="bg-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Politica de Confidențialitate</h1>
            <p className="text-purple-100">
              Protejăm confidențialitatea vizitatorilor noștri și ne angajăm să protejăm datele personale
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-purple">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-sm text-gray-600 mb-8">
                Ultima actualizare: 22. 01. 2025
              </div>

              <p className="lead">
                La Imobiliare Altfel, accesibilă de pe www.imobiliarealtfel.ro, respectăm confidențialitatea vizitatorilor noștri și ne angajăm să protejăm datele personale colectate prin intermediul site-ului nostru. Această Politică de Confidențialitate explică modul în care colectăm, utilizăm și protejăm informațiile dumneavoastră.
              </p>

              <h2>1. Colectarea datelor personale</h2>
              <p>Categoriile de date personale pe care le putem colecta includ:</p>
              <ul>
                <li>Nume și prenume</li>
                <li>Adresă de e-mail</li>
                <li>Număr de telefon</li>
                <li>Adresă poștală</li>
                <li>Informații despre proprietățile care vă interesează</li>
                <li>Orice alte informații pe care ni le furnizați voluntar prin formularele de contact sau prin comunicări directe.</li>
              </ul>

              <h2>2. Scopul colectării datelor</h2>
              <p>Utilizăm datele personale pentru următoarele scopuri:</p>
              <ul>
                <li>Contactarea și furnizarea de informații despre proprietățile disponibile</li>
                <li>Personalizarea experienței utilizatorului</li>
                <li>Trimiterea de oferte personalizate</li>
                <li>Respectarea obligațiilor legale</li>
              </ul>

              <h2>3. Partajarea datelor personale</h2>
              <p>
                Nu vindem, nu schimbăm și nu transferăm datele personale către terțe părți fără consimțământul dumneavoastră, cu excepția cazurilor prevăzute de lege sau atunci când este necesar pentru furnizarea serviciilor contractate.
              </p>

              <h2>4. Securitatea datelor</h2>
              <p>
                Luăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor personale împotriva accesului neautorizat, pierderii, distrugerii sau divulgării accidentale.
              </p>

              <h2>5. Drepturile utilizatorului</h2>
              <p>Aveți următoarele drepturi conform legislației aplicabile privind protecția datelor cu caracter personal:</p>
              <ul>
                <li>Dreptul de acces la datele dumneavoastră personale</li>
                <li>Dreptul de rectificare a datelor incorecte</li>
                <li>Dreptul de ștergere a datelor</li>
                <li>Dreptul de a restricționa prelucrarea</li>
                <li>Dreptul de a obiecta la prelucrare</li>
                <li>Dreptul la portabilitatea datelor</li>
              </ul>

              <p>
                Pentru exercitarea acestor drepturi, ne puteți contacta la adresa de e-mail: cordea@gmail.com
              </p>

              <h2>6. Module cookie</h2>
              <p>
                Site-ul nostru utilizează cookie-uri pentru a oferi o experiență personalizată utilizatorilor. Puteți gestiona preferințele privind cookie-urile prin setările browserului dumneavoastră.
              </p>

              <h2>7. Modificări ale politicii de confidențialitate</h2>
              <p>
                Ne rezervăm dreptul de a actualiza această Politică de Confidențialitate periodic. Orice modificări vor fi publicate pe această pagină.
              </p>

              <h2>8. Contact</h2>
              <p>
                Pentru orice întrebări sau solicitări referitoare la politica noastră de confidențialitate, ne puteți contacta la:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Imobiliare Altfel</strong></p>
                <p>Adresă: Arad, Calea Bodrogului Nr 10</p>
                <p>E-mail: cordea@gmail.com</p>
                <p>Telefon: 0371 236 023</p>
              </div>

              <div className="mt-8 text-gray-600">
                <p>
                  Prin utilizarea site-ului nostru, sunteți de acord cu practicile descrise în această Politică de Confidențialitate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;