import { useState, useEffect, useRef } from 'react'
import { X, Download, Search, RefreshCw } from 'lucide-react'
import type { ContainerLogs } from '@/types/container'

interface ContainerLogsModalProps {
  containerId: string
  containerName: string
  onClose: () => void
  onFetchLogs: (containerId: string, tail?: number) => Promise<ContainerLogs>
  isFetching?: boolean
}

export function ContainerLogsModal({
  containerId,
  containerName,
  onClose,
  onFetchLogs,
  isFetching = false,
}: ContainerLogsModalProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const [tail, setTail] = useState(100)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const logsContainerRef = useRef<HTMLDivElement>(null)

  const fetchLogs = async () => {
    try {
      const result = await onFetchLogs(containerId, tail)
      setLogs(result.logs)
    } catch (error) {
      console.error('获取日志失败:', error)
      setLogs([`错误: ${(error as Error).message}`])
    }
  }

  useEffect(() => {
    fetchLogs()
    // 可以设置自动刷新
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, tail])

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const handleScroll = () => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      setAutoScroll(isAtBottom)
    }
  }

  const filteredLogs = logs.filter((log) =>
    log.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const downloadLogs = () => {
    const content = logs.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${containerName}-logs-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">容器日志</h2>
            <p className="text-sm text-gray-600 mt-1">{containerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="搜索日志..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <select
            value={tail}
            onChange={(e) => setTail(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value={50}>最近 50 行</option>
            <option value={100}>最近 100 行</option>
            <option value={200}>最近 200 行</option>
            <option value={500}>最近 500 行</option>
            <option value={1000}>最近 1000 行</option>
          </select>
          <button
            onClick={fetchLogs}
            disabled={isFetching}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            title="刷新日志"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={downloadLogs}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="下载日志"
          >
            <Download size={18} />
          </button>
          <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">自动滚动</span>
          </label>
        </div>

        {/* 日志内容 */}
        <div
          ref={logsContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm p-4"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              {searchTerm ? '没有找到匹配的日志' : '暂无日志'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap break-words">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            显示 {filteredLogs.length} / {logs.length} 条日志
            {searchTerm && ` (已过滤)`}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
