import { useState } from 'react'
import { useRegistry } from '@/hooks/useRegistry'
import type { RegistryConfig } from '@/types/image'

export function RegistryConfig() {
  const { configs, isLoading, saveConfig, deleteConfig, isSaving, isDeleting } = useRegistry()
  const [showForm, setShowForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState<RegistryConfig | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    isDefault: false,
    username: '',
    password: '',
  })

  const handleEdit = (config: RegistryConfig) => {
    setEditingConfig(config)
    setFormData({
      name: config.name,
      url: config.url,
      isDefault: config.isDefault,
      username: config.credentials?.username || '',
      password: config.credentials?.password || '',
    })
    setShowForm(true)
  }

  const handleNew = () => {
    setEditingConfig(null)
    setFormData({
      name: '',
      url: '',
      isDefault: false,
      username: '',
      password: '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const configToSave: Omit<RegistryConfig, 'id'> | RegistryConfig = editingConfig
      ? {
        ...editingConfig,
        name: formData.name,
        url: formData.url,
        isDefault: formData.isDefault,
        credentials:
          formData.username || formData.password
            ? {
              username: formData.username || undefined,
              password: formData.password || undefined,
            }
            : undefined,
      }
      : {
        name: formData.name,
        url: formData.url,
        isDefault: formData.isDefault,
        credentials:
          formData.username || formData.password
            ? {
              username: formData.username || undefined,
              password: formData.password || undefined,
            }
            : undefined,
      }

    await saveConfig(configToSave as RegistryConfig)
    setShowForm(false)
    setEditingConfig(null)
  }

  const handleDelete = async (configId: string) => {
    if (confirm('确定要删除此镜像源配置吗？')) {
      try {
        await deleteConfig(configId)
      } catch (error) {
        alert((error as Error).message)
      }
    }
  }

  const handleSetDefault = async (config: RegistryConfig) => {
    await saveConfig({ ...config, isDefault: true })
  }

  if (isLoading) {
    return <div className="text-gray-600">加载中...</div>
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">镜像源配置</h3>
            <button
              type="button"
              onClick={handleNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + 添加镜像源
            </button>
          </div>
          {configs.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>暂无镜像源配置</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-blue-50 text-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left">名称</th>
                    <th className="px-4 py-3 text-left">URL</th>
                    <th className="px-4 py-3 text-left">默认</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {configs.map((config) => (
                    <tr key={config.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3">{config.name}</td>
                      <td className="px-4 py-3">{config.url}</td>
                      <td className="px-4 py-3">
                        {config.isDefault ? (
                          <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                            是
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-400 text-white rounded text-xs">
                            否
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {!config.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(config)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                            >
                              设为默认
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEdit(config)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
                          >
                            编辑
                          </button>
                          {config.id !== 'flexiv-harbor' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(config.id)}
                              disabled={isDeleting}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                            >
                              删除
                            </button>
                          )}
                        </div>
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
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {editingConfig ? '编辑镜像源' : '添加镜像源'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                placeholder="harbor.flexiv.com"
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名（可选）</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码（可选）</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
                <span>设为默认镜像源</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingConfig(null)
              }}
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
