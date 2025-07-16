import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import SEO from '../components/SEO';
import { Property, supabase } from '../lib/supabase';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Ensure arrays are properly initialized
        const formattedProperty = {
          ...data,
          features: Array.isArray(data.features) ? data.features : [],
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          images: Array.isArray(data.images) ? data.images : []
        };
        setProperty(formattedProperty);
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Icons.Loader2 className="animate-spin" size={24} />
          <span>Se încarcă...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEO 
          title="Proprietate Negăsită"
          description="Proprietatea căutată nu a fost găsită în portofoliul nostru."
          keywords={['imobiliare altfel', 'proprietati arad', 'anunturi imobiliare arad']}
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Proprietate negăsită</h1>
          <p className="text-gray-600 mb-8">Ne pare rău, dar proprietatea căutată nu există.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }

  const mainFeatures = [
    { icon: <Icons.Bed size={24} />, label: 'Dormitoare', value: property.beds },
    { icon: <Icons.Bath size={24} />, label: 'Băi', value: property.baths },
    { icon: <Icons.SquareStack size={24} />, label: 'Suprafață', value: property.size },
    { icon: <Icons.Calendar size={24} />, label: 'An construcție', value: property.yearbuilt },
    { icon: <Icons.Zap size={24} />, label: 'Clasă energetică', value: property.energyclass }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title={property.title}
        description={`${property.title} - ${property.location}. ${property.beds} dormitoare, ${property.baths} băi, ${property.size}`}
        keywords={[
          'imobiliare Arad',
          property.type === 'house' ? 'case de vânzare Arad' : 'apartamente de vânzare Arad',
          'case de vis Arad',
          'locuința ideală Arad',
          'imobiliare altfel Arad',
          'servicii imobiliare premium',
          'oferte imobiliare unice Arad',
          property.location.toLowerCase(),
          ...property.features.map(f => f.toLowerCase()),
          property.listingtype === 'sale' ? 'vânzare locuințe Arad' : 'închiriere locuințe Arad'
        ]}
        image={property.image}
      />

      {/* Image Gallery */}
      
      <div className="relative bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={property.images?.[selectedImage] || property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {property.images?.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Imagine ${index + 2}`}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Icons.MapPin size={20} />
                    {property.location}
                  </p>
                </div>
                <div className="text-2xl font-bold text-purple-600">{property.price}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {mainFeatures.map((feature, index) => (
                  feature.value && (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-purple-600 mb-2 flex justify-center">
                        {feature.icon}
                      </div>
                      <div className="text-sm text-gray-600">{feature.label}</div>
                      <div className="font-semibold">{feature.value}</div>
                    </div>
                  )
                ))}
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-bold mb-4">Descriere</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Caracteristici</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Icons.Check className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Facilități</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Icons.Star className="text-yellow-500 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Programează o vizionare</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Numele și prenumele"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0712 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data preferată
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj (opțional)
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="Detalii adiționale sau întrebări..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Calendar size={20} />
                  Programează vizionare
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;