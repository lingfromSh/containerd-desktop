import { createRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Download, Search } from 'lucide-react'
import { ImageList } from '@/components/ImageList'
import { RegistryConfig } from '@/components/RegistryConfig'
import { useImages } from '@/hooks/useImages'
import { useQuery } from '@tanstack/react-query'
import type { RootRoute } from '@tanstack/react-router'
import type { RemoteImage } from '@/types/image'

function ImagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showRemoteResults, setShowRemoteResults] = useState(false)
  const {
    images,
    isLoading,
    deleteImage,
    isDeleting,
    batchDeleteImages,
    isBatchDeleting,
    getImageDetails,
    isGettingDetails,
    pullImage,
    isPulling,
    searchRemoteImages,
  } = useImages(searchTerm)

  // 远程镜像搜索
  const {
    data: remoteImages = [],
    isLoading: isSearchingRemote,
    refetch: refetchRemote,
  } = useQuery({
    queryKey: ['remoteImages', searchTerm],
    queryFn: () => searchRemoteImages(searchTerm),
    enabled: showRemoteResults && searchTerm.length > 0,
  })

  // 当搜索词变化时，自动搜索远程镜像
  useEffect(() => {
    if (searchTerm.length > 0) {
      setShowRemoteResults(true)
    } else {
      setShowRemoteResults(false)
    }
  }, [searchTerm])

  const handlePullImage = async (remoteImage: RemoteImage) => {
    try {
      await pullImage({
        imageName: remoteImage.name,
        tag: remoteImage.tag,
        registry: remoteImage.registry,
      })
      alert(`镜像 ${remoteImage.name}:${remoteImage.tag} 拉取成功！`)
      // 刷新本地镜像列表
      setSearchTerm('')
      setShowRemoteResults(false)
    } catch (error) {
      alert(`拉取镜像失败: ${(error as Error).message}`)
    }
  }

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">镜像管理</h1>
          <p className="text-gray-600">管理您的容器镜像</p>
        </div>

        <div className="space-y-6">
          {/* 镜像源配置区域 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <RegistryConfig />
          </div>

          {/* 搜索区域 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">搜索镜像</h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索本地镜像或从镜像源搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                正在搜索本地镜像{showRemoteResults && '和远程镜像源'}...
              </p>
            )}
          </div>

          {/* 远程镜像搜索结果 */}
          {showRemoteResults && searchTerm && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">远程镜像搜索结果</h2>
              {isSearchingRemote ? (
                <div className="text-center py-12 text-gray-600">搜索中...</div>
              ) : remoteImages.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <p>未找到匹配的远程镜像</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-gray-700">
                    <thead className="bg-green-50 text-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left">镜像名称</th>
                        <th className="px-4 py-3 text-left">标签</th>
                        <th className="px-4 py-3 text-left">镜像源</th>
                        <th className="px-4 py-3 text-left">大小</th>
                        <th className="px-4 py-3 text-left">描述</th>
                        <th className="px-4 py-3 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {remoteImages.map((remoteImage, index) => {
                        // 检查是否已存在本地
                        const existsLocally = images.some(
                          (img) =>
                            img.name === remoteImage.name &&
                            img.tag === remoteImage.tag &&
                            img.registry === remoteImage.registry,
                        )
                        return (
                          <tr key={`${remoteImage.name}-${remoteImage.tag}-${index}`} className="hover:bg-green-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {remoteImage.isOfficial && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                    官方
                                  </span>
                                )}
                                <span className="font-medium">{remoteImage.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                                {remoteImage.tag}
                              </span>
                            </td>
                            <td className="px-4 py-3">{remoteImage.registry}</td>
                            <td className="px-4 py-3">{formatBytes(remoteImage.size)}</td>
                            <td className="px-4 py-3 text-gray-600">
                              {remoteImage.description || '-'}
                            </td>
                            <td className="px-4 py-3">
                              {existsLocally ? (
                                <span className="text-sm text-gray-500">已存在</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePullImage(remoteImage)}
                                  disabled={isPulling}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                >
                                  <Download size={14} />
                                  {isPulling ? '拉取中...' : '拉取'}
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 镜像列表区域 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">镜像列表</h2>
            {isLoading ? (
              <div className="text-center py-12 text-gray-600">加载中...</div>
            ) : (
              <ImageList
                images={images}
                onDelete={deleteImage}
                isDeleting={isDeleting}
                onBatchDelete={batchDeleteImages}
                isBatchDeleting={isBatchDeleting}
                onGetDetails={getImageDetails}
                isGettingDetails={isGettingDetails}
              />
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
