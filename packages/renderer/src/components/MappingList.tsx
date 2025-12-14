import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { PortMapping, VolumeMapping, NetworkMapping } from '@/types/mapping'
import { Pagination } from './Pagination'

interface MappingListProps {
  portMappings: PortMapping[]
  volumeMappings: VolumeMapping[]
  networkMappings: NetworkMapping[]
  onCreatePortMapping: (mapping: Omit<PortMapping, 'id'>) => Promise<PortMapping>
  onCreateVolumeMapping: (mapping: Omit<VolumeMapping, 'id'>) => Promise<VolumeMapping>
  onCreateNetworkMapping: (mapping: Omit<NetworkMapping, 'id'>) => Promise<NetworkMapping>
  onDeletePortMapping: (mappingId: string) => Promise<void>
  onDeleteVolumeMapping: (mappingId: string) => Promise<void>
  onDeleteNetworkMapping: (mappingId: string) => Promise<void>
  onBatchDeletePortMappings?: (mappingIds: string[]) => Promise<void>
  onBatchDeleteVolumeMappings?: (mappingIds: string[]) => Promise<void>
  onBatchDeleteNetworkMappings?: (mappingIds: string[]) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
  isBatchDeleting?: boolean
}

export function MappingList({
  portMappings,
  volumeMappings,
  networkMappings,
  onCreatePortMapping,
  onCreateVolumeMapping,
  onCreateNetworkMapping,
  onDeletePortMapping,
  onDeleteVolumeMapping,
  onDeleteNetworkMapping,
  onBatchDeletePortMappings,
  onBatchDeleteVolumeMappings,
  onBatchDeleteNetworkMappings,
  isCreating,
  isDeleting,
  isBatchDeleting = false,
}: MappingListProps) {
  const [activeTab, setActiveTab] = useState<'ports' | 'volumes' | 'networks'>('ports')

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('ports')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'ports'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            端口映射 ({portMappings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('volumes')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'volumes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            卷映射 ({volumeMappings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('networks')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'networks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            网络映射 ({networkMappings.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ports' && (
          <PortMappingTab
            mappings={portMappings}
            onCreate={onCreatePortMapping}
            onDelete={onDeletePortMapping}
            onBatchDelete={onBatchDeletePortMappings}
            isCreating={isCreating}
            isDeleting={isDeleting}
            isBatchDeleting={isBatchDeleting}
          />
        )}
        {activeTab === 'volumes' && (
          <VolumeMappingTab
            mappings={volumeMappings}
            onCreate={onCreateVolumeMapping}
            onDelete={onDeleteVolumeMapping}
            onBatchDelete={onBatchDeleteVolumeMappings}
            isCreating={isCreating}
            isDeleting={isDeleting}
            isBatchDeleting={isBatchDeleting}
          />
        )}
        {activeTab === 'networks' && (
          <NetworkMappingTab
            mappings={networkMappings}
            onCreate={onCreateNetworkMapping}
            onDelete={onDeleteNetworkMapping}
            onBatchDelete={onBatchDeleteNetworkMappings}
            isCreating={isCreating}
            isDeleting={isDeleting}
            isBatchDeleting={isBatchDeleting}
          />
        )}
      </div>
    </div>
  )
}

function PortMappingTab({
  mappings,
  onCreate,
  onDelete,
  onBatchDelete,
  isCreating,
  isDeleting,
  isBatchDeleting = false,
}: {
  mappings: PortMapping[]
  onCreate: (mapping: Omit<PortMapping, 'id'>) => Promise<PortMapping>
  onDelete: (mappingId: string) => Promise<void>
  onBatchDelete?: (mappingIds: string[]) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
  isBatchDeleting?: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formData, setFormData] = useState({
    containerId: '',
    containerName: '',
    containerPort: '',
    hostPort: '',
    protocol: 'tcp' as 'tcp' | 'udp',
  })

  // 分页数据切片
  const totalPages = Math.ceil(mappings.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedMappings = mappings.slice(startIndex, endIndex)

  // 当数据变化时，调整当前页
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedMappings.map((m) => m.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (mappingId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(mappingId)
    } else {
      newSelected.delete(mappingId)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0 || !onBatchDelete) return
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个端口映射吗？此操作不可恢复。`)) {
      await onBatchDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
      // 如果当前页没有数据了，跳转到上一页
      if (paginatedMappings.length === selectedIds.size && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const allSelected = paginatedMappings.length > 0 && selectedIds.size === paginatedMappings.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < paginatedMappings.length

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedIds(new Set())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onCreate({
      containerId: formData.containerId,
      containerName: formData.containerName || undefined,
      containerPort: parseInt(formData.containerPort, 10),
      hostPort: parseInt(formData.hostPort, 10),
      protocol: formData.protocol,
    })
    setFormData({
      containerId: '',
      containerName: '',
      containerPort: '',
      hostPort: '',
      protocol: 'tcp',
    })
    setShowForm(false)
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + 添加端口映射
            </button>
          </div>

          {/* 批量操作工具栏 */}
          {selectedIds.size > 0 && onBatchDelete && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  已选择 {selectedIds.size} 个端口映射
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

          {mappings.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>暂无端口映射</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-gray-700">
                  <thead className="bg-blue-50 text-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        {onBatchDelete && (
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(input) => {
                              if (input) input.indeterminate = someSelected
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                      </th>
                      <th className="px-4 py-3 text-left">容器</th>
                      <th className="px-4 py-3 text-left">容器端口</th>
                      <th className="px-4 py-3 text-left">主机端口</th>
                      <th className="px-4 py-3 text-left">协议</th>
                      <th className="px-4 py-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedMappings.map((mapping) => (
                      <tr
                        key={mapping.id}
                        className={`hover:bg-blue-50 transition-colors ${selectedIds.has(mapping.id) ? 'bg-blue-50' : ''
                          }`}
                      >
                        <td className="px-4 py-3">
                          {onBatchDelete && (
                            <input
                              type="checkbox"
                              checked={selectedIds.has(mapping.id)}
                              onChange={(e) => handleSelectOne(mapping.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {mapping.containerName || mapping.containerId}
                        </td>
                        <td className="px-4 py-3">{mapping.containerPort}</td>
                        <td className="px-4 py-3">{mapping.hostPort}</td>
                        <td className="px-4 py-3">{mapping.protocol.toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onDelete(mapping.id)}
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

              {/* 分页组件 */}
              <Pagination
                currentPage={currentPage}
                totalItems={mappings.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                  setSelectedIds(new Set())
                }}
              />
            </>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">创建端口映射</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器 ID *
              </label>
              <input
                type="text"
                value={formData.containerId}
                onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器名称（可选）
              </label>
              <input
                type="text"
                value={formData.containerName}
                onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器端口 *
              </label>
              <input
                type="number"
                value={formData.containerPort}
                onChange={(e) => setFormData({ ...formData, containerPort: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主机端口 *
              </label>
              <input
                type="number"
                value={formData.hostPort}
                onChange={(e) => setFormData({ ...formData, hostPort: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">协议 *</label>
              <select
                value={formData.protocol}
                onChange={(e) =>
                  setFormData({ ...formData, protocol: e.target.value as 'tcp' | 'udp' })
                }
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function VolumeMappingTab({
  mappings,
  onCreate,
  onDelete,
  onBatchDelete,
  isCreating,
  isDeleting,
  isBatchDeleting = false,
}: {
  mappings: VolumeMapping[]
  onCreate: (mapping: Omit<VolumeMapping, 'id'>) => Promise<VolumeMapping>
  onDelete: (mappingId: string) => Promise<void>
  onBatchDelete?: (mappingIds: string[]) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
  isBatchDeleting?: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formData, setFormData] = useState({
    containerId: '',
    containerName: '',
    containerPath: '',
    hostPath: '',
    readOnly: false,
  })

  // 分页数据切片
  const totalPages = Math.ceil(mappings.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedMappings = mappings.slice(startIndex, endIndex)

  // 当数据变化时，调整当前页
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedMappings.map((m) => m.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (mappingId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(mappingId)
    } else {
      newSelected.delete(mappingId)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0 || !onBatchDelete) return
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个卷映射吗？此操作不可恢复。`)) {
      await onBatchDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
      // 如果当前页没有数据了，跳转到上一页
      if (paginatedMappings.length === selectedIds.size && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const allSelected = paginatedMappings.length > 0 && selectedIds.size === paginatedMappings.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < paginatedMappings.length

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedIds(new Set())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onCreate({
      containerId: formData.containerId,
      containerName: formData.containerName || undefined,
      containerPath: formData.containerPath,
      hostPath: formData.hostPath,
      readOnly: formData.readOnly,
    })
    setFormData({
      containerId: '',
      containerName: '',
      containerPath: '',
      hostPath: '',
      readOnly: false,
    })
    setShowForm(false)
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + 添加卷映射
            </button>
          </div>

          {/* 批量操作工具栏 */}
          {selectedIds.size > 0 && onBatchDelete && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  已选择 {selectedIds.size} 个卷映射
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

          {mappings.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>暂无卷映射</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-gray-700">
                  <thead className="bg-blue-50 text-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        {onBatchDelete && (
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(input) => {
                              if (input) input.indeterminate = someSelected
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                      </th>
                      <th className="px-4 py-3 text-left">容器</th>
                      <th className="px-4 py-3 text-left">容器路径</th>
                      <th className="px-4 py-3 text-left">主机路径</th>
                      <th className="px-4 py-3 text-left">只读</th>
                      <th className="px-4 py-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedMappings.map((mapping) => (
                      <tr
                        key={mapping.id}
                        className={`hover:bg-blue-50 transition-colors ${selectedIds.has(mapping.id) ? 'bg-blue-50' : ''
                          }`}
                      >
                        <td className="px-4 py-3">
                          {onBatchDelete && (
                            <input
                              type="checkbox"
                              checked={selectedIds.has(mapping.id)}
                              onChange={(e) => handleSelectOne(mapping.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {mapping.containerName || mapping.containerId}
                        </td>
                        <td className="px-4 py-3">{mapping.containerPath}</td>
                        <td className="px-4 py-3">{mapping.hostPath}</td>
                        <td className="px-4 py-3">{mapping.readOnly ? '是' : '否'}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onDelete(mapping.id)}
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

              {/* 分页组件 */}
              <Pagination
                currentPage={currentPage}
                totalItems={mappings.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                  setSelectedIds(new Set())
                }}
              />
            </>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">创建卷映射</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器 ID *
              </label>
              <input
                type="text"
                value={formData.containerId}
                onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器名称（可选）
              </label>
              <input
                type="text"
                value={formData.containerName}
                onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器路径 *
              </label>
              <input
                type="text"
                value={formData.containerPath}
                onChange={(e) => setFormData({ ...formData, containerPath: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主机路径 *</label>
              <input
                type="text"
                value={formData.hostPath}
                onChange={(e) => setFormData({ ...formData, hostPath: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.readOnly}
                  onChange={(e) => setFormData({ ...formData, readOnly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
                <span>只读</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function NetworkMappingTab({
  mappings,
  onCreate,
  onDelete,
  onBatchDelete,
  isCreating,
  isDeleting,
  isBatchDeleting = false,
}: {
  mappings: NetworkMapping[]
  onCreate: (mapping: Omit<NetworkMapping, 'id'>) => Promise<NetworkMapping>
  onDelete: (mappingId: string) => Promise<void>
  onBatchDelete?: (mappingIds: string[]) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
  isBatchDeleting?: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formData, setFormData] = useState({
    containerId: '',
    containerName: '',
    networkName: '',
    ipAddress: '',
    aliases: '',
  })

  // 分页数据切片
  const totalPages = Math.ceil(mappings.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedMappings = mappings.slice(startIndex, endIndex)

  // 当数据变化时，调整当前页
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedMappings.map((m) => m.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (mappingId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(mappingId)
    } else {
      newSelected.delete(mappingId)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0 || !onBatchDelete) return
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个网络映射吗？此操作不可恢复。`)) {
      await onBatchDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
      // 如果当前页没有数据了，跳转到上一页
      if (paginatedMappings.length === selectedIds.size && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const allSelected = paginatedMappings.length > 0 && selectedIds.size === paginatedMappings.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < paginatedMappings.length

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedIds(new Set())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onCreate({
      containerId: formData.containerId,
      containerName: formData.containerName || undefined,
      networkName: formData.networkName,
      ipAddress: formData.ipAddress || undefined,
      aliases: formData.aliases ? formData.aliases.split(',').map((s) => s.trim()) : undefined,
    })
    setFormData({
      containerId: '',
      containerName: '',
      networkName: '',
      ipAddress: '',
      aliases: '',
    })
    setShowForm(false)
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + 添加网络映射
            </button>
          </div>

          {/* 批量操作工具栏 */}
          {selectedIds.size > 0 && onBatchDelete && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  已选择 {selectedIds.size} 个网络映射
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

          {mappings.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>暂无网络映射</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-gray-700">
                  <thead className="bg-blue-50 text-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        {onBatchDelete && (
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(input) => {
                              if (input) input.indeterminate = someSelected
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                      </th>
                      <th className="px-4 py-3 text-left">容器</th>
                      <th className="px-4 py-3 text-left">网络名称</th>
                      <th className="px-4 py-3 text-left">IP 地址</th>
                      <th className="px-4 py-3 text-left">别名</th>
                      <th className="px-4 py-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedMappings.map((mapping) => (
                      <tr
                        key={mapping.id}
                        className={`hover:bg-blue-50 transition-colors ${selectedIds.has(mapping.id) ? 'bg-blue-50' : ''
                          }`}
                      >
                        <td className="px-4 py-3">
                          {onBatchDelete && (
                            <input
                              type="checkbox"
                              checked={selectedIds.has(mapping.id)}
                              onChange={(e) => handleSelectOne(mapping.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {mapping.containerName || mapping.containerId}
                        </td>
                        <td className="px-4 py-3">{mapping.networkName}</td>
                        <td className="px-4 py-3">{mapping.ipAddress || '-'}</td>
                        <td className="px-4 py-3">{mapping.aliases?.join(', ') || '-'}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onDelete(mapping.id)}
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

              {/* 分页组件 */}
              <Pagination
                currentPage={currentPage}
                totalItems={mappings.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                  setSelectedIds(new Set())
                }}
              />
            </>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">创建网络映射</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器 ID *
              </label>
              <input
                type="text"
                value={formData.containerId}
                onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                容器名称（可选）
              </label>
              <input
                type="text"
                value={formData.containerName}
                onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">网络名称 *</label>
              <input
                type="text"
                value={formData.networkName}
                onChange={(e) => setFormData({ ...formData, networkName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP 地址（可选）
              </label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                别名（逗号分隔，可选）
              </label>
              <input
                type="text"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                placeholder="alias1, alias2"
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
