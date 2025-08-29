'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // 在生产环境中，这里可以发送错误到错误追踪服务
    if (process.env.NODE_ENV === 'production') {
      // TODO: 发送错误到错误追踪服务
      // reportError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card card-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                出现了一些问题
              </h2>
              
              <p className="text-gray-600 mb-6">
                抱歉，页面加载时出现了错误。请尝试刷新页面或稍后再试。
              </p>

              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  重试
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline w-full"
                >
                  刷新页面
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    错误详情 (开发模式)
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
