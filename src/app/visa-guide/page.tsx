'use client'

import { useState } from 'react'
import { SearchIcon, BookOpenIcon, CalendarIcon, GlobeIcon, DollarSignIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import PageLayout from '@/components/PageLayout'

interface VisaGuide {
  id: string
  country: string
  countryCode: string
  visaType: string
  duration: string
  cost: string
  requirements: string[]
  process: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  processingTime: string
}

const visaGuides: VisaGuide[] = [
  {
    id: '1',
    country: 'Portugal',
    countryCode: 'PT',
    visaType: 'Digital Nomad Visa',
    duration: '1 year (renewable)',
    cost: '€75',
    requirements: [
      'Monthly income of at least €2,800',
      'Health insurance',
      'Criminal record certificate',
      'Accommodation proof'
    ],
    process: [
      'Online application',
      'Submit required documents',
      'Pay application fee',
      'Wait for approval (2-4 weeks)'
    ],
    difficulty: 'medium',
    processingTime: '2-4 weeks'
  },
  {
    id: '2',
    country: 'Thailand',
    countryCode: 'TH',
    visaType: 'Tourist Visa',
    duration: '60 days (extendable)',
    cost: '$40',
    requirements: [
      'Valid passport (6+ months validity)',
      'Round-trip ticket',
      'Accommodation proof',
      'Financial proof'
    ],
    process: [
      'Apply at embassy or consulate',
      'Submit application form and documents',
      'Pay visa fee',
      'Wait for approval (3-5 business days)'
    ],
    difficulty: 'easy',
    processingTime: '3-5 business days'
  },
  {
    id: '3',
    country: 'Japan',
    countryCode: 'JP',
    visaType: 'Tourist Visa',
    duration: '90 days',
    cost: 'Free',
    requirements: [
      'Valid passport',
      'Round-trip ticket',
      'Accommodation proof',
      'Travel itinerary'
    ],
    process: [
      'Apply through designated travel agency',
      'Submit required documents',
      'Wait for approval (5-10 business days)',
      'Collect visa'
    ],
    difficulty: 'medium',
    processingTime: '5-10 business days'
  },
  {
    id: '4',
    country: 'Mexico',
    countryCode: 'MX',
    visaType: 'Temporary Resident Visa',
    duration: '1 year (renewable)',
    cost: '$36',
    requirements: [
      'Monthly income of at least $2,500',
      'Bank statements (6 months)',
      'Criminal background check',
      'Health certificate'
    ],
    process: [
      'Apply at Mexican consulate',
      'Submit financial documents',
      'Attend interview',
      'Wait for approval (1-2 weeks)'
    ],
    difficulty: 'medium',
    processingTime: '1-2 weeks'
  },
  {
    id: '5',
    country: 'Estonia',
    countryCode: 'EE',
    visaType: 'Digital Nomad Visa',
    duration: '1 year',
    cost: '€100',
    requirements: [
      'Monthly income of at least €3,504',
      'Valid health insurance',
      'Clean criminal record',
      'Proof of remote work'
    ],
    process: [
      'Apply online through e-Residency',
      'Submit digital documents',
      'Pay application fee',
      'Receive approval (2-4 weeks)'
    ],
    difficulty: 'easy',
    processingTime: '2-4 weeks'
  },
  {
    id: '6',
    country: 'Croatia',
    countryCode: 'HR',
    visaType: 'Digital Nomad Visa',
    duration: '1 year',
    cost: '€60',
    requirements: [
      'Monthly income of at least €2,300',
      'Health insurance coverage',
      'Criminal record certificate',
      'Proof of remote work'
    ],
    process: [
      'Apply at Croatian embassy/consulate',
      'Submit required documents',
      'Pay application fee',
      'Wait for approval (2-3 weeks)'
    ],
    difficulty: 'medium',
    processingTime: '2-3 weeks'
  }
]

export default function VisaGuidePage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedDuration, setSelectedDuration] = useState<string>('all')

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    return t(`visaGuide.difficulty.${difficulty}`)
  }

  const filteredGuides = visaGuides.filter(guide => {
    const matchesSearch = guide.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.visaType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty
    const matchesDuration = selectedDuration === 'all' || guide.duration.includes(selectedDuration)
    
    return matchesSearch && matchesDifficulty && matchesDuration
  })

  return (
    <PageLayout pageTitle={t('visaGuide.title')} showPageTitle={true}>
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpenIcon className="h-8 w-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            {t('visaGuide.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('visaGuide.subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card card-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('visaGuide.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('visaGuide.filters.difficulty.all')}</option>
              <option value="easy">{t('visaGuide.filters.difficulty.easy')}</option>
              <option value="medium">{t('visaGuide.filters.difficulty.medium')}</option>
              <option value="hard">{t('visaGuide.filters.difficulty.hard')}</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('visaGuide.filters.duration.all')}</option>
              <option value="30 days">{t('visaGuide.filters.duration.30days')}</option>
              <option value="60 days">{t('visaGuide.filters.duration.60days')}</option>
              <option value="90 days">{t('visaGuide.filters.duration.90days')}</option>
              <option value="1 year">{t('visaGuide.filters.duration.1year')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visa Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <div key={guide.id} className="card card-lg">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getCountryFlag(guide.countryCode)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{guide.country}</h3>
                    <p className="text-gray-600">{guide.visaType}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(guide.difficulty)}`}>
                  {getDifficultyText(guide.difficulty)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{t('visaGuide.card.duration')}：</span>
                  <span className="font-medium">{guide.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSignIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{t('visaGuide.card.cost')}：</span>
                  <span className="font-medium">{guide.cost}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GlobeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{t('visaGuide.card.processingTime')}：</span>
                  <span className="font-medium">{guide.processingTime}</span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">{t('visaGuide.card.requirements')}</h4>
              <ul className="space-y-2">
                {guide.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">{t('visaGuide.card.process')}</h4>
              <div className="space-y-3">
                {guide.process.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('visaGuide.noResults.title')}
          </h3>
          <p className="text-gray-600">
            {t('visaGuide.noResults.description')}
          </p>
        </div>
      )}
    </PageLayout>
  )
}
