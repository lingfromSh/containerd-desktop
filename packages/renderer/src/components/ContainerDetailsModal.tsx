import { X } from 'lucide-react'
import type { ContainerDetails } from '@/types/container'

interface ContainerDetailsModalProps {
  container: ContainerDetails | null
  onClose: () => void
}

export function ContainerDetailsModal({
  container,
  onClose,
}: ContainerDetailsModalProps) {
  if (!container) return null

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
          <h2 className="text-2xl font-bold text-gray-900">容器详情</h2>
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
                  <label className="text-sm font-medium text-gray-600">容器名称</label>
                  <p className="mt-1 text-gray-900">{container.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">容器ID</label>
                  <p className="mt-1 text-gray-900 font-mono text-sm">{container.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">状态</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-white rounded text-xs ${container.status === 'running'
                        ? 'bg-green-600'
                        : container.status === 'stopped'
                          ? 'bg-gray-600'
                          : container.status === 'paused'
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                    >
                      {container.status === 'running'
                        ? '运行中'
                        : container.status === 'stopped'
                          ? '已停止'
                          : container.status === 'paused'
                            ? '已暂停'
                            : '已退出'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">镜像</label>
                  <p className="mt-1 text-gray-900">{container.image}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">创建时间</label>
                  <p className="mt-1 text-gray-900">{formatDate(container.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">启动时间</label>
                  <p className="mt-1 text-gray-900">{formatDate(container.startedAt)}</p>
                </div>
                {container.hostname && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">主机名</label>
                    <p className="mt-1 text-gray-900">{container.hostname}</p>
                  </div>
                )}
                {container.user && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">用户</label>
                    <p className="mt-1 text-gray-900">{container.user}</p>
                  </div>
                )}
              </div>
            </section>

            {/* 资源使用 */}
            {container.resources && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">资源使用</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">CPU 使用率</label>
                    <p className="mt-1 text-gray-900">
                      {container.resources.cpuUsage?.toFixed(2) || 'N/A'}%
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">内存使用</label>
                    <p className="mt-1 text-gray-900">
                      {formatBytes(container.resources.memoryUsage)} /{' '}
                      {formatBytes(container.resources.memoryLimit)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">网络接收</label>
                    <p className="mt-1 text-gray-900">
                      {formatBytes(container.resources.networkIn)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">网络发送</label>
                    <p className="mt-1 text-gray-900">
                      {formatBytes(container.resources.networkOut)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">磁盘读取</label>
                    <p className="mt-1 text-gray-900">
                      {formatBytes(container.resources.diskRead)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">磁盘写入</label>
                    <p className="mt-1 text-gray-900">
                      {formatBytes(container.resources.diskWrite)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 端口映射 */}
            {container.ports && container.ports.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">端口映射</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">容器端口</th>
                        <th className="px-4 py-2 text-left">主机端口</th>
                        <th className="px-4 py-2 text-left">协议</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {container.ports.map((port, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{port.containerPort}</td>
                          <td className="px-4 py-2">{port.hostPort || 'N/A'}</td>
                          <td className="px-4 py-2">{port.protocol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 启动命令 */}
            {container.command && container.command.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">启动命令</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-gray-900">
                    {container.command.join(' ')}
                  </code>
                </div>
              </section>
            )}

            {/* 工作目录 */}
            {container.workingDir && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">工作目录</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-gray-900">{container.workingDir}</code>
                </div>
              </section>
            )}

            {/* 环境变量 */}
            {container.environment && Object.keys(container.environment).length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">环境变量</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {Object.entries(container.environment).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-mono text-sm text-gray-700 font-medium">
                          {key}:
                        </span>
                        <span className="font-mono text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 挂载点 */}
            {container.mounts && container.mounts.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">挂载点</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">源路径</th>
                        <th className="px-4 py-2 text-left">目标路径</th>
                        <th className="px-4 py-2 text-left">类型</th>
                        <th className="px-4 py-2 text-left">只读</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {container.mounts.map((mount, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-mono text-xs">{mount.source}</td>
                          <td className="px-4 py-2 font-mono text-xs">{mount.destination}</td>
                          <td className="px-4 py-2">{mount.type}</td>
                          <td className="px-4 py-2">
                            {mount.readOnly ? (
                              <span className="text-red-600">是</span>
                            ) : (
                              <span className="text-green-600">否</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 网络设置 */}
            {container.networkSettings?.networks &&
              Object.keys(container.networkSettings.networks).length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">网络设置</h3>
                  <div className="space-y-4">
                    {Object.entries(container.networkSettings.networks).map(
                      ([networkName, network]) => (
                        <div key={networkName} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{networkName}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {network.ipAddress && (
                              <div>
                                <span className="text-gray-600">IP 地址: </span>
                                <span className="text-gray-900 font-mono">
                                  {network.ipAddress}
                                </span>
                              </div>
                            )}
                            {network.gateway && (
                              <div>
                                <span className="text-gray-600">网关: </span>
                                <span className="text-gray-900 font-mono">{network.gateway}</span>
                              </div>
                            )}
                            {network.macAddress && (
                              <div>
                                <span className="text-gray-600">MAC 地址: </span>
                                <span className="text-gray-900 font-mono">
                                  {network.macAddress}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}

            {/* 重启策略 */}
            {container.restartPolicy && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">重启策略</h3>
                <p className="text-gray-900">{container.restartPolicy}</p>
              </section>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
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
