'use client';

import { useTranslations } from 'next-intl';
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function TaxPage() {
  const t = useTranslations('tax_reminder');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 183 Day Rule */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <CalendarIcon className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">{t('183_day_rule.title')}</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{t('183_day_rule.description')}</p>
            
            <div className="space-y-4">
              {t.raw('183_day_rule.countries').map((country: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{country.name}</h3>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {country.days} 天
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{country.notes}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">重要提醒</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    不同国家的税务规则可能有所不同，建议在长期停留前咨询专业税务顾问。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Double Taxation Treaties */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">{t('double_taxation.title')}</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{t('double_taxation.description')}</p>
            
            <div className="space-y-4">
              {t.raw('double_taxation.common_treaties').map((treaty: string, index: number) => (
                <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">{treaty}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">税务条约优势</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• 避免双重征税</li>
                    <li>• 降低税率</li>
                    <li>• 简化税务申报</li>
                    <li>• 提供税务确定性</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">税务规划建议</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">记录停留时间</h3>
              <p className="text-sm text-gray-600">
                详细记录在每个国家的停留时间，包括出入境记录和住宿证明。
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">了解税务条约</h3>
              <p className="text-sm text-gray-600">
                研究目的地国家与您国籍国的税务条约，了解适用的税率和豁免。
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">寻求专业建议</h3>
              <p className="text-sm text-gray-600">
                在复杂情况下，建议咨询国际税务专家，确保合规并优化税务负担。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 