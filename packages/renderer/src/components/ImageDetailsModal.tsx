import { X } from 'lucide-react'
import type { ImageDetails } from '@/types/image'

interface ImageDetailsModalProps {
  image: ImageDetails | null
  onClose: () => void
}

export function ImageDetailsModal({
  image,
  onClose,
}: ImageDetailsModalProps) {
  if (!image) return null

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">镜像详情</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 基本信息 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">镜像名称</label>
                  <p className="mt-1 text-gray-900">{image.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">标签</label>
                  <p className="mt-1">
                    <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                      {image.tag}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">镜像ID</label>
                  <p className="mt-1 text-gray-900 font-mono text-sm">{image.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">镜像源</label>
                  <p className="mt-1 text-gray-900">{image.registry || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">大小</label>
                  <p className="mt-1 text-gray-900">{formatBytes(image.size)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">创建时间</label>
                  <p className="mt-1 text-gray-900">{formatDate(image.createdAt)}</p>
                </div>
                {image.digest && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">摘要</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm break-all">{image.digest}</p>
                  </div>
                )}
              </div>
            </section>

            {/* 系统信息 */}
            {(image.architecture || image.os || image.author) && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">系统信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  {image.architecture && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">架构</label>
                      <p className="mt-1 text-gray-900">{image.architecture}</p>
                    </div>
                  )}
                  {image.os && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">操作系统</label>
                      <p className="mt-1 text-gray-900">{image.os}</p>
                    </div>
                  )}
                  {image.author && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">作者</label>
                      <p className="mt-1 text-gray-900">{image.author}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 描述 */}
            {image.description && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">描述</h3>
                <p className="text-gray-700">{image.description}</p>
              </section>
            )}

            {/* 配置信息 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">配置信息</h3>
              <div className="space-y-4">
                {image.workingDir && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">工作目录</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm">{image.workingDir}</p>
                  </div>
                )}
                {image.entrypoint && image.entrypoint.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">入口点</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm">
                      {image.entrypoint.join(' ')}
                    </p>
                  </div>
                )}
                {image.cmd && image.cmd.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">命令</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm">{image.cmd.join(' ')}</p>
                  </div>
                )}
                {image.exposedPorts && image.exposedPorts.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">暴露端口</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {image.exposedPorts.map((port) => (
                        <span
                          key={port}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {port}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {image.volumes && image.volumes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">卷</label>
                    <div className="mt-1 space-y-1">
                      {image.volumes.map((volume) => (
                        <p key={volume} className="text-gray-900 font-mono text-sm">
                          {volume}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 环境变量 */}
            {image.env && Object.keys(image.env).length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">环境变量</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.entries(image.env).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-mono text-sm text-gray-700 min-w-[200px]">{key}</span>
                        <span className="font-mono text-sm text-gray-900">= {value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 标签 */}
            {image.labels && Object.keys(image.labels).length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.entries(image.labels).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-mono text-sm text-gray-700 min-w-[200px]">{key}</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 层信息 */}
            {image.layers && image.layers.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">镜像层</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {image.layers.map((layer, index) => (
                      <div key={layer} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-8">#{index + 1}</span>
                        <span className="font-mono text-sm text-gray-900">{layer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* 底部 */}
        <div className="border-t border-gray-200 p-6 flex justify-end">
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
