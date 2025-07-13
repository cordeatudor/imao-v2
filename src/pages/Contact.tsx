import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import SEO from '../components/SEO';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setError(null);
    try {
      await axios.post('https://imoa-backend.vercel.app/api/contact', data);
      reset();
    } catch (err: unknown) {
      let errorMessage = t('contact.form.error');
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white">
      <SEO 
        title={t('contact.title')}
        description={t('contact.subtitle')}
        keywords={[
          'contact imobiliare altfel',
          'agenție imobiliară Arad',
          'consultanță imobiliară',
          'servicii imobiliare premium',
          'imobiliare Arad contact',
          'echipă imobiliară multilingvă',
          'evaluare gratuită proprietăți',
          'asistență imobiliară personalizată'
        ]}
        metaPhrases={[
          'Contact rapid și eficient',
          'Expertiză imobiliară la dispoziția ta',
          'Consultanță personalizată în Arad',
          'Servicii imobiliare premium'
        ]}
      />
      {/* Hero Section */}
      <section className="bg-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-purple-100">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>
      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <Icons.Phone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('contact.methods.phone.title')}</h3>
              <p className="text-gray-600 mb-3">{t('contact.methods.phone.description')}</p>
              <a 
                href="tel:+40371236023"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('contact.methods.phone.value')}
              </a>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <Icons.Clock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('contact.methods.schedule.title')}</h3>
              <p className="text-gray-600 mb-3">{t('contact.methods.schedule.description')}</p>
              <div className="text-gray-800 whitespace-pre-line">
                {t('contact.methods.schedule.value')}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6">{t('contact.form.title')}</h2>
              {isSubmitSuccessful ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('contact.form.success')}</h3>
                  <p className="text-gray-600">
                    {t('contact.form.successDetails')}
                  </p>
                </div>
              ) : (
                <form 
                  name="contact"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: t('contact.form.nameRequired') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: t('contact.form.emailRequired') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: t('contact.form.phoneRequired') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message as string}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      type="text"
                      {...register('subject', { required: t('contact.form.subjectRequired') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t('contact.form.subjectPlaceholder')}
                    />
                    {errors.subject && <span className="text-red-500 text-xs">{errors.subject.message as string}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message')}
                    </label>
                    <TextareaAutosize
                      {...register('message', { required: t('contact.form.messageRequired') })}
                      minRows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                    {errors.message && <span className="text-red-500 text-xs">{errors.message.message as string}</span>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.Loader2 size={20} className="animate-spin" />
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        <Icons.Send size={20} />
                        {t('contact.form.send')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;