import { Metadata } from 'next'
import { getCities } from '@/lib/api'

interface CityLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export async function generateMetadata({ params }: CityLayoutProps): Promise<Metadata> {
  const citySlug = params.slug
  
  try {
    // 获取城市信息
    const allCities = await getCities()
    const city = allCities.find(c => 
      c.name.toLowerCase().replace(/\s+/g, '-') === citySlug.toLowerCase() ||
      c.name.toLowerCase().replace(/\s+/g, '_') === citySlug.toLowerCase()
    )
    
    if (!city) {
      return {
        title: '城市未找到 | Nomad Now',
        description: '抱歉，您查找的城市信息未找到。',
      }
    }

    return {
      title: `${city.name} - 数字游民城市指南 | Nomad Now`,
      description: `探索${city.name}的数字游民生活：生活成本${city.cost_of_living}美元/月，WiFi速度${city.wifi_speed}Mbps，签证停留${city.visa_days}天。查看详细的城市信息、优缺点、用户评价和实用建议。`,
      keywords: [
        city.name,
        '数字游民',
        '远程工作',
        '生活成本',
        'WiFi速度',
        '签证信息',
        '联合办公',
        '旅游指南',
        'Nomad Now'
      ].join(', '),
      openGraph: {
        title: `${city.name} - 数字游民城市指南`,
        description: `探索${city.name}的数字游民生活：生活成本${city.cost_of_living}美元/月，WiFi速度${city.wifi_speed}Mbps，签证停留${city.visa_days}天。`,
        type: 'website',
        locale: 'zh_CN',
        siteName: 'Nomad Now',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${city.name} - 数字游民城市指南`,
        description: `探索${city.name}的数字游民生活：生活成本${city.cost_of_living}美元/月，WiFi速度${city.wifi_speed}Mbps，签证停留${city.visa_days}天。`,
      },
      alternates: {
        canonical: `https://nomadnow.app/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
    }
  } catch (error) {
    return {
      title: '城市信息 | Nomad Now',
      description: '获取城市详细信息时出现错误。',
    }
  }
}

export async function generateStaticParams() {
  try {
    const cities = await getCities()
    return cities.map((city) => ({
      slug: city.name.toLowerCase().replace(/\s+/g, '-'),
    }))
  } catch (error) {
    return []
  }
}

export default function CityLayout({ children }: CityLayoutProps) {
  return children
}
