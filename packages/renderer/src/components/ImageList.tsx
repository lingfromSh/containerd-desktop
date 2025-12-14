import type { Image } from '@/types/image'

interface ImageListProps {
  images: Image[]
  onDelete: (imageId: string) => Promise<void>
  isDeleting: boolean
}

export function ImageList({ images, onDelete, isDeleting }: ImageListProps) {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>暂无镜像</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm text-gray-200">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">镜像名称</th>
            <th className="px-4 py-3 text-left">标签</th>
            <th className="px-4 py-3 text-left">大小</th>
            <th className="px-4 py-3 text-left">镜像源</th>
            <th className="px-4 py-3 text-left">创建时间</th>
            <th className="px-4 py-3 text-left">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {images.map((image) => (
            <tr key={image.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3">{image.name}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-cyan-600 text-white rounded text-xs">
                  {image.tag}
                </span>
              </td>
              <td className="px-4 py-3">{formatSize(image.size)}</td>
              <td className="px-4 py-3">{image.registry || '-'}</td>
              <td className="px-4 py-3">{formatDate(image.createdAt)}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onDelete(image.id)}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
