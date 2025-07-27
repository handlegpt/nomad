'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { StarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export default function ToolsPage() {
  const t = useTranslations('tools');
  const [activeCategory, setActiveCategory] = useState('banking');

  const categories = [
    { key: 'banking', label: t('banking.title') },
    { key: 'insurance', label: t('insurance.title') },
    { key: 'remote_work', label: t('remote_work.title') },
    { key: 'language_learning', label: t('language_learning.title') }
  ];

  const renderToolCard = (tool: any) => (
    <div key={tool.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">{tool.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{tool.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{t('features_label')}:</h4>
        <ul className="space-y-1">
          {tool.features.map((feature: string, index: number) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        {t('visit_website')}
        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.raw(activeCategory).items.map(renderToolCard)}
        </div>
      </div>
    </div>
  );
} 