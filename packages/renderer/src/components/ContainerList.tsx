import type { Container } from '@/types/container'

interface ContainerListProps {
  containers: Container[]
  onStart: (containerId: string) => Promise<Container>
  onStop: (containerId: string) => Promise<Container>
  onDelete: (containerId: string) => Promise<void>
  isStarting: boolean
  isStopping: boolean
  isDeleting: boolean
}

export function ContainerList({
  containers,
  onStart,
  onStop,
  onDelete,
  isStarting,
  isStopping,
  isDeleting,
}: ContainerListProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      running: { label: '运行中', className: 'bg-green-600' },
      stopped: { label: '已停止', className: 'bg-gray-600' },
      paused: { label: '已暂停', className: 'bg-yellow-600' },
      created: { label: '已创建', className: 'bg-blue-600' },
      exited: { label: '已退出', className: 'bg-red-600' },
    }

    const config = statusConfig[status] || { label: status, className: 'bg-gray-600' }

    return (
      <span className={`px-2 py-1 text-white rounded text-xs ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (containers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>暂无容器</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm text-gray-200">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">容器名称</th>
            <th className="px-4 py-3 text-left">状态</th>
            <th className="px-4 py-3 text-left">镜像</th>
            <th className="px-4 py-3 text-left">创建时间</th>
            <th className="px-4 py-3 text-left">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {containers.map((container) => (
            <tr key={container.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3">{container.name}</td>
              <td className="px-4 py-3">{getStatusBadge(container.status)}</td>
              <td className="px-4 py-3">{container.image}</td>
              <td className="px-4 py-3">{formatDate(container.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {container.status === 'stopped' || container.status === 'exited' ? (
                    <button
                      type="button"
                      onClick={() => onStart(container.id)}
                      disabled={isStarting}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      启动
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStop(container.id)}
                      disabled={isStopping}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      停止
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(container.id)}
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
  )
}
