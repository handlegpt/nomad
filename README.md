# NOMAD.NOW

数字游民的工具平台 - 极简风格，专注于实用信息

## 🌟 特色功能

- **实时信息显示**: 当前位置时间、天气、WiFi速度、签证剩余天数
- **签证倒计时提醒**: 智能提醒系统，避免签证逾期
- **城市投票榜单**: 社区驱动的城市推荐系统，支持多维度评分
- **AI个性化推荐**: 基于用户偏好智能推荐城市
- **城市对比工具**: 可视化对比多个城市的各项指标
- **多语言支持**: 中文、西班牙语、日语完整翻译
- **极简设计**: 像 time.is 一样简洁，一眼看到关键信息
- **自动化数据**: 天气、时间自动更新，减少维护成本
- **社区互动**: 轻量化社交功能，增加用户粘性
- **盈利模式**: 订阅制 + Affiliate 链接，可持续运营

## 🚀 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth + Real-time)
- **API集成**: 
  - 世界时间: worldtimeapi.org
  - 天气: OpenWeatherMap API
  - WiFi速度: 缓存第三方统计数据
- **图标**: Lucide React
- **多语言**: 自定义i18n系统
- **部署**: Docker + Docker Compose

## 🌍 多语言支持

### 支持的语言
- 🇨🇳 **中文** (zh) - 默认语言
- 🇪🇸 **西班牙语** (es) - Español
- 🇯🇵 **日语** (ja) - 日本語

### 语言切换
- 页面右上角的语言切换器
- 自动检测浏览器语言
- 本地存储语言偏好
- 支持URL参数切换语言

### 翻译文件结构
```
src/i18n/
├── config.ts                    # 语言配置
├── utils.ts                     # 翻译工具函数
├── translations/
│   ├── zh.json                  # 中文翻译
│   ├── es.json                  # 西班牙语翻译
│   └── ja.json                  # 日语翻译
└── hooks/
    └── useTranslation.ts        # 翻译Hook
```

## 📦 快速部署 (Docker)

### 1. 克隆项目
```bash
git clone <repository-url>
cd nomad-now
```

### 2. 配置环境变量
```bash
# 运行配置脚本
chmod +x setup-env.sh
./setup-env.sh
```

按提示输入你的API密钥：
- Supabase URL 和 Anon Key
- OpenWeather API Key

### 3. 一键部署
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. 访问网站
打开浏览器访问: http://localhost:3011

## 🔧 手动配置

如果你想手动配置环境变量，请编辑 `docker-compose.yml` 文件：

```yaml
environment:
  - NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  - NEXT_PUBLIC_OPENWEATHER_API_KEY=your-openweather-api-key-here
```

## 📦 本地开发

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp env.example .env.local
# 编辑 .env.local 文件
```

3. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3011](http://localhost:3011)

## 🏗️ 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # 首页
│   ├── setup/          # 快速设置页面
│   ├── cities/         # 城市详情页
│   └── layout.tsx      # 布局
├── components/         # React组件
│   ├── CurrentLocationCard.tsx      # 当前位置信息卡片
│   ├── CityRanking.tsx             # 城市排行榜
│   ├── VoteModal.tsx              # 投票模态框
│   ├── NomadTip.tsx               # Nomad小贴士
│   ├── CommunitySection.tsx       # 社区功能
│   ├── PremiumFeatures.tsx        # 高级功能
│   ├── VisaCountdown.tsx          # 签证倒计时
│   ├── PersonalizedRecommendations.tsx # AI个性化推荐
│   ├── CityComparison.tsx         # 城市对比工具
│   └── LanguageSwitcher.tsx       # 语言切换器
├── i18n/               # 多语言系统
│   ├── config.ts       # 语言配置
│   ├── utils.ts        # 翻译工具
│   ├── translations/   # 翻译文件
│   └── hooks/          # 翻译Hook
├── lib/               # 工具库
│   ├── api.ts         # API服务
│   └── supabase.ts    # Supabase配置
└── styles/            # 样式文件
```

## 💡 核心功能

### 1. 当前位置信息卡片
- 显示用户当前位置
- 实时时间（基于时区）
- 当前天气状况
- WiFi速度（模拟数据）
- 签证剩余天数

