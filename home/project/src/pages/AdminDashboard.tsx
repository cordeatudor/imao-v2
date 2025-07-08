import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { supabase } from '../lib/supabase';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  beds: number;
  baths: number;
  size: string;
  features: string[];
  image: string;
  status: 'active' | 'pending' | 'sold';
  listingType: 'sale' | 'rent';
  description?: string;
  yearBuilt?: number;
  energyClass?: string;
  images?: string[];
  amenities?: string[];
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'articles'>('sale');
  const [properties, setProperties] = useState<Property[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    type: 'house',
    status: 'active',
    features: [],
    listingType: 'sale',
    images: [],
    amenities: []
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      await loadProperties();
      await loadArticles();
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Loaded properties:', data);
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      alert('Eroare la încărcarea proprietăților. Vă rugăm să reîncărcați pagina.');
    }
  };

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      console.log('Loaded articles:', data);
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('Eroare la încărcarea articolelor. Vă rugăm să reîncărcați pagina.');
    }
  };

  const handleAddProperty = async () => {
    if (!newProperty.title || !newProperty.price || !newProperty.location || !newProperty.image) {
      alert('Vă rugăm să completați toate câmpurile obligatorii (titlu, preț, locație și imagine principală)');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select()
        .single();

      if (error) throw error;

      await loadProperties();
      setNewProperty({
        type: 'house',
        status: 'active',
        features: [],
        listingType: 'sale',
        images: [],
        amenities: []
      });
      setIsAddingProperty(false);
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Eroare la adăugarea proprietății. Vă rugăm să încercați din nou.');
    }
  };

  const handleUpdateProperty = async () => {
    if (!selectedProperty) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update(selectedProperty)
        .eq('id', selectedProperty.id);

      if (error) throw error;

      await loadProperties();
      setSelectedProperty(null);
      setIsEditingProperty(false);
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Eroare la actualizarea proprietății. Vă rugăm să încercați din nou.');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Sunteți sigur că doriți să ștergeți această proprietate?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Eroare la ștergerea proprietății. Vă rugăm să încercați din nou.');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Icons.Loader2 className="animate-spin" size={24} />
          <span>Se încarcă proprietățile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Panou de Administrare</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddingProperty(true)}
                className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Icons.Plus size={20} />
                Adaugă Proprietate
              </button>
              <button
                onClick={handleSignOut}
                className="text-white hover:text-purple-200 transition-colors flex items-center gap-2"
              >
                <Icons.LogOut size={20} />
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Property List */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('sale')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'sale'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            De Vânzare ({properties.filter(p => p.listingType === 'sale').length})
          </button>
          <button
            onClick={() => setActiveTab('rent')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'rent'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            De Închiriat ({properties.filter(p => p.listingType === 'rent').length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'articles'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Articole ({articles.length})
          </button>
        </div>

        {activeTab !== 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties
              .filter(property => property.listingType === activeTab)
              .map(property => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => {
                    setSelectedProperty(property);
                    setIsEditingProperty(true);
                  }}
                >
                  <div className="relative h-48">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          property.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {property.status === 'active' ? 'Activ' : 
                         property.status === 'pending' ? 'În așteptare' : 'Vândut'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4">{property.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-600 font-bold">{property.price}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProperty(property.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icons.Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Icons.Bed size={16} />
                        <span>{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icons.Bath size={16} />
                        <span>{property.baths}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icons.Square size={16} />
                        <span>{property.size}</span>
                      </div>
                    </div>
                    {property.features && property.features.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {property.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div 
                key={article.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab !== 'articles' && properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              Nu există proprietăți. Adăugați una folosind butonul de mai sus.
            </div>
          </div>
        )}

        {activeTab === 'articles' && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              Nu există articole.
            </div>
          </div>
        )}
      </main>

      {/* Add Property Modal */}
      {isAddingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Adaugă Proprietate Nouă</h2>
                <button
                  onClick={() => setIsAddingProperty(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icons.X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titlu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProperty.title || ''}
                    onChange={e => setNewProperty({ ...newProperty, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProperty.price || ''}
                    onChange={e => setNewProperty({ ...newProperty, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locație <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProperty.location || ''}
                    onChange={e => setNewProperty({ ...newProperty, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Imagine <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProperty.image || ''}
                    onChange={e => setNewProperty({ ...newProperty, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dormitoare
                  </label>
                  <input
                    type="number"
                    value={newProperty.beds || ''}
                    onChange={e => setNewProperty({ ...newProperty, beds: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Băi
                  </label>
                  <input
                    type="number"
                    value={newProperty.baths || ''}
                    onChange={e => setNewProperty({ ...newProperty, baths: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suprafață
                  </label>
                  <input
                    type="text"
                    value={newProperty.size || ''}
                    onChange={e => setNewProperty({ ...newProperty, size: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="ex: 120m²"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip Proprietate
                  </label>
                  <select
                    value={newProperty.type || 'house'}
                    onChange={e => setNewProperty({ ...newProperty, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="house">Casă</option>
                    <option value="apartment">Apartament</option>
                    <option value="land">Teren</option>
                    <option value="commercial">Spațiu Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip Listare
                  </label>
                  <select
                    value={newProperty.listingType || 'sale'}
                    onChange={e => setNewProperty({ ...newProperty, listingType: e.target.value as 'sale' | 'rent' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="sale">De Vânzare</option>
                    <option value="rent">De Închiriat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newProperty.status || 'active'}
                    onChange={e => setNewProperty({ ...newProperty, status: e.target.value as 'active' | 'pending' | 'sold' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Activ</option>
                    <option value="pending">În așteptare</option>
                    <option value="sold">Vândut</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descriere
                </label>
                <TextareaAutosize
                  value={newProperty.description || ''}
                  onChange={e => setNewProperty({ ...newProperty, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  minRows={4}
                  placeholder="Descriere detaliată a proprietății"
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsAddingProperty(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={handleAddProperty}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Icons.Plus size={20} />
                  Adaugă Proprietate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {isEditingProperty && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Editare Proprietate</h2>
                <button
                  onClick={() => {
                    setSelectedProperty(null);
                    setIsEditingProperty(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icons.X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titlu
                  </label>
                  <input
                    type="text"
                    value={selectedProperty.title}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      title: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț
                  </label>
                  <input
                    type="text"
                    value={selectedProperty.price}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      price: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locație
                  </label>
                  <input
                    type="text"
                    value={selectedProperty.location}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      location: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Imagine
                  </label>
                  <input
                    type="text"
                    value={selectedProperty.image}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      image: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dormitoare
                  </label>
                  <input
                    type="number"
                    value={selectedProperty.beds}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      beds: parseInt(e.target.value)
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Băi
                  </label>
                  <input
                    type="number"
                    value={selectedProperty.baths}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      baths: parseInt(e.target.value)
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suprafață
                  </label>
                  <input
                    type="text"
                    value={selectedProperty.size}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      size: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedProperty.status}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      status: e.target.value as 'active' | 'pending' | 'sold'
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Activ</option>
                    <option value="pending">În așteptare</option>
                    <option value="sold">Vândut</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip Listare
                  </label>
                  <select
                    value={selectedProperty.listingType}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      listingType: e.target.value as 'sale' | 'rent'
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="sale">De Vânzare</option>
                    <option value="rent">De Închiriat</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descriere
                </label>
                <TextareaAutosize
                  value={selectedProperty.description || ''}
                  onChange={e => setSelectedProperty({
                    ...selectedProperty,
                    description: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  minRows={4}
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setSelectedProperty(null);
                    setIsEditingProperty(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Anulează
                </button> ```jsx
                <button
                  onClick={handleUpdateProperty}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Icons.Save size={20} />
                  Salvează Modificările
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
```

export default AdminDashboard