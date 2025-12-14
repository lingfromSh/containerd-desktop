import { useState } from 'react'
import { X, Play, Trash2 } from 'lucide-react'

interface ContainerTerminalModalProps {
  containerId: string
  containerName: string
  onClose: () => void
  onExecCommand: (containerId: string, command: string) => Promise<{ output: string; exitCode: number }>
  isExecuting?: boolean
}

interface CommandHistory {
  command: string
  output: string
  exitCode: number
  timestamp: string
}

export function ContainerTerminalModal({
  containerId,
  containerName,
  onClose,
  onExecCommand,
  isExecuting = false,
}: ContainerTerminalModalProps) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentOutput, setCurrentOutput] = useState<{
    output: string
    exitCode: number
  } | null>(null)

  const handleExecute = async () => {
    if (!command.trim()) return

    try {
      const result = await onExecCommand(containerId, command)
      setCurrentOutput(result)
      setHistory((prev) => [
        ...prev,
        {
          command,
          output: result.output,
          exitCode: result.exitCode,
          timestamp: new Date().toISOString(),
        },
      ])
      setCommand('')
    } catch (error) {
      const errorMessage = (error as Error).message
      setCurrentOutput({
        output: `错误: ${errorMessage}`,
        exitCode: 1,
      })
      setHistory((prev) => [
        ...prev,
        {
          command,
          output: `错误: ${errorMessage}`,
          exitCode: 1,
          timestamp: new Date().toISOString(),
        },
      ])
      setCommand('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleExecute()
    }
  }

  const clearHistory = () => {
    if (confirm('确定要清空命令历史吗？')) {
      setHistory([])
      setCurrentOutput(null)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">容器终端</h2>
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

        {/* 命令输入区域 */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <span className="text-gray-600 font-mono text-sm">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入命令..."
                disabled={isExecuting}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 font-mono text-sm disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleExecute}
              disabled={isExecuting || !command.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Play size={18} />
              执行
            </button>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              清空
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            提示: 按 Enter 执行命令，Shift+Enter 换行
          </p>
        </div>

        {/* 输出区域 */}
        <div className="flex-1 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm p-4">
          {history.length === 0 && !currentOutput ? (
            <div className="text-gray-500 text-center py-8">
              输入命令并执行，结果将显示在这里
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span className="text-gray-500">[{formatTimestamp(item.timestamp)}]</span>
                    <span>$</span>
                    <span>{item.command}</span>
                  </div>
                  <div
                    className={`pl-4 whitespace-pre-wrap break-words ${item.exitCode === 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                  >
                    {item.output}
                  </div>
                  <div className="text-gray-600 text-xs pl-4">
                    退出代码: {item.exitCode}
                  </div>
                </div>
              ))}
              {currentOutput && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span className="text-gray-500">[{formatTimestamp(new Date().toISOString())}]</span>
                    <span>$</span>
                    <span>{command || history[history.length - 1]?.command}</span>
                  </div>
                  <div
                    className={`pl-4 whitespace-pre-wrap break-words ${currentOutput.exitCode === 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                  >
                    {currentOutput.output}
                  </div>
                  <div className="text-gray-600 text-xs pl-4">
                    退出代码: {currentOutput.exitCode}
                  </div>
                </div>
              )}
              {isExecuting && (
                <div className="text-gray-500 pl-4">执行中...</div>
              )}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            已执行 {history.length} 条命令
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
