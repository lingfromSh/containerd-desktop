import { Link, useLocation } from '@tanstack/react-router'
import { Home, Network, Package, Box, Circle } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/images', icon: Package, label: '镜像管理' },
    { path: '/containers', icon: Box, label: '容器管理' },
    { path: '/mappings', icon: Network, label: '映射管理' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-slate-900 text-white flex flex-col shadow-lg z-40">
      {/* Logo 区域 */}
      <div className="p-6 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Box size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">Containerd Desktop</h1>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* 底部状态栏 */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        {/* 连接状态 */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Circle size={8} className="text-green-500 fill-green-500" />
          <span>已连接</span>
        </div>
        {/* 版本号 */}
        <div className="text-xs text-slate-500">
          版本 {import.meta.env.VITE_APP_VERSION || '1.0.0'}
        </div>
      </div>
    </aside>
  )
}
