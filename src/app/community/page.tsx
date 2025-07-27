'use client';

import { useTranslations } from 'next-intl';
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function CommunityPage() {
  const t = useTranslations('community');

  const platforms = [
    {
      key: 'telegram',
      title: t('telegram.title'),
      icon: ChatBubbleLeftRightIcon,
      color: 'blue',
      description: '实时聊天和文件分享',
      groups: t.raw('telegram.groups')
    },
    {
      key: 'discord',
      title: t('discord.title'),
      icon: UserGroupIcon,
      color: 'purple',
      description: '语音聊天和频道讨论',
      groups: t.raw('discord.servers')
    },
    {
      key: 'facebook',
      title: t('facebook.title'),
      icon: GlobeAltIcon,
      color: 'indigo',
      description: '大型社区和活动组织',
      groups: t.raw('facebook.groups')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      indigo: 'bg-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderPlatform = (platform: any) => {
    const IconComponent = platform.icon;

    return (
      <div key={platform.key} className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${getColorClasses(platform.color)} p-6 text-white`}>
          <div className="flex items-center mb-4">
            <IconComponent className="h-8 w-8 mr-3" />
            <h3 className="text-2xl font-bold">{platform.title}</h3>
          </div>
          <p className="text-blue-100">{platform.description}</p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {platform.groups.map((group: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${getColorClasses(platform.color)}`}></div>
                  <span className="text-gray-900 font-medium">{group}</span>
                </div>
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {platforms.map(renderPlatform)}
        </div>

        {/* Community Tips */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">加入社区的建议</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">新手入门</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span>先加入大型通用群组，了解基本信息和社区文化</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span>阅读群组规则和常见问题，避免重复提问</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span>积极参与讨论，分享自己的经验和问题</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span>尊重其他成员，保持友善和建设性的交流</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">社区礼仪</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <span>使用搜索功能，避免重复提问已有答案的问题</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <span>分享有价值的信息，帮助其他游民</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <span>保持隐私意识，不要过度分享个人信息</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <span>遵守当地法律和社区规则</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Local Communities */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">寻找当地社区</h2>
          <p className="text-blue-100 mb-6">
            除了在线社区，建议也寻找和加入当地的数字游民社区，这样可以获得更直接的支持和友谊。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">联合办公空间</h3>
              <p className="text-blue-100 text-sm">在联合办公空间结识其他游民，参与社区活动</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">咖啡厅和餐厅</h3>
              <p className="text-blue-100 text-sm">在游民常去的场所寻找志同道合的朋友</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">当地活动</h3>
              <p className="text-blue-100 text-sm">参加技术聚会、语言交换和文化活动</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 