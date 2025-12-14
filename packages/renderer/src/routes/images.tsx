import { createRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ImageList } from '@/components/ImageList'
import { RegistryConfig } from '@/components/RegistryConfig'
import { useImages } from '@/hooks/useImages'
import type { RootRoute } from '@tanstack/react-router'

function ImagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { images, isLoading, deleteImage, isDeleting } = useImages(searchTerm)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">镜像列表</h1>
          <p className="text-gray-400">管理您的容器镜像</p>
        </div>

        <div className="space-y-8">
          {/* 镜像源配置区域 */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <RegistryConfig />
          </div>

          {/* 搜索区域 */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">搜索镜像</h2>
            <input
              type="text"
              placeholder="搜索镜像名称、标签或源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* 镜像列表区域 */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">镜像列表</h2>
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">加载中...</div>
            ) : (
              <ImageList images={images} onDelete={deleteImage} isDeleting={isDeleting} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/images',
    component: ImagesPage,
  })
