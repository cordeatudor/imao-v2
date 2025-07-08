import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import SEO from '../components/SEO';

const SellProperty: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    listingType: 'sale',
    propertyType: '',
    address: '',
    size: '',
    rooms: '',
    yearBuilt: '',
    condition: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    preferredContact: 'phone'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
      setFormData({
        listingType: 'sale',
        propertyType: '',
        address: '',
        size: '',
        rooms: '',
        yearBuilt: '',
        condition: '',
        description: '',
        name: '',
        email: '',
        phone: '',
        preferredContact: 'phone'
      });
    } catch (err) {
      console.error('Form submission error:', err);
      setError('A apărut o eroare la trimiterea formularului. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white">
      <SEO 
        title={t('sellProperty.title')}
        description={t('sellProperty.subtitle')}
        keywords={[
          'vânzare locuințe Arad',
          'imobiliare Arad',
          'agenție imobiliară Arad',
          'vânzare fără stres',
          'evaluare gratuită',
          'servicii imobiliare premium',
          'consultanță imobiliară Arad',
          'experiență imobiliară diferită',
          'abordare personalizată imobiliare',
          'transformăm visurile în realitate',
          'imobiliare altfel Arad'
        ]}
      />
      
      {/* Hero Section */}
      <section className="bg-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('sellProperty.title')}
            </h1>
            <p className="text-xl text-purple-100">
              {t('sellProperty.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 sm:p-10">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  {t('sellProperty.form.title')}
                </h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('sellProperty.form.success.title')}</h3>
                    <p className="text-gray-600">
                      {t('sellProperty.form.success.message')}
                    </p>
                  </div>
                ) : (
                  <form 
                    name="sell-property"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <input type="hidden" name="form-name" value="sell-property" />
                    <div className="hidden">
                      <label>
                        Don't fill this out if you're human: <input name="bot-field" />
                      </label>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Property Details */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4">
                        {t('sellProperty.form.sections.propertyDetails')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.listingType.label')}
                          </label>
                          <select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="sale">{t('sellProperty.form.fields.listingType.options.sale')}</option>
                            <option value="rent">{t('sellProperty.form.fields.listingType.options.rent')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.propertyType.label')}
                          </label>
                          <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          >
                            <option value="">{t('sellProperty.form.fields.propertyType.placeholder')}</option>
                            <option value="apartment">{t('sellProperty.form.fields.propertyType.options.apartment')}</option>
                            <option value="house">{t('sellProperty.form.fields.propertyType.options.house')}</option>
                            <option value="land">{t('sellProperty.form.fields.propertyType.options.land')}</option>
                            <option value="commercial">{t('sellProperty.form.fields.propertyType.options.commercial')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.address.label')}
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.address.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.size.label')}
                          </label>
                          <input
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.size.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.rooms.label')}
                          </label>
                          <input
                            type="text"
                            name="rooms"
                            value={formData.rooms}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.rooms.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.yearBuilt.label')}
                          </label>
                          <input
                            type="text"
                            name="yearBuilt"
                            value={formData.yearBuilt}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.yearBuilt.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.condition.label')}
                          </label>
                          <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">{t('sellProperty.form.fields.condition.placeholder')}</option>
                            <option value="new">{t('sellProperty.form.fields.condition.options.new')}</option>
                            <option value="excellent">{t('sellProperty.form.fields.condition.options.excellent')}</option>
                            <option value="good">{t('sellProperty.form.fields.condition.options.good')}</option>
                            <option value="needsWork">{t('sellProperty.form.fields.condition.options.needsWork')}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('sellProperty.form.fields.description.label')}
                        </label>
                        <TextareaAutosize
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder={t('sellProperty.form.fields.description.placeholder')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          minRows={4}
                        />
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-6 pt-6 border-t">
                      <h3 className="text-xl font-semibold mb-4">
                        {t('sellProperty.form.sections.contactDetails')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.name.label')}
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.name.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.email.label')}
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.email.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.phone.label')}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t('sellProperty.form.fields.phone.placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('sellProperty.form.fields.preferredContact.label')}
                          </label>
                          <select
                            name="preferredContact"
                            value={formData.preferredContact}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="phone">{t('sellProperty.form.fields.preferredContact.options.phone')}</option>
                            <option value="email">{t('sellProperty.form.fields.preferredContact.options.email')}</option>
                            <option value="whatsapp">{t('sellProperty.form.fields.preferredContact.options.whatsapp')}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Icons.Loader2 size={20} className="animate-spin" />
                            {t('sellProperty.form.sending')}
                          </>
                        ) : (
                          <>
                            <Icons.Send size={20} />
                            {t('sellProperty.form.submit')}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellProperty;