import { useState } from 'react'
import type { PortMapping, VolumeMapping, NetworkMapping } from '@/types/mapping'

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
  isCreating: boolean
  isDeleting: boolean
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
  isCreating,
  isDeleting,
}: MappingListProps) {
  const [activeTab, setActiveTab] = useState<'ports' | 'volumes' | 'networks'>('ports')

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-gray-700 mb-4">
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('ports')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'ports'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            端口映射 ({portMappings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('volumes')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'volumes'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            卷映射 ({volumeMappings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('networks')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'networks'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-200'
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
            isCreating={isCreating}
            isDeleting={isDeleting}
          />
        )}
        {activeTab === 'volumes' && (
          <VolumeMappingTab
            mappings={volumeMappings}
            onCreate={onCreateVolumeMapping}
            onDelete={onDeleteVolumeMapping}
            isCreating={isCreating}
            isDeleting={isDeleting}
          />
        )}
        {activeTab === 'networks' && (
          <NetworkMappingTab
            mappings={networkMappings}
            onCreate={onCreateNetworkMapping}
            onDelete={onDeleteNetworkMapping}
            isCreating={isCreating}
            isDeleting={isDeleting}
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
  isCreating,
  isDeleting,
}: {
  mappings: PortMapping[]
  onCreate: (mapping: Omit<PortMapping, 'id'>) => Promise<PortMapping>
  onDelete: (mappingId: string) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    containerId: '',
    containerName: '',
    containerPort: '',
    hostPort: '',
    protocol: 'tcp' as 'tcp' | 'udp',
  })

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
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            + 添加端口映射
          </button>
          {mappings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>暂无端口映射</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-gray-200">
                <thead className="bg-gray-800 text-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">容器</th>
                    <th className="px-4 py-3 text-left">容器端口</th>
                    <th className="px-4 py-3 text-left">主机端口</th>
                    <th className="px-4 py-3 text-left">协议</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mappings.map((mapping) => (
                    <tr key={mapping.id} className="hover:bg-gray-800 transition-colors">
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
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">创建端口映射</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器 ID *
              </label>
              <input
                type="text"
                value={formData.containerId}
                onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器名称（可选）
              </label>
              <input
                type="text"
                value={formData.containerName}
                onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器端口 *
              </label>
              <input
                type="number"
                value={formData.containerPort}
                onChange={(e) => setFormData({ ...formData, containerPort: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                主机端口 *
              </label>
              <input
                type="number"
                value={formData.hostPort}
                onChange={(e) => setFormData({ ...formData, hostPort: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">协议 *</label>
              <select
                value={formData.protocol}
                onChange={(e) =>
                  setFormData({ ...formData, protocol: e.target.value as 'tcp' | 'udp' })
                }
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
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
  isCreating,
  isDeleting,
}: {
  mappings: VolumeMapping[]
  onCreate: (mapping: Omit<VolumeMapping, 'id'>) => Promise<VolumeMapping>
  onDelete: (mappingId: string) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    containerId: '',
    containerName: '',
    containerPath: '',
    hostPath: '',
    readOnly: false,
  })

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
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            + 添加卷映射
          </button>
          {mappings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>暂无卷映射</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-gray-200">
                <thead className="bg-gray-800 text-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">容器</th>
                    <th className="px-4 py-3 text-left">容器路径</th>
                    <th className="px-4 py-3 text-left">主机路径</th>
                    <th className="px-4 py-3 text-left">只读</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mappings.map((mapping) => (
                    <tr key={mapping.id} className="hover:bg-gray-800 transition-colors">
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
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">创建卷映射</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器 ID *
              </label>
              <input
                type="text"
                value={formData.containerId}
                onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器名称（可选）
              </label>
              <input
                type="text"
                value={formData.containerName}
                onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器路径 *
              </label>
              <input
                type="text"
                value={formData.containerPath}
                onChange={(e) => setFormData({ ...formData, containerPath: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">主机路径 *</label>
              <input
                type="text"
                value={formData.hostPath}
                onChange={(e) => setFormData({ ...formData, hostPath: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.readOnly}
                  onChange={(e) => setFormData({ ...formData, readOnly: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span>只读</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
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
  isCreating,
  isDeleting,
}: {
  mappings: NetworkMapping[]
  onCreate: (mapping: Omit<NetworkMapping, 'id'>) => Promise<NetworkMapping>
  onDelete: (mappingId: string) => Promise<void>
  isCreating: boolean
  isDeleting: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    containerId: '',
    containerName: '',
    networkName: '',
    ipAddress: '',
    aliases: '',
  })

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
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            + 添加网络映射
          </button>
          {mappings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>暂无网络映射</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-gray-200">
                <thead className="bg-gray-800 text-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">容器</th>
                    <th className="px-4 py-3 text-left">网络名称</th>
                    <th className="px-4 py-3 text-left">IP 地址</th>
                    <th className="px-4 py-3 text-left">别名</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mappings.map((mapping) => (
                    <tr key={mapping.id} className="hover:bg-gray-800 transition-colors">
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
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">创建网络映射</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器 ID *
              </label>
              <input
                type="text"
                value={formData.containerId}
                onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                容器名称（可选）
              </label>
              <input
                type="text"
                value={formData.containerName}
                onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">网络名称 *</label>
              <input
                type="text"
                value={formData.networkName}
                onChange={(e) => setFormData({ ...formData, networkName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                IP 地址（可选）
              </label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                别名（逗号分隔，可选）
              </label>
              <input
                type="text"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                placeholder="alias1, alias2"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
