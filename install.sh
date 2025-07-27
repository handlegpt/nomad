#!/bin/bash

# Nomad Info - Docker 安装脚本
echo "🚀 开始安装数字游民资讯网站..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    echo "访问: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    echo "访问: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker环境检查通过"

# 选择安装模式
echo ""
echo "请选择安装模式:"
echo "1) 默认端口 (3010)"
echo "2) 自定义端口"

read -p "请输入选择 (1-2): " choice

case $choice in
    1)
        echo "🔧 安装到默认端口 3010..."
        docker-compose up --build -d
        ;;
    2)
        read -p "请输入端口号 (默认3010): " port
        port=${port:-3010}
        echo "🔧 安装到端口 $port..."
        PORT=$port docker-compose up --build -d
        ;;
    *)
        echo "❌ 无效选择，使用默认端口 3010"
        docker-compose up --build -d
        ;;
esac

echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
if curl -f http://localhost:3010/api/health &> /dev/null; then
    echo "✅ 安装成功！"
    echo "🌐 访问地址: http://localhost:3010"
    echo ""
    echo "📋 常用命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
    echo "  更新代码: docker-compose up --build -d"
else
    echo "⚠️  服务可能还在启动中，请稍后访问 http://localhost:3010"
    echo "📋 查看日志: docker-compose logs -f"
fi 