'use client'

import { useState, useRef, useEffect } from 'react'
import { Wifi, Download, Upload, Activity, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface SpeedTestResult {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  timestamp: Date
  location: string
}

export default function WifiSpeedTest() {
  const { t } = useTranslation()
  const [isTesting, setIsTesting] = useState(false)
  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<string>('')
  
  const abortController = useRef<AbortController | null>(null)

  // 获取当前位置
  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = async () => {
    try {
      const response = await fetch('/api/location')
      const data = await response.json()
      if (data.city && data.country) {
        setLocation(`${data.city}, ${data.country}`)
      }
    } catch (error) {
      console.error('Failed to get location:', error)
    }
  }

  const startSpeedTest = async () => {
    setIsTesting(true)
    setError(null)
    setProgress(0)
    setTestPhase('ping')
    
    abortController.current = new AbortController()

    try {
      // 1. Ping测试
      setTestPhase('ping')
      setProgress(10)
      const ping = await testPing()
      
      // 2. 下载速度测试
      setTestPhase('download')
      setProgress(30)
      const downloadSpeed = await testDownloadSpeed()
      
      // 3. 上传速度测试
      setTestPhase('upload')
      setProgress(70)
      const uploadSpeed = await testUploadSpeed()
      
      // 4. 完成
      setTestPhase('complete')
      setProgress(100)
      
      const testResult: SpeedTestResult = {
        downloadSpeed,
        uploadSpeed,
        ping,
        timestamp: new Date(),
        location
      }
      
      setResult(testResult)
      
      // 保存到本地存储
      saveTestResult(testResult)
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setError(t('wifiSpeedTest.testCancelled'))
      } else {
        setError(t('wifiSpeedTest.testFailed'))
      }
    } finally {
      setIsTesting(false)
      setTestPhase('idle')
      setProgress(0)
    }
  }

  const testPing = async (): Promise<number> => {
    const startTime = performance.now()
    
    try {
      await fetch('/api/speed-test/ping', {
        signal: abortController.current?.signal
      })
      const endTime = performance.now()
      return Math.round(endTime - startTime)
    } catch (error) {
      throw new Error('Ping测试失败')
    }
  }

  const testDownloadSpeed = async (): Promise<number> => {
    const startTime = performance.now()
    let totalBytes = 0
    
    try {
      const response = await fetch('/api/speed-test/download', {
        signal: abortController.current?.signal
      })
      
      if (!response.body) throw new Error('No response body')
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        totalBytes += value.length
        const elapsed = (performance.now() - startTime) / 1000 // 秒
        const speedMbps = (totalBytes * 8) / (elapsed * 1000000) // Mbps
        
        // 更新进度
        setProgress(30 + (elapsed / 10) * 40) // 30% - 70%
      }
      
      const endTime = performance.now()
      const elapsed = (endTime - startTime) / 1000
      return Math.round((totalBytes * 8) / (elapsed * 1000000))
      
    } catch (error) {
      throw new Error('下载速度测试失败')
    }
  }

  const testUploadSpeed = async (): Promise<number> => {
    const startTime = performance.now()
    const testData = generateTestData(1024 * 1024) // 1MB测试数据
    
    try {
      const response = await fetch('/api/speed-test/upload', {
        method: 'POST',
        body: testData,
        signal: abortController.current?.signal
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const endTime = performance.now()
      const elapsed = (endTime - startTime) / 1000
      return Math.round((testData.size * 8) / (elapsed * 1000000))
      
    } catch (error) {
      throw new Error('上传速度测试失败')
    }
  }

  const generateTestData = (size: number): Blob => {
    const chunk = '0123456789ABCDEF'.repeat(64) // 1KB chunk
    const chunks = Math.ceil(size / chunk.length)
    const data = chunk.repeat(chunks).slice(0, size)
    return new Blob([data], { type: 'application/octet-stream' })
  }

  const saveTestResult = (result: SpeedTestResult) => {
    const savedResults = JSON.parse(localStorage.getItem('speedTestResults') || '[]')
    savedResults.unshift(result)
    
    // 只保留最近10次测试结果
    if (savedResults.length > 10) {
      savedResults.splice(10)
    }
    
    localStorage.setItem('speedTestResults', JSON.stringify(savedResults))
  }

  const cancelTest = () => {
    abortController.current?.abort()
    setIsTesting(false)
    setTestPhase('idle')
    setProgress(0)
  }

  const getSpeedGrade = (speed: number): { grade: string; color: string; description: string } => {
    if (speed >= 100) return { grade: 'A+', color: 'text-green-600', description: '极快' }
    if (speed >= 50) return { grade: 'A', color: 'text-green-500', description: '很快' }
    if (speed >= 25) return { grade: 'B', color: 'text-blue-500', description: '良好' }
    if (speed >= 10) return { grade: 'C', color: 'text-yellow-500', description: '一般' }
    if (speed >= 5) return { grade: 'D', color: 'text-orange-500', description: '较慢' }
    return { grade: 'F', color: 'text-red-500', description: '很慢' }
  }

  const getPhaseText = () => {
    switch (testPhase) {
      case 'ping': return t('wifiSpeedTest.pingTest')
      case 'download': return t('wifiSpeedTest.downloadTest')
      case 'upload': return t('wifiSpeedTest.uploadTest')
      case 'complete': return t('wifiSpeedTest.testComplete')
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wifi className="h-5 w-5 text-blue-600" />
          </div>
                      <div>
              <h3 className="text-lg font-bold text-gray-900">{t('wifiSpeedTest.title')}</h3>
              <p className="text-sm text-gray-500">{t('wifiSpeedTest.description')}</p>
            </div>
        </div>
        
        {location && (
          <div className="text-sm text-gray-500">
            📍 {location}
          </div>
        )}
      </div>

      {/* 测试状态 */}
      {isTesting && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{getPhaseText()}</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
                      <button
              onClick={cancelTest}
              className="mt-3 text-sm text-red-600 hover:text-red-700"
            >
              {t('wifiSpeedTest.cancelTest')}
            </button>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* 测试结果 */}
      {result && !isTesting && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 下载速度 */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {result.downloadSpeed} Mbps
              </div>
              <div className="text-sm text-gray-600">{t('wifiSpeedTest.downloadSpeed')}</div>
              <div className={`text-xs font-medium mt-1 ${getSpeedGrade(result.downloadSpeed).color}`}>
                {getSpeedGrade(result.downloadSpeed).grade} - {getSpeedGrade(result.downloadSpeed).description}
              </div>
            </div>

            {/* 上传速度 */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {result.uploadSpeed} Mbps
              </div>
              <div className="text-sm text-gray-600">{t('wifiSpeedTest.uploadSpeed')}</div>
              <div className={`text-xs font-medium mt-1 ${getSpeedGrade(result.uploadSpeed).color}`}>
                {getSpeedGrade(result.uploadSpeed).grade} - {getSpeedGrade(result.uploadSpeed).description}
              </div>
            </div>

            {/* Ping延迟 */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {result.ping} ms
              </div>
              <div className="text-sm text-gray-600">{t('wifiSpeedTest.ping')}</div>
              <div className={`text-xs font-medium mt-1 ${
                result.ping < 50 ? 'text-green-600' : 
                result.ping < 100 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {result.ping < 50 ? '优秀' : result.ping < 100 ? '良好' : '较慢'}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            {t('wifiSpeedTest.testTime')}: {result.timestamp.toLocaleString()}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex space-x-3">
        <button
          onClick={startSpeedTest}
          disabled={isTesting}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            isTesting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isTesting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{t('wifiSpeedTest.testing')}</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span>{t('wifiSpeedTest.startTest')}</span>
            </>
          )}
        </button>

        {result && !isTesting && (
          <button
            onClick={() => setResult(null)}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            清除结果
          </button>
        )}
      </div>

      {/* 使用建议 */}
      {result && !isTesting && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">💡 {t('wifiSpeedTest.usageTips')}</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {result.downloadSpeed < 10 && (
              <li>• {t('wifiSpeedTest.slowDownload')}</li>
            )}
            {result.uploadSpeed < 5 && (
              <li>• {t('wifiSpeedTest.slowUpload')}</li>
            )}
            {result.ping > 100 && (
              <li>• {t('wifiSpeedTest.highPing')}</li>
            )}
            {result.downloadSpeed >= 25 && result.uploadSpeed >= 10 && result.ping < 50 && (
              <li>• {t('wifiSpeedTest.goodNetwork')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
