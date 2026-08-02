import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleBySlug } from '../../utils/markdown';
import Seo from '../../components/Seo';

const ArticlePost = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const data = await getArticleBySlug(slug);
      setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-zinc-400 hover:text-white transition-colors">
          &larr; Back to Articles
        </Link>
      </div>
    );
  }

  const { data, content } = article;

  return (
    <>
      <Seo 
        title={data.title}
        description={data.description}
        url={`/articles/${slug}`}
        type="article"
      />
      <div className="min-h-screen bg-zinc-950">
        {/* Elegant Gradient Header */}
        <header className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/60 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="max-w-3xl mx-auto">
            <Link 
              to="/articles" 
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-10 font-inter text-sm tracking-wide uppercase"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Library
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-geist font-bold text-white mb-8 leading-[1.1] tracking-tight">
              {data.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-inter">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <span className="material-symbols-outlined text-[16px] text-zinc-300">person</span>
                </div>
                <span className="font-medium text-zinc-200">{data.author || 'Excode Team'}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl mx-auto">
            {/* 
              Tailwind Typography customized for the Zinc theme:
              - prose-zinc sets the base color palette
              - prose-headings:font-geist uses sans-serif for modern headers
              - prose-p:font-serif uses serif for highly readable, elegant body text
            */}
            <div className="prose prose-zinc prose-invert prose-lg max-w-none 
              prose-headings:font-geist prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-100
              prose-p:font-serif prose-p:leading-relaxed prose-p:text-zinc-300
              prose-a:text-white prose-a:underline-offset-4 hover:prose-a:text-zinc-300
              prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800/60
              prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-400 prose-blockquote:font-serif prose-blockquote:italic
              prose-strong:text-zinc-200 prose-strong:font-semibold
              prose-li:text-zinc-300 prose-li:font-serif">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
            
            <hr className="my-16 border-zinc-800/60" />
            
            <div className="flex justify-between items-center text-zinc-400 font-inter">
              <p>Enjoyed this article?</p>
              <Link to="/articles" className="text-white hover:underline underline-offset-4">
                Read more &rarr;
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default ArticlePost;
