import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Image } from '@/types/image'
import type { CreateContainerOptions } from '@/lib/api/containers'

interface CreateContainerModalProps {
  images: Image[]
  onClose: () => void
  onCreate: (options: CreateContainerOptions) => Promise<void>
  isCreating?: boolean
}

export function CreateContainerModal({
  images,
  onClose,
  onCreate,
  isCreating = false,
}: CreateContainerModalProps) {
  const [formData, setFormData] = useState<CreateContainerOptions>({
    name: '',
    image: '',
    imageId: '',
    ports: [],
    environment: {},
    command: [],
    workingDir: '',
    restartPolicy: 'unless-stopped',
  })

  const [newPort, setNewPort] = useState({
    containerPort: '',
    hostPort: '',
    protocol: 'tcp' as 'tcp' | 'udp',
  })

  const [newEnv, setNewEnv] = useState({ key: '', value: '' })
  const [newCommand, setNewCommand] = useState('')

  const handleImageChange = (imageId: string) => {
    const image = images.find((img) => img.id === imageId)
    if (image) {
      setFormData({
        ...formData,
        image: `${image.name}:${image.tag}`,
        imageId: image.id,
      })
    }
  }

  const addPort = () => {
    if (newPort.containerPort) {
      setFormData({
        ...formData,
        ports: [
          ...(formData.ports || []),
          {
            containerPort: parseInt(newPort.containerPort, 10),
            hostPort: newPort.hostPort ? parseInt(newPort.hostPort, 10) : undefined,
            protocol: newPort.protocol,
          },
        ],
      })
      setNewPort({ containerPort: '', hostPort: '', protocol: 'tcp' })
    }
  }

  const removePort = (index: number) => {
    const newPorts = [...(formData.ports || [])]
    newPorts.splice(index, 1)
    setFormData({ ...formData, ports: newPorts })
  }

  const addEnv = () => {
    if (newEnv.key) {
      setFormData({
        ...formData,
        environment: {
          ...(formData.environment || {}),
          [newEnv.key]: newEnv.value,
        },
      })
      setNewEnv({ key: '', value: '' })
    }
  }

  const removeEnv = (key: string) => {
    const newEnv = { ...(formData.environment || {}) }
    delete newEnv[key]
    setFormData({ ...formData, environment: newEnv })
  }

  const addCommand = () => {
    if (newCommand.trim()) {
      setFormData({
        ...formData,
        command: [...(formData.command || []), newCommand.trim()],
      })
      setNewCommand('')
    }
  }

  const removeCommand = (index: number) => {
    const newCommands = [...(formData.command || [])]
    newCommands.splice(index, 1)
    setFormData({ ...formData, command: newCommands })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.imageId) {
      alert('请填写容器名称并选择镜像')
      return
    }
    try {
      await onCreate(formData)
      onClose()
    } catch (error) {
      alert('创建容器失败: ' + (error as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">创建容器</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 基本信息 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    容器名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="my-container"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    镜像 *
                  </label>
                  <select
                    value={formData.imageId}
                    onChange={(e) => handleImageChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">请选择镜像</option>
                    {images.map((image) => (
                      <option key={image.id} value={image.id}>
                        {image.name}:{image.tag} ({image.registry || 'local'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    重启策略
                  </label>
                  <select
                    value={formData.restartPolicy}
                    onChange={(e) =>
                      setFormData({ ...formData, restartPolicy: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="no">不重启</option>
                    <option value="always">总是重启</option>
                    <option value="unless-stopped">除非停止</option>
                    <option value="on-failure">失败时重启</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工作目录
                  </label>
                  <input
                    type="text"
                    value={formData.workingDir}
                    onChange={(e) =>
                      setFormData({ ...formData, workingDir: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="/app"
                  />
                </div>
              </div>
            </section>

            {/* 端口映射 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">端口映射</h3>
              <div className="space-y-2">
                {formData.ports && formData.ports.length > 0 && (
                  <div className="space-y-2">
                    {formData.ports.map((port, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-700 flex-1">
                          {port.containerPort} → {port.hostPort || '自动'} ({port.protocol})
                        </span>
                        <button
                          type="button"
                          onClick={() => removePort(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newPort.containerPort}
                    onChange={(e) =>
                      setNewPort({ ...newPort, containerPort: e.target.value })
                    }
                    placeholder="容器端口"
                    className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={newPort.hostPort}
                    onChange={(e) => setNewPort({ ...newPort, hostPort: e.target.value })}
                    placeholder="主机端口（可选）"
                    className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newPort.protocol}
                    onChange={(e) =>
                      setNewPort({ ...newPort, protocol: e.target.value as 'tcp' | 'udp' })
                    }
                    className="px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                  </select>
                  <button
                    type="button"
                    onClick={addPort}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* 环境变量 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">环境变量</h3>
              <div className="space-y-2">
                {formData.environment &&
                  Object.keys(formData.environment).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(formData.environment).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700 flex-1">
                            {key} = {value}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeEnv(key)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEnv.key}
                    onChange={(e) => setNewEnv({ ...newEnv, key: e.target.value })}
                    placeholder="变量名"
                    className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newEnv.value}
                    onChange={(e) => setNewEnv({ ...newEnv, value: e.target.value })}
                    placeholder="变量值"
                    className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addEnv}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* 启动命令 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">启动命令</h3>
              <div className="space-y-2">
                {formData.command && formData.command.length > 0 && (
                  <div className="space-y-2">
                    {formData.command.map((cmd, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <code className="text-sm text-gray-700 flex-1">{cmd}</code>
                        <button
                          type="button"
                          onClick={() => removeCommand(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommand}
                    onChange={(e) => setNewCommand(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCommand()
                      }
                    }}
                    placeholder="输入命令（按 Enter 添加）"
                    className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCommand}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating || !formData.name || !formData.imageId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? '创建中...' : '创建容器'}
          </button>
        </div>
      </div>
    </div>
  )
}
