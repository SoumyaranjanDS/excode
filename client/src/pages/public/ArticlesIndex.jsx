import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../../utils/markdown';
import Seo from '../../components/Seo';

const ArticlesIndex = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getAllArticles();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  if (articles.length === 0) return null;

  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <>
      <Seo 
        title="Development Challenges & Engineering Articles"
        description="Learn how to solve real world development problems, fix race conditions, and pass technical system design interviews."
        url="/articles"
      />
      <div className="min-h-screen bg-zinc-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-zinc-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-geist font-bold mb-4 tracking-tight text-white">
              Engineering Library
            </h1>
            <p className="text-lg text-zinc-400 font-inter max-w-2xl">
              Deep dives into real world development problems, architectural patterns, and the hardest engineering challenges.
            </p>
          </div>

          {/* Hero Article */}
          <Link 
            to={`/articles/${heroArticle.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden transition-all hover:bg-zinc-900/60 hover:border-zinc-700"
          >
            <div className="h-64 lg:h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-900">
                <img 
                  src="/tech_blog_cover.png" 
                  alt="Abstract tech representation" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold tracking-wider uppercase text-zinc-950 bg-zinc-100 px-3 py-1 rounded-full">
                  Featured
                </span>
                <span className="text-sm font-jetbrains text-zinc-400">
                  {new Date(heroArticle.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-geist font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">
                {heroArticle.title}
              </h2>
              
              <p className="text-zinc-400 font-serif text-lg mb-8 line-clamp-3 leading-relaxed">
                {heroArticle.description}
              </p>
              
              <div className="flex items-center gap-2 text-white font-medium mt-auto group-hover:gap-3 transition-all">
                Read full article
                <span className="material-symbols-outlined text-[20px]">
                  arrow_right_alt
                </span>
              </div>
            </div>
          </Link>

          {/* Recent Articles Grid */}
          <div className="mb-10">
            <h3 className="text-2xl font-geist font-bold text-white mb-8 border-b border-zinc-800 pb-4">
              Latest Articles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingArticles.map((article) => (
                <Link 
                  key={article.slug} 
                  to={`/articles/${article.slug}`}
                  className="flex flex-col group"
                >
                  <div className="flex flex-col h-full bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 transition-all hover:bg-zinc-900/50 hover:-translate-y-1 hover:border-zinc-700">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-jetbrains text-zinc-500">
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-geist font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    
                    <p className="text-zinc-400 font-serif mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-zinc-300 font-medium mt-auto group-hover:text-white">
                      Read Article
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_right_alt
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default ArticlesIndex;
