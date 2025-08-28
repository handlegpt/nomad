'use client'

import { useState } from 'react'
import { Crown, Check, Star, Download, Bell, Users } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function PremiumFeatures() {
  const { t } = useTranslation()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  const features = [
    {
      name: t('premiumFeatures.pdfReport'),
      description: t('premiumFeatures.pdfReportDesc'),
      icon: Download
    },
    {
      name: t('premiumFeatures.visaReminder'),
      description: t('premiumFeatures.visaReminderDesc'),
      icon: Bell
    },
    {
      name: t('premiumFeatures.aiAssistant'),
      description: t('premiumFeatures.aiAssistantDesc'),
      icon: Star
    },
    {
      name: t('premiumFeatures.dataAnalysis'),
      description: t('premiumFeatures.dataAnalysisDesc'),
      icon: Users
    }
  ]

  const plans = {
    monthly: {
      price: 9.99,
      period: t('premiumFeatures.month'),
      savings: null
    },
    yearly: {
      price: 99.99,
      period: t('premiumFeatures.year'),
      savings: t('premiumFeatures.savings')
    }
  }

  const currentPlan = plans[selectedPlan]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('premiumFeatures.title')}</h2>
        <p className="text-gray-600">{t('premiumFeatures.subtitle')}</p>
      </div>

      {/* Plan Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('premiumFeatures.monthly')}
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('premiumFeatures.yearly')}
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">{t('premiumFeatures.comingSoon')}</span>
        </div>
        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
          🚀 {t('premiumFeatures.comingSoon')}
        </span>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{feature.name}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA Button */}
      <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-500 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
        <Crown className="h-5 w-5 mr-2" />
        {t('premiumFeatures.comingSoon')}
      </button>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {t('premiumFeatures.comingSoonDesc')}
        </p>
      </div>
    </div>
  )
}