### 2. 签证倒计时提醒
- 智能倒计时显示
- 不同状态的颜色提示
- 详细建议和行动指南
- 邮件和日历提醒功能

### 3. 城市投票榜单
- 显示热门城市排名
- 支持快速点赞/踩投票
- 多维度详细评分（WiFi、社交、性价比、气候）
- 实时更新排名
- 城市搜索和筛选

### 4. AI个性化推荐
- 基于用户偏好设置
- 多维度权重调整
- 智能匹配算法
- 个性化城市推荐

### 5. 城市对比工具
- 支持2-4个城市对比
- 可视化图表展示
- 多维度指标对比
- PDF导出功能（高级版）

### 6. Nomad小贴士
- 每日签证和生活小贴士
- 邮件订阅功能
- 签证到期提醒

### 7. 社区功能
- 轻量化社交动态
- 用户分享当前位置和体验
- 点赞和回复功能
- 增加用户粘性

### 8. 高级功能（盈利模式）
- 城市对比报告导出
- 签证到期提醒
- 个性化推荐
- 订阅制收费
- Affiliate链接（住宿、签证、保险、Co-working）

### 9. 快速设置向导
- 3步快速设置
- 个人信息收集
- 偏好设置
- 本地存储

### 10. 多语言系统
- 完整的中文、西班牙语、日语翻译
- 自动语言检测
- 语言偏好保存
- 动态语言切换

## 🎯 设计理念

### 极简 + 社区的平衡
- 首页保持极简，一眼看到关键信息
- 城市榜单作为次要入口，避免信息过载
- 投票机制增加用户参与度
- 轻量化社交功能

### 用户粘性设计
- 签证倒计时提醒
- 每日小贴士
- 社区互动
- 个性化推荐
- 智能提醒系统

### 盈利模式
- **订阅制**: 月度$9.99，年度$99.99
- **Affiliate**: 住宿、签证、保险、Co-working空间
- **广告**: 精准投放，不影响用户体验

### 国际化策略
- **本地化**: 完整的多语言支持
- **文化适应**: 针对不同地区的签证政策
- **货币支持**: 多币种显示
- **时区处理**: 智能时区转换

## 🔧 开发指南

### 添加新语言
1. 在 `src/i18n/config.ts` 中添加新语言配置
2. 创建翻译文件 `src/i18n/translations/[locale].json`
3. 更新语言检测逻辑

### 添加新城市
1. 在 `database/init.sql` 中添加城市数据
2. 确保包含所有必要字段（坐标、时区等）

### 自定义API
- 天气API: 修改 `src/lib/api.ts` 中的 `getWeather` 函数
- 时间API: 修改 `getWorldTime` 函数
- WiFi数据: 集成Ookla Speedtest API

### 样式定制
- 使用 Tailwind CSS 类名
- 主要颜色: blue-600, purple-600
- 圆角: rounded-2xl
- 阴影: shadow-lg

## 📈 部署

### Docker部署（推荐）
```bash
# 一键部署
./deploy.sh

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

### Vercel部署
```bash
npm run build
vercel --prod
```

## 🚀 未来规划

### 短期目标
- [ ] 用户认证系统
- [ ] 真实地理位置检测
- [ ] 更多城市数据
- [ ] 移动端优化
- [ ] 实时聊天功能
- [ ] 更多语言支持（英语、法语、德语）

### 中期目标
- [ ] AI个性化推荐优化
- [ ] 城市详情页面
- [ ] 多语言SEO优化
- [ ] 移动应用开发
- [ ] 数据分析和洞察
- [ ] 本地化内容策略

### 长期目标
- [ ] 企业版功能
- [ ] 全球社区建设
- [ ] 高级AI功能
- [ ] 生态系统建设
- [ ] 区域化运营

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 翻译贡献
如果你想帮助翻译，请：
1. Fork 项目
2. 添加或改进翻译文件
3. 提交 Pull Request

## 📄 许可证

MIT License

## 🔗 相关链接

- [Supabase](https://supabase.com)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [World Time API](http://worldtimeapi.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide React](https://lucide.dev)
