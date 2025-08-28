'use client'

import { useState } from 'react'
import { MessageCircleIcon, MapPinIcon, CalendarIcon, HeartIcon } from 'lucide-react'

interface CommunityPost {
  id: string
  user: string
  location: string
  message: string
  timestamp: string
  likes: number
  isLiked: boolean
}

export default function CommunitySection() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      user: 'Sarah M.',
      location: 'Lisbon, Portugal',
      message: '在里斯本找到了一家超棒的咖啡馆，WiFi速度很快，咖啡也很棒！有谁想一起工作吗？',
      timestamp: '2小时前',
      likes: 12,
      isLiked: false
    },
    {
      id: '2',
      user: 'Mike R.',
      location: 'Chiang Mai, Thailand',
      message: '清迈的雨季开始了，但还是很舒服。推荐大家去宁曼路的咖啡馆，环境很好。',
      timestamp: '4小时前',
      likes: 8,
      isLiked: false
    },
    {
      id: '3',
      user: 'Emma L.',
      location: 'Tbilisi, Georgia',
      message: '第比利斯的签证政策真的很友好，可以待一年！有谁在这里的吗？',
      timestamp: '6小时前',
      likes: 15,
      isLiked: false
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [userLocation, setUserLocation] = useState('')

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !userLocation.trim()) return

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      user: '你',
      location: userLocation,
      message: newMessage,
      timestamp: '刚刚',
      likes: 0,
      isLiked: false
    }

    setPosts(prev => [newPost, ...prev])
    setNewMessage('')
    setUserLocation('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          💬 Nomad 社区
        </h2>
        <span className="text-sm text-gray-500">实时动态</span>
      </div>

      {/* New Post Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3 mb-3">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="你在哪个城市？"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="分享你的游民生活..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !userLocation.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            发布
          </button>
        </div>
      </form>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {post.user.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{post.user}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPinIcon className="h-3 w-3" />
                    <span>{post.location}</span>
                    <CalendarIcon className="h-3 w-3" />
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">{post.message}</p>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1 text-sm transition-colors ${
                  post.isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <HeartIcon className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <MessageCircleIcon className="h-4 w-4" />
                <span>回复</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          查看更多动态 →
        </button>
      </div>
    </div>
  )
}
