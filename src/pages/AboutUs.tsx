import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <SEO 
        title={t('about.title')}
        description={t('about.subtitle')}
        keywords={[
          'imobiliare Arad',
          'agenție imobiliară Arad',
          'servicii imobiliare premium',
          'echipă tânără și dinamică imobiliare',
          'agenție imobiliară multilingvă',
          'experiență imobiliară diferită',
          'imobiliare altfel Arad',
          'consultanță imobiliară Arad',
          'abordare personalizată imobiliare',
          'transformăm visurile în realitate'
        ]}
      />
      {/* Hero Section */}
      <section className="bg-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.title')}</h1>
            <p className="text-xl text-purple-100">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070&auto=format&fit=crop"
                  alt="Teatrul Clasic Ioan Slavici din Arad"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">{t('about.mission.title')}</h2>
              <div className="text-gray-600 text-lg leading-relaxed">
                <p>{t('about.mission.description')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-gray-600">{t('about.stats.properties')}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-gray-600">{t('about.stats.satisfaction')}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                  <div className="text-gray-600">{t('about.stats.experience')}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">{t('about.stats.support')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.values.title')}</h2>
            <p className="text-gray-600 text-lg">
              {t('about.values.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">{t('about.values.passion.title')}</h3>
              <p className="text-gray-600">{t('about.values.passion.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">{t('about.values.integrity.title')}</h3>
              <p className="text-gray-600">{t('about.values.integrity.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">{t('about.values.excellence.title')}</h3>
              <p className="text-gray-600">{t('about.values.excellence.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">{t('about.values.community.title')}</h3>
              <p className="text-gray-600">{t('about.values.community.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;