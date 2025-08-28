#!/bin/bash

# NOMAD.NOW 环境变量配置脚本
# 使用方法: ./setup-env.sh

echo "🔧 NOMAD.NOW 环境变量配置"
echo "=========================="
echo ""

# 备份原文件
cp docker-compose.yml docker-compose.yml.backup

echo "请输入你的 Supabase 配置："
read -p "Supabase URL (例如: https://your-project.supabase.co): " supabase_url
read -p "Supabase Anon Key: " supabase_key

echo ""
echo "请输入你的 OpenWeather API Key："
read -p "OpenWeather API Key: " weather_key

echo ""
echo "正在更新 docker-compose.yml 文件..."

# 使用sed替换环境变量
sed -i.bak "s|https://your-project.supabase.co|$supabase_url|g" docker-compose.yml
sed -i.bak "s|your-anon-key-here|$supabase_key|g" docker-compose.yml
sed -i.bak "s|your-openweather-api-key-here|$weather_key|g" docker-compose.yml

# 清理备份文件
rm docker-compose.yml.bak

echo "✅ 环境变量配置完成！"
echo ""
echo "📝 配置信息："
echo "   Supabase URL: $supabase_url"
echo "   Supabase Key: ${supabase_key:0:10}..."
echo "   Weather API: ${weather_key:0:10}..."
echo ""
echo "🚀 现在可以运行 ./deploy.sh 开始部署了！"
