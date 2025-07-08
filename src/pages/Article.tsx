import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author?: string;
  excerpt?: string;
  keywords?: string[];
}

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dbArticle, setDbArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the article content from translations based on the ID
  const getArticleContent = (articleId: string) => {
    if (!articleId) return null;

    const articleKey = {
      'buying-guide': 'buyingGuide',
      'developing-neighborhoods': 'neighborhoods',
      'prepare-house-for-sale': 'sellingTips'
    }[articleId];

    if (!articleKey) return null;

    const article = t(`articles.featured.${articleKey}`, { returnObjects: true });
    if (!article) return null;

    const content = article.content;
    if (!content) return null;

    // Create HTML content from the translated content structure
    let htmlContent = `
      <h2>${t(`articles.featured.${articleKey}.content.intro`, { defaultValue: 'Introduction' })}</h2>
      <p>${content.intro}</p>
    `;

    // Add sections based on the article type
    if (articleKey === 'buyingGuide') {
      htmlContent += `
        <h2>${content.budget.title}</h2>
        <ul>
          ${content.budget.points.map((point: string) => `<li>${point}</li>`).join('')}
        </ul>

        <h2>${content.location.title}</h2>
        <ul>
          ${content.location.areas.map((area: string) => `<li>${area}</li>`).join('')}
        </ul>

        <h2>${content.process.title}</h2>
        <ol>
          ${content.process.steps.map((step: string) => `<li>${step}</li>`).join('')}
        </ol>
      `;
    } else if (articleKey === 'neighborhoods') {
      htmlContent += `
        <h2>${content.areas.title}</h2>
        <ul>
          ${content.areas.list.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>

        <h2>${content.potential.title}</h2>
        <ul>
          ${content.potential.factors.map((factor: string) => `<li>${factor}</li>`).join('')}
        </ul>

        <h2>${content.investment.title}</h2>
        <ul>
          ${content.investment.options.map((option: string) => `<li>${option}</li>`).join('')}
        </ul>
      `;
    } else if (articleKey === 'sellingTips') {
      htmlContent += `
        <h2>${content.preparation.title}</h2>
        <ul>
          ${content.preparation.steps.map((step: string) => `<li>${step}</li>`).join('')}
        </ul>

        <h2>${content.staging.title}</h2>
        <ul>
          ${content.staging.tips.map((tip: string) => `<li>${tip}</li>`).join('')}
        </ul>

        <h2>${content.marketing.title}</h2>
        <ul>
          ${content.marketing.elements.map((element: string) => `<li>${element}</li>`).join('')}
        </ul>
      `;
    }

    return {
      id: articleId,
      title: article.title,
      content: htmlContent,
      excerpt: article.excerpt,
      image: {
        'buying-guide': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
        'developing-neighborhoods': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',
        'prepare-house-for-sale': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop'
      }[articleId],
      category: {
        'buying-guide': t('articles.categories.guide'),
        'developing-neighborhoods': t('articles.categories.analysis'),
        'prepare-house-for-sale': t('articles.categories.tips')
      }[articleId],
      date: '15 Mar 2024',
      readTime: '8 min',
      author: 'Alex Popescu'
    };
  };

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        // First try to load from database by slug
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', id)
          .single();

        if (!error && data) {
          setDbArticle(data);
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  // Use database article if available, otherwise fallback to static content
  const article = dbArticle || (id ? getArticleContent(id) : null);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEO 
          title={t('errors.notFound.article')}
          description={t('errors.notFound.message')}
          keywords={['imobiliare altfel', 'articole imobiliare', 'blog imobiliar arad']}
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('errors.notFound.article')}</h1>
          <p className="text-gray-600 mb-8">{t('errors.notFound.message')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t('errors.notFound.backHome')}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Icons.Loader2 className="animate-spin" size={24} />
          <span>Se încarcă articolul...</span>
        </div>
      </div>
    );
  }

  // Get related articles excluding the current one
  const getRelatedArticles = () => {
    const allArticleIds = ['buying-guide', 'developing-neighborhoods', 'prepare-house-for-sale'];
    return allArticleIds
      .filter(articleId => articleId !== id)
      .map(articleId => getArticleContent(articleId))
      .filter(article => article !== null)
      .slice(0, 2);
  };

  const relatedArticles = getRelatedArticles();

  return (
    <div className="bg-white">
      <SEO 
        title={article.title}
        description={article.excerpt || article.content.substring(0, 160).replace(/<[^>]*>/g, '')}
        keywords={article.keywords || [
          'sfaturi imobiliare',
          'ghid imobiliar',
          'piata imobiliara arad',
          'imobiliare altfel',
          'articole imobiliare',
          article.category.toLowerCase(),
          ...article.title.toLowerCase().split(' ')
        ]}
        image={article.image}
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gray-900">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium mb-4">
                {dbArticle ? t(`articles.categories.${article.category}`) : article.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {article.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Icons.Calendar size={20} />
                  <span>{dbArticle ? new Date(article.published_at || '').toLocaleDateString() : article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Clock size={20} />
                  <span>{article.readTime} {t('articles.readTime')}</span>
                </div>
                {article.author && (
                  <div className="flex items-center gap-2">
                    <Icons.User size={20} />
                    <span>{dbArticle ? article.author : 'Alex Popescu'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg prose-purple max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: dbArticle 
                  ? article.content.replace(/\n/g, '<br>') 
                  : article.content 
              }}
            />

            {/* Related Articles */}
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">{t('articles.relatedArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map(relatedArticle => (
                  <article 
                    key={relatedArticle.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => navigate(`/article/${relatedArticle.id}`)}
                  >
                    <div className="relative h-48">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">
                        {relatedArticle.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Icons.Calendar size={16} />
                          <span>{relatedArticle.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icons.Clock size={16} />
                          {t(`articles.categories.${relatedArticle.category}`) || relatedArticle.category}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Icons.ArrowLeft size={20} />
                {t('buttons.back')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Article;