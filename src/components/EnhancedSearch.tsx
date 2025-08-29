'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export interface SearchFilter {
  key: string
  label: string
  type: 'select' | 'range' | 'checkbox' | 'date'
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
}

export interface SearchResult<T> {
  data: T[]
  total: number
  filtered: number
}

interface EnhancedSearchProps<T> {
  data: T[]
  searchKeys: (keyof T)[]
  filters?: SearchFilter[]
  placeholder?: string
  onSearch?: (results: SearchResult<T>) => void
  onFilterChange?: (filters: Record<string, any>) => void
  debounceMs?: number
  className?: string
  showAdvancedFilters?: boolean
}

export default function EnhancedSearch<T extends Record<string, any>>({
  data,
  searchKeys,
  filters = [],
  placeholder = '搜索...',
  onSearch,
  onFilterChange,
  debounceMs = 300,
  className = '',
  showAdvancedFilters = true
}: EnhancedSearchProps<T>) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  // 搜索和筛选逻辑
  const searchResults = useMemo(() => {
    let filteredData = [...data]

    // 文本搜索
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filteredData = filteredData.filter(item =>
        searchKeys.some(key => {
          const value = item[key]
          return value && value.toString().toLowerCase().includes(searchLower)
        })
      )
    }

    // 应用筛选器
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue !== '' && filterValue !== null && filterValue !== undefined) {
        const filter = filters.find(f => f.key === filterKey)
        if (filter) {
          filteredData = filteredData.filter(item => {
            const itemValue = item[filterKey]
            
            switch (filter.type) {
              case 'select':
                return itemValue === filterValue
              case 'range':
                const [min, max] = filterValue
                return itemValue >= min && itemValue <= max
              case 'checkbox':
                return Array.isArray(filterValue) 
                  ? filterValue.includes(itemValue)
                  : itemValue === filterValue
              case 'date':
                const itemDate = new Date(itemValue)
                const filterDate = new Date(filterValue)
                return itemDate >= filterDate
              default:
                return true
            }
          })
        }
      }
    })

    return {
      data: filteredData,
      total: data.length,
      filtered: filteredData.length
    }
  }, [data, searchKeys, debouncedSearchTerm, activeFilters, filters])

  // 通知父组件搜索结果
  useEffect(() => {
    onSearch?.(searchResults)
  }, [searchResults, onSearch])

  // 处理筛选器变化
  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    const newFilters = { ...activeFilters, [filterKey]: value }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }, [activeFilters, onFilterChange])

  // 清除所有筛选器
  const clearAllFilters = useCallback(() => {
    setActiveFilters({})
    onFilterChange?.({})
  }, [onFilterChange])

  // 渲染筛选器组件
  const renderFilter = (filter: SearchFilter) => {
    const value = activeFilters[filter.key]

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('search.all')}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'range':
        const [min, max] = value || [filter.min || 0, filter.max || 100]
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{min}</span>
              <span>{max}</span>
            </div>
            <input
              type="range"
              min={filter.min || 0}
              max={filter.max || 100}
              step={filter.step || 1}
              value={max}
              onChange={(e) => handleFilterChange(filter.key, [min, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : value === option.value}
                  onChange={(e) => {
                    if (Array.isArray(value)) {
                      const newValue = e.target.checked
                        ? [...value, option.value]
                        : value.filter(v => v !== option.value)
                      handleFilterChange(filter.key, newValue)
                    } else {
                      handleFilterChange(filter.key, e.target.checked ? option.value : null)
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      default:
        return null
    }
  }

  // 计算活跃筛选器数量
  const activeFilterCount = Object.values(activeFilters).filter(v => 
    v !== '' && v !== null && v !== undefined && 
    !(Array.isArray(v) && v.length === 0)
  ).length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 高级筛选器 */}
      {showAdvancedFilters && filters.length > 0 && (
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{t('search.advancedFilters')}</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {showFilters ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {showFilters && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map(filter => (
                  <div key={filter.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {filter.label}
                    </label>
                    {renderFilter(filter)}
                  </div>
                ))}
              </div>
              
              {activeFilterCount > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {t('search.clearAll')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 搜索结果统计 */}
      {searchResults.total > 0 && (
        <div className="text-sm text-gray-600">
          {t('search.results', { 
            filtered: searchResults.filtered.toString(), 
            total: searchResults.total.toString() 
          })}
        </div>
      )}
    </div>
  )
}
