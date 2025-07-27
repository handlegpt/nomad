'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  HomeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function GuidesPage() {
  const t = useTranslations('guides');
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const guides = [
    {
      key: 'visa_guide',
      title: t('visa_guide.title'),
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      key: 'moving_checklist',
      title: t('moving_checklist.title'),
      icon: ClipboardDocumentListIcon,
      color: 'green'
    },
    {
      key: 'coworking_guide',
      title: t('coworking_guide.title'),
      icon: HomeIcon,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderGuide = (guide: any) => {
    const guideData = t.raw(guide.key);
    const isExpanded = expandedGuide === guide.key;
    const IconComponent = guide.icon;

    return (
      <div key={guide.key} className="bg-white rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => setExpandedGuide(isExpanded ? null : guide.key)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${getColorClasses(guide.color)}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{guide.title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-200">
            {guide.key === 'visa_guide' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">申请步骤</h4>
                  <ol className="space-y-2">
                    {guideData.steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">常见所需文件</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {guideData.common_documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {guide.key === 'moving_checklist' && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">搬家前准备清单</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guideData.items.map((item: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.key === 'coworking_guide' && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">寻找共同居住空间的技巧</h4>
                <div className="space-y-3">
                  {guideData.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2"></div>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="space-y-6">
          {guides.map(renderGuide)}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">额外资源</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">官方资源</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 各国大使馆官网</li>
                <li>• 移民局官方网站</li>
                <li>• 税务部门网站</li>
                <li>• 当地政府信息</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">社区资源</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Nomad List 社区</li>
                <li>• Reddit 数字游民版块</li>
                <li>• Facebook 游民群组</li>
                <li>• 当地游民社区</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 