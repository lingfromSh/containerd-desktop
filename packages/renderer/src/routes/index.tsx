import { createRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Package, Box, Network } from 'lucide-react'
import type { RootRoute } from '@tanstack/react-router'

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">欢迎使用 Containerd Desktop</h1>
          <p className="text-xl text-gray-400">
            管理您的容器、镜像和映射的便捷工具
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* 镜像列表卡片 */}
          <Link
            to="/images"
            className="group bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-600 rounded-lg group-hover:bg-cyan-500 transition-colors">
                <Package size={32} />
              </div>
              <h2 className="text-2xl font-semibold">镜像列表</h2>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              查看和管理您的容器镜像，配置镜像源，搜索和删除镜像
            </p>
          </Link>

          {/* 容器列表卡片 */}
          <Link
            to="/containers"
            className="group bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-600 rounded-lg group-hover:bg-cyan-500 transition-colors">
                <Box size={32} />
              </div>
              <h2 className="text-2xl font-semibold">容器列表</h2>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              管理您的容器，启动、停止和删除容器，查看容器状态
            </p>
          </Link>

          {/* 映射列表卡片 */}
          <Link
            to="/mappings"
            className="group bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-600 rounded-lg group-hover:bg-cyan-500 transition-colors">
                <Network size={32} />
              </div>
              <h2 className="text-2xl font-semibold">映射列表</h2>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              管理端口映射、卷映射和网络映射，配置容器与主机的连接
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/',
    component: HomePage,
  })
