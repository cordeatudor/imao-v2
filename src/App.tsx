import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { supabase, Property, loadProperties } from './lib/supabase';
import Logo from './components/Logo';
import LanguageSwitcher from './components/LanguageSwitcher';
import FeaturedProperty from './components/FeaturedProperty';
import RecommendedArticle from './components/RecommendedArticle';
import Chatbot from './components/Chatbot';
import AboutUs from './pages/AboutUs';
import SellProperty from './pages/SellProperty';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import Article from './pages/Article';
import PropertyDetails from './pages/PropertyDetails';
import ForSale from './pages/ForSale';
import ForRent from './pages/ForRent';

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

const App = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeListingType, setActiveListingType] = useState<'sale' | 'rent'>('sale');
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const data = await loadProperties();
      setProperties(data);
      
      // Load articles from database
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3);

      if (articlesError) {
        console.error('Error loading articles:', articlesError);
      } else {
        setArticles(articlesData || []);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Error loading properties. Please try again.');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadAllData}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const handleLogoClick = () => {
    setCurrentPage('home');
    navigate('/');
  };

  const handleListingTypeChange = (type: 'sale' | 'rent') => {
    setActiveListingType(type);
    setCurrentPage('home');
  };

  const expertiseFeatures = [
    {
      icon: <Icons.Star size={24} />,
      text: t('sections.expertise.features.local')
    },
    {
      icon: <Icons.Users size={24} />,
      text: t('sections.expertise.features.multilingual')
    },
    {
      icon: <Icons.Handshake size={24} />,
      text: t('sections.expertise.features.assistance')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Logo size="medium" className="text-white" onLogoClick={handleLogoClick} />
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/de-vanzare')} 
                  className="hover:text-purple-200 transition-colors"
                >
                  {t('nav.forSale')}
                </button>
                <button 
                  onClick={() => navigate('/de-inchiriat')} 
                  className="hover:text-purple-200 transition-colors"
                >
                  {t('nav.forRent')}
                </button>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/vinde');
                  }}
                  className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-colors flex items-center gap-2"
                >
                  <Icons.Home size={18} />
                  {t('nav.freeEvaluation')}
                </a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/despre-noi');
                  }}
                  className="hover:text-purple-200 transition-colors"
                >
                  {t('nav.aboutUs')}
                </a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className="hover:text-purple-200 transition-colors"
                >
                  {t('nav.contact')}
                </a>
              </nav>
              <LanguageSwitcher />
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-purple-600 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <Icons.X size={24} />
                ) : (
                  <Icons.Menu size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div 
            className={`md:hidden fixed inset-0 bg-purple-700 transition-transform duration-300 ease-in-out transform ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } top-[73px] z-40`}
          >
            <nav className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6 space-y-6">
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      navigate('/de-vanzare');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-600 rounded-lg transition-colors text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Icons.Building2 size={20} />
                      {t('nav.forSale')}
                    </span>
                    <Icons.ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/de-inchiriat');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-600 rounded-lg transition-colors text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Icons.Key size={20} />
                      {t('nav.forRent')}
                    </span>
                    <Icons.ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/vinde');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-yellow-400 text-purple-900 rounded-lg font-semibold"
                  >
                    <span className="flex items-center gap-3">
                      <Icons.Home size={20} />
                      {t('nav.freeEvaluation')}
                    </span>
                    <Icons.ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/despre-noi');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-600 rounded-lg transition-colors text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Icons.Users size={20} />
                      {t('nav.aboutUs')}
                    </span>
                    <Icons.ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/contact');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-600 rounded-lg transition-colors text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Icons.Phone size={20} />
                      {t('nav.contact')}
                    </span>
                    <Icons.ChevronRight size={20} />
                  </button>
                </div>

                <div className="pt-6 mt-6 border-t border-purple-600">
                  <div className="flex items-center gap-3 px-4 text-purple-200">
                    <Icons.MapPin size={16} />
                    <span>Arad, ROMANIA Calea Bodrogului Nr 10</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 text-purple-200 mt-2">
                    <Icons.Phone size={16} />
                    <span>+40 371 236 023</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 text-purple-200 mt-2">
                    <Icons.Mail size={16} />
                    <span>contact@altfel.ro</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/articol/:id" element={<Article />} />
        <Route path="/proprietate/:id" element={<PropertyDetails properties={properties} />} />
        <Route path="/de-vanzare" element={<ForSale />} />
        <Route path="/de-inchiriat" element={<ForRent />} />
        <Route path="/despre-noi" element={<AboutUs />} />
        <Route path="/vinde" element={<SellProperty />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/termeni-si-conditii" element={<TermsAndConditions />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <section className="bg-purple-700 text-white pb-20">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-8">
                  <div className="flex-1 space-y-3 max-w-xl">
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                      {t('hero.sellCta')}
                    </h1>
                    <p className="text-base md:text-lg text-purple-100 leading-relaxed">
                      {t('hero.sellSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <button 
                        onClick={() => navigate('/vinde')}
                        className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors flex items-center gap-2 group"
                      >
                        <span>{t('buttons.iWantThis')}</span>
                        <Icons.ArrowRight 
                          size={18} 
                          className="transform transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 max-w-2xl w-full">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop"
                        alt="Arhitectură urbană reprezentativă"
                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                        loading="eager"
                        fetchpriority="high"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Property Listings Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                {/* Listing Type Tabs */}
                <div className="flex justify-center gap-8 mb-12">
                  <button
                    onClick={() => setActiveListingType('sale')}
                    className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                      activeListingType === 'sale'
                        ? 'text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t('propertyList.forSale')}
                    {activeListingType === 'sale' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveListingType('rent')}
                    className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                      activeListingType === 'rent'
                        ? 'text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t('propertyList.forRent')}
                    {activeListingType === 'rent' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                    )}
                  </button>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties
                    .filter(property => 
                      property.listingtype === activeListingType && 
                      property.status === 'active'
                    )
                    .map((property) => (
                      <div 
                        key={property.id}
                        onClick={() => navigate(`/proprietate/${property.id}`)}
                        className="cursor-pointer"
                      >
                        <FeaturedProperty {...property} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </section>

            {/* Expertise Section */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    {t('sections.expertise.title')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {expertiseFeatures.map((feature, index) => (
                      <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                          {feature.icon}
                        </div>
                        <span className="text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Recommended Articles Section */}
            <section className="py-20 bg-gray-100">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl font-bold mb-4">{t('sections.recommended')}</h2>
                  <p className="text-gray-600 text-lg">
                    {t('sections.recommendedSubtitle')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <article 
                        key={article.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => navigate(`/articol/${article.slug}`)}
                      >
                        <div className="relative h-48">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">
                            {t(`articles.categories.${article.category}`)}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Icons.Calendar size={16} />
                              <span>{new Date(article.published_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icons.User size={16} />
                              <span>{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    // Fallback to static articles if no articles in database
                    [
                      {
                        id: 'buying-guide',
                        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
                        title: t('articles.featured.buyingGuide.title'),
                        excerpt: t('articles.featured.buyingGuide.excerpt'),
                        date: '15 Mar 2024',
                        readTime: '8 min',
                        category: t('articles.categories.guide')
                      },
                      {
                        id: 'developing-neighborhoods',
                        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',
                        title: t('articles.featured.neighborhoods.title'),
                        excerpt: t('articles.featured.neighborhoods.excerpt'),
                        date: '12 Mar 2024',
                        readTime: '6 min',
                        category: t('articles.categories.analysis')
                      },
                      {
                        id: 'prepare-house-for-sale',
                        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop',
                        title: t('articles.featured.sellingTips.title'),
                        excerpt: t('articles.featured.sellingTips.excerpt'),
                        date: '10 Mar 2024',
                        readTime: '5 min',
                        category: t('articles.categories.tips')
                      }
                    ].map((article, index) => (
                    <article 
                      key={article.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => navigate(`/articol/${article.id}`)}
                    >
                      <div className="relative h-48">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">
                          {article.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Icons.Clock size={16} />
                            <span>{article.readTime}</span>
                          </div>
                          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                            {t('buttons.readMore')}
                            <Icons.ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        } />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="medium" className="text-white mb-4" />
              <p className="text-gray-400">
                {t('footer.rights')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/de-vanzare')}
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.forSale')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/vinde')}
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.freeEvaluation')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/de-inchiriat')}
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.forRent')}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.about')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/despre-noi')}
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.aboutUs')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.contact')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/termeni-si-conditii')}
                    className="hover:text-white transition-colors"
                  >
                    {t('footer.terms')}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('nav.contact')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Icons.MapPin size={16} />
                  <span>Arad, ROMANIA Calea Bodrogului Nr 10</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Phone size={16} />
                  <span>+40 371 236 023</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Mail size={16} />
                  <span>contact@altfel.ro</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;