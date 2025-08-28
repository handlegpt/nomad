#!/bin/bash

# NOMAD.NOW 部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署 NOMAD.NOW..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "⚠️  注意：请确保已更新 docker-compose.yml 中的环境变量："
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - NEXT_PUBLIC_OPENWEATHER_API_KEY"
echo ""

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down || true

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker system prune -f

# 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 检查服务状态
echo "🔍 检查服务状态..."
if curl -f http://localhost:3011/api/health > /dev/null 2>&1; then
    echo "✅ 部署成功！"
    echo "🌐 访问地址: http://localhost:3011"
    echo "📊 健康检查: http://localhost:3011/api/health"
else
    echo "❌ 部署失败，请检查日志："
    docker-compose logs
    exit 1
fi

echo ""
echo "📋 常用命令："
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  更新部署: ./deploy.sh"
echo ""
echo "🔧 如需修改环境变量，请编辑 docker-compose.yml 文件后重新运行此脚本"
