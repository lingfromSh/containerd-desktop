import { useState } from 'react'
import { Trash2, Info } from 'lucide-react'
import type { Image, ImageDetails } from '@/types/image'
import { Pagination } from './Pagination'
import { ImageDetailsModal } from './ImageDetailsModal'

interface ImageListProps {
  images: Image[]
  onDelete: (imageId: string) => Promise<void>
  isDeleting: boolean
  onBatchDelete?: (imageIds: string[]) => Promise<void>
  isBatchDeleting?: boolean
  onGetDetails?: (imageId: string) => Promise<ImageDetails>
  isGettingDetails?: boolean
}

export function ImageList({
  images,
  onDelete,
  isDeleting,
  onBatchDelete,
  isBatchDeleting = false,
  onGetDetails,
  isGettingDetails = false,
}: ImageListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [detailsModal, setDetailsModal] = useState<ImageDetails | null>(null)

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 分页数据切片
  const totalPages = Math.ceil(images.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedImages = images.slice(startIndex, endIndex)

  // 当数据变化时，调整当前页
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedImages.map((img) => img.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (imageId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(imageId)
    } else {
      newSelected.delete(imageId)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0 || !onBatchDelete) return
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个镜像吗？此操作不可恢复。`)) {
      await onBatchDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
      // 如果当前页没有数据了，跳转到上一页
      if (paginatedImages.length === selectedIds.size && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const allSelected = paginatedImages.length > 0 && selectedIds.size === paginatedImages.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < paginatedImages.length

  // 切换页面时清空选择
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedIds(new Set())
  }

  const handleViewDetails = async (imageId: string) => {
    if (!onGetDetails) return
    try {
      const details = await onGetDetails(imageId)
      setDetailsModal(details)
    } catch (error) {
      console.error('获取镜像详情失败:', error)
      alert('获取镜像详情失败: ' + (error as Error).message)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>暂无镜像</p>
      </div>
    )
  }

  return (
    <div>
      {/* 批量操作工具栏 */}
      {selectedIds.size > 0 && onBatchDelete && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              已选择 {selectedIds.size} 个镜像
            </span>
            <button
              onClick={handleBatchDelete}
              disabled={isBatchDeleting}
              className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-1"
            >
              <Trash2 size={14} />
              批量删除
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            取消选择
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-50 text-gray-900">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left">镜像名称</th>
              <th className="px-4 py-3 text-left">标签</th>
              <th className="px-4 py-3 text-left">大小</th>
              <th className="px-4 py-3 text-left">镜像源</th>
              <th className="px-4 py-3 text-left">创建时间</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedImages.map((image) => (
              <tr
                key={image.id}
                className={`hover:bg-blue-50 transition-colors ${selectedIds.has(image.id) ? 'bg-blue-50' : ''
                  }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(image.id)}
                    onChange={(e) => handleSelectOne(image.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">{image.name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                    {image.tag}
                  </span>
                </td>
                <td className="px-4 py-3">{formatSize(image.size)}</td>
                <td className="px-4 py-3">{image.registry || '-'}</td>
                <td className="px-4 py-3">{formatDate(image.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {onGetDetails && (
                      <button
                        type="button"
                        onClick={() => handleViewDetails(image.id)}
                        disabled={isGettingDetails}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        title="查看详情"
                      >
                        <Info size={14} />
                        详情
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(image.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页组件 */}
      <Pagination
        currentPage={currentPage}
        totalItems={images.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
          setSelectedIds(new Set())
        }}
      />

      {/* 镜像详情模态框 */}
      {detailsModal && (
        <ImageDetailsModal
          image={detailsModal}
          onClose={() => setDetailsModal(null)}
        />
      )}
    </div>
  )
}
