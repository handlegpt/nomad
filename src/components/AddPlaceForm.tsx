'use client'

import { useState } from 'react'
import { 
  XIcon, 
  MapPinIcon, 
  WifiIcon, 
  DollarSignIcon, 
  Volume2Icon,
  UsersIcon,
  CoffeeIcon,
  MonitorIcon,
  HomeIcon,
  UtensilsIcon,
  TreePine
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface AddPlaceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (placeData: any) => void
}

export default function AddPlaceForm({ isOpen, onClose, onSubmit }: AddPlaceFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    category: 'cafe',
    address: '',
    description: '',
    tags: [] as string[],
    wifi_speed: '',
    price_level: 3,
    noise_level: 'moderate',
    social_atmosphere: 'medium'
  })
  const [newTag, setNewTag] = useState('')

  const categories = [
    { id: 'cafe', name: '☕ 咖啡馆', icon: <CoffeeIcon className="h-4 w-4" /> },
    { id: 'coworking', name: '💻 Co-working', icon: <MonitorIcon className="h-4 w-4" /> },
    { id: 'coliving', name: '🏠 Coliving', icon: <HomeIcon className="h-4 w-4" /> },
    { id: 'restaurant', name: '🍽 餐馆', icon: <UtensilsIcon className="h-4 w-4" /> },
    { id: 'park', name: '🌳 公园', icon: <TreePine className="h-4 w-4" /> },
    { id: 'other', name: '📍 其他', icon: <MapPinIcon className="h-4 w-4" /> }
  ]

  const suggestedTags = [
    '安静', 'WiFi快', '咖啡好', '价格合理', '位置便利', '设施齐全',
    '社区好', '风景美', '食物好吃', '服务好', '24小时', '宠物友好'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      wifi_speed: formData.wifi_speed ? parseInt(formData.wifi_speed) : undefined
    })
    // 重置表单
    setFormData({
      name: '',
      category: 'cafe',
      address: '',
      description: '',
      tags: [],
      wifi_speed: '',
      price_level: 3,
      noise_level: 'moderate',
      social_atmosphere: 'medium'
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">添加推荐地点</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">基本信息</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  地点名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="例如：Blue Bottle Coffee"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleInputChange('category', category.id)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.category === category.id
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  地址 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="详细地址"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述 *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="分享你的体验和感受..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">标签</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  添加标签
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="输入自定义标签"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newTag)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    添加
                  </button>
                </div>
                
                {/* Suggested Tags */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">推荐标签：</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">已选标签：</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">详细信息</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <WifiIcon className="h-4 w-4 inline mr-1" />
                    WiFi速度 (Mbps)
                  </label>
                  <input
                    type="number"
                    value={formData.wifi_speed}
                    onChange={(e) => handleInputChange('wifi_speed', e.target.value)}
                    placeholder="可选"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSignIcon className="h-4 w-4 inline mr-1" />
                    价格水平
                  </label>
                  <select
                    value={formData.price_level}
                    onChange={(e) => handleInputChange('price_level', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={1}>$ 便宜</option>
                    <option value={2}>$$ 适中</option>
                    <option value={3}>$$$ 中等</option>
                    <option value={4}>$$$$ 较贵</option>
                    <option value={5}>$$$$$ 昂贵</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Volume2Icon className="h-4 w-4 inline mr-1" />
                    噪音水平
                  </label>
                  <select
                    value={formData.noise_level}
                    onChange={(e) => handleInputChange('noise_level', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="quiet">安静</option>
                    <option value="moderate">适中</option>
                    <option value="loud">嘈杂</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UsersIcon className="h-4 w-4 inline mr-1" />
                    社交氛围
                  </label>
                  <select
                    value={formData.social_atmosphere}
                    onChange={(e) => handleInputChange('social_atmosphere', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                提交推荐
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
