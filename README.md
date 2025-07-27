# Nomad Info - Digital Nomad Resources

A comprehensive website for digital nomads providing information about visas, taxes, housing, insurance, and more.

## Features

- 🌍 **Multi-language Support**: Chinese, English, Japanese, Cantonese, Spanish
- 🏠 **Responsive Design**: Works on all devices
- 🚀 **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- 🐳 **Docker Support**: Easy deployment with Docker

## Quick Start

### Option 1: Docker (Recommended)

**一键部署：**
```bash
# 使用安装脚本
chmod +x install.sh
./install.sh

# 或手动部署
docker-compose up --build -d
```

**手动Docker命令：**
```bash
# 构建镜像
docker build -t nomad-info .

# 运行容器
docker run -p 3010:3000 nomad-info
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3010](http://localhost:3010) to view the site.

## Docker Commands

```bash
# 查看运行中的容器
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建
docker-compose build --no-cache

# 清理
docker-compose down -v
docker system prune -f
```

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # Reusable UI components
├── locales/            # Multi-language content
├── lib/                # Utility functions
└── styles/             # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Docker + Vercel/Netlify ready

## Environment Variables

Create a `.env.local` file for local development:

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3010
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 