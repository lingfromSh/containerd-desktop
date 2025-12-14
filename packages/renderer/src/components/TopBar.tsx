import { Search, RefreshCw, Settings, Circle } from 'lucide-react'
import { useState } from 'react'

export default function TopBar() {
  const SIDEBAR_WIDTH = 260
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // 触发全局刷新逻辑
    window.location.reload()
    // 或者调用刷新函数
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 实现搜索逻辑
    console.log('搜索:', searchTerm)
  }

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-30 shadow-sm"
      style={{ left: `${SIDEBAR_WIDTH}px` }}
    >
      {/* 全局搜索栏 */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="搜索容器、镜像..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
        </div>
      </form>

      {/* 右侧操作区域 */}
      <div className="flex items-center gap-4 ml-auto">
        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900 disabled:opacity-50"
          title="刷新"
          aria-label="刷新"
        >
          <RefreshCw
            size={20}
            className={isRefreshing ? 'animate-spin' : ''}
          />
        </button>

        {/* 系统状态指示器 */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
          <Circle size={8} className="text-green-500 fill-green-500" />
          <span className="text-sm text-green-700 font-medium">已连接</span>
        </div>

        {/* 设置按钮 */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
          title="设置"
          aria-label="设置"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
}
