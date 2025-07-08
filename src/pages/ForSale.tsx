import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import FeaturedProperty from '../components/FeaturedProperty';
import SEO from '../components/SEO';
import { Property, supabase } from '../lib/supabase';

const ForSale = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('listingtype', 'sale')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure arrays are properly initialized
      const formattedData = (data || []).map(property => ({
        ...property,
        features: Array.isArray(property.features) ? property.features : [],
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        images: Array.isArray(property.images) ? property.images : []
      }));

      setProperties(formattedData);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('A apărut o eroare la încărcarea proprietăților. Vă rugăm să reîncărcați pagina.');
    } finally {
      setIsLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: t('propertyList.filters.all'), icon: <Icons.LayoutGrid size={20} /> },
    { id: 'apartment', label: t('propertyList.filters.apartments'), icon: <Icons.Building2 size={20} /> },
    { id: 'house', label: t('propertyList.filters.houses'), icon: <Icons.Home size={20} /> },
    { id: 'land', label: t('propertyList.filters.land'), icon: <Icons.Trees size={20} /> },
    { id: 'commercial', label: t('propertyList.filters.commercial'), icon: <Icons.Store size={20} /> },
    { id: 'industrial', label: t('propertyList.filters.industrial'), icon: <Icons.Factory size={20} /> },
    { id: 'diverse', label: t('propertyList.filters.diverse'), icon: <Icons.Plus size={20} /> }
  ];

  const filteredProperties = properties.filter(property => 
    activeFilter === 'all' ? true : property.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={t('propertyList.pageTitle.forSale')}
        description={t('propertyList.pageSubtitle.forSale')}
        keywords={[
          'vânzare locuințe Arad',
          'cumpărare case Arad',
          'apartamente de vânzare Arad',
          'terenuri de vânzare Arad',
          'case de vis Arad',
          'imobiliare Arad',
          'oferte imobiliare unice Arad',
          'casa visurilor tale Arad',
          'locuința ideală Arad',
          'investiții imobiliare sigure',
          'cumpărare fără stres',
          'imobiliare altfel Arad'
        ]}
      />
      {/* Hero Section */}
      <section className="bg-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('propertyList.pageTitle.forSale')}</h1>
            <p className="text-xl text-purple-100">
              {t('propertyList.pageSubtitle.forSale')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icons.Loader2 className="animate-spin mr-2" size={24} />
              <span>Se încarcă proprietățile...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/proprietate/${property.id}`)}
                  className="cursor-pointer"
                >
                  <FeaturedProperty {...property} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {t('propertyList.noResults')}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t('propertyList.contactSection.title')}</h2>
            <p className="text-gray-600 mb-8">
              {t('propertyList.contactSection.description')}
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <Icons.Phone size={20} />
              {t('buttons.contact')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForSale;