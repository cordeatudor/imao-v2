import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { supabase, Property } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import MultiImageUpload from '../components/MultiImageUpload';

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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'articles'>('sale');
  const [properties, setProperties] = useState<Property[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    type: 'house',
    status: 'active',
    listingtype: 'sale',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    category: 'guide',
    author: 'Admin'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await loadProperties();
      await loadArticles();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      console.log('Loading properties...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Ensure data is properly formatted
      const formattedData = (data || []).map(property => ({
        ...property,
        features: Array.isArray(property.features) ? property.features : [],
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        images: Array.isArray(property.images) ? property.images : []
      }));

      console.log('Properties loaded:', formattedData);
      setProperties(formattedData);
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

      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('Eroare la încărcarea articolelor. Vă rugăm să reîncărcați pagina.');
    }
  };

  const handleAddProperty = async () => {
    if (!newProperty.title || !newProperty.price || !newProperty.location || !newProperty.image) {
      alert(t('admin.forms.addProperty.required'));
      return;
    }

    try {
      console.log('Adding new property:', newProperty);
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          ...newProperty,
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('Property added successfully:', data);
      await loadProperties();
      setNewProperty({
        type: 'house',
        status: 'active',
        listingtype: 'sale',
      });
      setIsAddingProperty(false);
    } catch (error) {
      console.error('Error adding property:', error);
      alert(t('admin.errors.addProperty'));
    }
  };

  const handleUpdateProperty = async () => {
    if (!selectedProperty) return;

    try {
      console.log('Updating property:', selectedProperty);
      const { error } = await supabase
        .from('properties')
        .update(selectedProperty)
        .eq('id', selectedProperty.id);

      if (error) throw error;

      console.log('Property updated successfully');
      await loadProperties();
      setSelectedProperty(null);
      setIsEditingProperty(false);
    } catch (error) {
      console.error('Error updating property:', error);
      alert(t('admin.errors.updateProperty'));
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;

    try {
      console.log('Deleting property:', id);
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Property deleted successfully');
      await loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(t('admin.errors.deleteProperty'));
    }
  };

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.image) {
      alert(t('admin.forms.addArticle.required'));
      return;
    }

    try {
      const slug = newArticle.title
        ?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { data, error } = await supabase
        .from('articles')
        .insert([{
          ...newArticle,
          slug,
          published_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      await loadArticles();
      setNewArticle({
        category: 'guide',
        author: 'Admin'
      });
      setIsAddingArticle(false);
    } catch (error) {
      console.error('Error adding article:', error);
      alert(t('admin.errors.addArticle'));
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;

    try {
      const { error } = await supabase
        .from('articles')
        .update(selectedArticle)
        .eq('id', selectedArticle.id);

      if (error) throw error;

      await loadArticles();
      setSelectedArticle(null);
      setIsEditingArticle(false);
    } catch (error) {
      console.error('Error updating article:', error);
      alert(t('admin.errors.updateArticle'));
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm(t('admin.confirmDeleteArticle'))) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(t('admin.errors.deleteArticle'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Icons.Loader2 className="animate-spin" size={24} />
          <span>{t('admin.loading')}</span>
        </div>
      </div>
    );
  }

  const filteredProperties = properties.filter(property => property.listingtype === activeTab);
  console.log('Filtered properties:', filteredProperties);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddingProperty(true)}
                className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Icons.Plus size={20} />
                {t('admin.addProperty')}
              </button>
              <button
                onClick={() => setIsAddingArticle(true)}
                className="bg-yellow-400 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center gap-2"
              >
                <Icons.FileText size={20} />
                {t('admin.addArticle')}
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-white hover:text-purple-200 transition-colors flex items-center gap-2"
              >
                <Icons.Home size={20} />
                {t('admin.backToSite')}
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
            {t('admin.tabs.forSale')} ({properties.filter(p => p.listingtype === 'sale').length})
          </button>
          <button
            onClick={() => setActiveTab('rent')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'rent'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('admin.tabs.forRent')} ({properties.filter(p => p.listingtype === 'rent').length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'articles'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('admin.tabs.articles')} ({articles.length})
          </button>
        </div>

        {activeTab !== 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
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
                      {property.status === 'active' ? t('admin.status.active') : 
                       property.status === 'pending' ? t('admin.status.pending') : t('admin.status.sold')}
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
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => {
                  setSelectedArticle(article);
                  setIsEditingArticle(true);
                }}
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
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArticle(article.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab !== 'articles' && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {t('admin.noProperties')}
            </div>
          </div>
        )}

        {activeTab === 'articles' && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {t('admin.noArticles')}
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
                <h2 className="text-2xl font-bold">{t('admin.forms.addProperty.title')}</h2>
                <button
                  onClick={() => setIsAddingProperty(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icons.X size={24} />
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.forms.addProperty.fields.mainImage')} <span className="text-red-500">*</span>
                </label>
                <ImageUpload
                  onImageSelect={(file, url) => {
                    if (url) {
                      setNewProperty({ ...newProperty, image: url });
                    } else {
                      const preview = URL.createObjectURL(file);
                      setImagePreview(preview);
                      setNewProperty({ ...newProperty, image: preview });
                    }
                  }}
                  onImageClear={() => {
                    setNewProperty({ ...newProperty, image: '' });
                    setImagePreview(null);
                  }}
                  preview={newProperty.image || imagePreview || undefined}
                  uploadToStorage={true}
                  className="mb-4"
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addProperty.fields.title')} <span className="text-red-500">*</span>
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
                    {t('admin.forms.addProperty.fields.price')} <span className="text-red-500">*</span>
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
                    {t('admin.forms.addProperty.fields.location')} <span className="text-red-500">*</span>
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
                    {t('admin.forms.addProperty.fields.bedrooms')}
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
                    {t('admin.forms.addProperty.fields.bathrooms')}
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
                    {t('admin.forms.addProperty.fields.size')}
                  </label>
                  <input
                    type="text"
                    value={newProperty.size || ''}
                    onChange={e => setNewProperty({ ...newProperty, size: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('admin.forms.addProperty.placeholders.size')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addProperty.fields.propertyType')}
                  </label>
                  <select
                    value={newProperty.type || 'house'}
                    onChange={e => setNewProperty({ ...newProperty, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="house">{t('admin.forms.addProperty.propertyTypes.house')}</option>
                    <option value="apartment">{t('admin.forms.addProperty.propertyTypes.apartment')}</option>
                    <option value="land">{t('admin.forms.addProperty.propertyTypes.land')}</option>
                    <option value="commercial">{t('admin.forms.addProperty.propertyTypes.commercial')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addProperty.fields.listingType')}
                  </label>
                  <select
                    value={newProperty.listingtype || 'sale'}
                    onChange={e => setNewProperty({ ...newProperty, listingtype: e.target.value as 'sale' | 'rent' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="sale">{t('admin.forms.addProperty.listingTypes.sale')}</option>
                    <option value="rent">{t('admin.forms.addProperty.listingTypes.rent')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addProperty.fields.status')}
                  </label>
                  <select
                    value={newProperty.status || 'active'}
                    onChange={e => setNewProperty({ ...newProperty, status: e.target.value as 'active' | 'pending' | 'sold' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">{t('admin.status.active')}</option>
                    <option value="pending">{t('admin.status.pending')}</option>
                    <option value="sold">{t('admin.status.sold')}</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.forms.addProperty.fields.description')}
                </label>
                <TextareaAutosize
                  value={newProperty.description || ''}
                  onChange={e => setNewProperty({ ...newProperty, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  minRows={4}
                  placeholder={t('admin.forms.addProperty.placeholders.description')}
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsAddingProperty(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('admin.forms.addProperty.buttons.cancel')}
                </button>
                <button
                  onClick={handleAddProperty}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Icons.Plus size={20} />
                  {t('admin.forms.addProperty.buttons.add')}
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
                <h2 className="text-2xl font-bold">{t('admin.forms.addProperty.editTitle')}</h2>
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
                    {t('admin.forms.addProperty.fields.mainImage')}
                  </label>
                  <ImageUpload
                    onImageSelect={(file, url) => {
                      if (url && selectedProperty) {
                        setSelectedProperty({
                          ...selectedProperty,
                          image: url
                        });
                      }
                    }}
                    preview={selectedProperty.image}
                    uploadToStorage={true}
                    className="mb-4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addProperty.fields.title')}
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
                    {t('admin.forms.addProperty.fields.price')}
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
                    {t('admin.forms.addProperty.fields.location')}
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
                    {t('admin.forms.addProperty.fields.bedrooms')}
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
                    {t('admin.forms.addProperty.fields.bathrooms')}
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
                    {t('admin.forms.addProperty.fields.size')}
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
                    {t('admin.forms.addProperty.fields.status')}
                  </label>
                  <select
                    value={selectedProperty.status}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      status: e.target.value as 'active' | 'pending' | 'sold'
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">{t('admin.status.active')}</option>
                    <option value="pending">{t('admin.status.pending')}</option>
                    <option value="sold">{t('admin.status.sold')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addProperty.fields.listingType')}
                  </label>
                  <select
                    value={selectedProperty.listingtype}
                    onChange={e => setSelectedProperty({
                      ...selectedProperty,
                      listingtype: e.target.value as 'sale' | 'rent'
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="sale">{t('admin.forms.addProperty.listingTypes.sale')}</option>
                    <option value="rent">{t('admin.forms.addProperty.listingTypes.rent')}</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.forms.addProperty.fields.description')}
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
                  {t('admin.forms.addProperty.buttons.cancel')}
                </button>
                <button
                  onClick={handleUpdateProperty}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Icons.Save size={20} />
                  {t('admin.forms.addProperty.buttons.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {isAddingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('admin.forms.addArticle.title')}</h2>
                <button
                  onClick={() => setIsAddingArticle(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icons.X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addArticle.fields.mainImage')} <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    onImageSelect={(file, url) => {
                      if (url) {
                        setNewArticle({ ...newArticle, image: url });
                      }
                    }}
                    preview={newArticle.image}
                    uploadToStorage={true}
                    storagePath="article-images"
                    className="mb-4"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forms.addArticle.fields.title')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newArticle.title || ''}
                      onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forms.addArticle.fields.category')}
                    </label>
                    <select
                      value={newArticle.category || 'guide'}
                      onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="guide">{t('admin.forms.addArticle.categories.guide')}</option>
                      <option value="analysis">{t('admin.forms.addArticle.categories.analysis')}</option>
                      <option value="tips">{t('admin.forms.addArticle.categories.tips')}</option>
                      <option value="news">{t('admin.forms.addArticle.categories.news')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forms.addArticle.fields.author')}
                    </label>
                    <input
                      type="text"
                      value={newArticle.author || ''}
                      onChange={e => setNewArticle({ ...newArticle, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addArticle.fields.excerpt')}
                  </label>
                  <TextareaAutosize
                    value={newArticle.excerpt || ''}
                    onChange={e => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    minRows={2}
                    placeholder={t('admin.forms.addArticle.placeholders.excerpt')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addArticle.fields.content')} <span className="text-red-500">*</span>
                  </label>
                  <TextareaAutosize
                    value={newArticle.content || ''}
                    onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    minRows={8}
                    placeholder={t('admin.forms.addArticle.placeholders.content')}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setIsAddingArticle(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {t('admin.forms.addArticle.buttons.cancel')}
                  </button>
                  <button
                    onClick={handleAddArticle}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Icons.Plus size={20} />
                    {t('admin.forms.addArticle.buttons.add')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {isEditingArticle && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('admin.forms.addArticle.editTitle')}</h2>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    setIsEditingArticle(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icons.X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addArticle.fields.mainImage')}
                  </label>
                  <ImageUpload
                    onImageSelect={(file, url) => {
                      if (url && selectedArticle) {
                        setSelectedArticle({ ...selectedArticle, image: url });
                      }
                    }}
                    preview={selectedArticle.image}
                    uploadToStorage={true}
                    storagePath="article-images"
                    className="mb-4"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forms.addArticle.fields.title')}
                    </label>
                    <input
                      type="text"
                      value={selectedArticle.title}
                      onChange={e => setSelectedArticle({
                        ...selectedArticle,
                        title: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forms.addArticle.fields.category')}
                    </label>
                    <select
                      value={selectedArticle.category}
                      onChange={e => setSelectedArticle({
                        ...selectedArticle,
                        category: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="guide">{t('admin.forms.addArticle.categories.guide')}</option>
                      <option value="analysis">{t('admin.forms.addArticle.categories.analysis')}</option>
                      <option value="tips">{t('admin.forms.addArticle.categories.tips')}</option>
                      <option value="news">{t('admin.forms.addArticle.categories.news')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forms.addArticle.fields.author')}
                    </label>
                    <input
                      type="text"
                      value={selectedArticle.author || ''}
                      onChange={e => setSelectedArticle({
                        ...selectedArticle,
                        author: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addArticle.fields.excerpt')}
                  </label>
                  <TextareaAutosize
                    value={selectedArticle.excerpt || ''}
                    onChange={e => setSelectedArticle({
                      ...selectedArticle,
                      excerpt: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    minRows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.forms.addArticle.fields.content')}
                  </label>
                  <TextareaAutosize
                    value={selectedArticle.content}
                    onChange={e => setSelectedArticle({
                      ...selectedArticle,
                      content: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    minRows={8}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      setIsEditingArticle(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {t('admin.forms.addArticle.buttons.cancel')}
                  </button>
                  <button
                    onClick={handleUpdateArticle}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Icons.Save size={20} />
                    {t('admin.forms.addArticle.buttons.save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;