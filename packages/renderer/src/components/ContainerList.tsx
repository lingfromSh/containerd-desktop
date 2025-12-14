import { useState } from 'react'
import { Play, Square, RotateCw, Pause, Trash2, Info, FileText, Terminal, MoreVertical } from 'lucide-react'
import type { Container, ContainerDetails } from '@/types/container'
import { ContainerDetailsModal } from './ContainerDetailsModal'
import { ContainerLogsModal } from './ContainerLogsModal'
import { ContainerTerminalModal } from './ContainerTerminalModal'

interface ContainerListProps {
  containers: Container[]
  onStart: (containerId: string) => Promise<Container>
  onStop: (containerId: string) => Promise<Container>
  onDelete: (containerId: string) => Promise<void>
  onRestart: (containerId: string) => Promise<Container>
  onPause: (containerId: string) => Promise<Container>
  onResume: (containerId: string) => Promise<Container>
  onGetDetails: (containerId: string) => Promise<ContainerDetails>
  onGetLogs: (containerId: string, tail?: number) => Promise<{ logs: string[]; timestamp: string }>
  onExecCommand: (containerId: string, command: string) => Promise<{ output: string; exitCode: number }>
  onBatchStart?: (containerIds: string[]) => Promise<void>
  onBatchStop?: (containerIds: string[]) => Promise<void>
  onBatchDelete?: (containerIds: string[]) => Promise<void>
  isStarting: boolean
  isStopping: boolean
  isDeleting: boolean
  isRestarting: boolean
  isPausing: boolean
  isResuming: boolean
  isGettingDetails?: boolean
  isGettingLogs?: boolean
  isExecuting?: boolean
  isBatchStarting?: boolean
  isBatchStopping?: boolean
  isBatchDeleting?: boolean
}

export function ContainerList({
  containers,
  onStart,
  onStop,
  onDelete,
  onRestart,
  onPause,
  onResume,
  onGetDetails,
  onGetLogs,
  onExecCommand,
  onBatchStart,
  onBatchStop,
  onBatchDelete,
  isStarting,
  isStopping,
  isDeleting,
  isRestarting,
  isPausing,
  isResuming,
  isGettingDetails = false,
  isGettingLogs = false,
  isExecuting = false,
  isBatchStarting = false,
  isBatchStopping = false,
  isBatchDeleting = false,
}: ContainerListProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailsModal, setDetailsModal] = useState<ContainerDetails | null>(null)
  const [logsModal, setLogsModal] = useState<{ containerId: string; containerName: string } | null>(null)
  const [terminalModal, setTerminalModal] = useState<{ containerId: string; containerName: string } | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(containers.map((c) => c.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (containerId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(containerId)
    } else {
      newSelected.delete(containerId)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchStart = async () => {
    if (selectedIds.size === 0) return
    if (onBatchStart) {
      await onBatchStart(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const handleBatchStop = async () => {
    if (selectedIds.size === 0) return
    if (onBatchStop) {
      await onBatchStop(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return
    if (
      confirm(`确定要删除选中的 ${selectedIds.size} 个容器吗？此操作不可恢复。`)
    ) {
      if (onBatchDelete) {
        await onBatchDelete(Array.from(selectedIds))
        setSelectedIds(new Set())
      }
    }
  }

  const allSelected = containers.length > 0 && selectedIds.size === containers.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < containers.length

  const handleViewDetails = async (containerId: string) => {
    try {
      const details = await onGetDetails(containerId)
      setDetailsModal(details)
    } catch (error) {
      console.error('获取容器详情失败:', error)
      alert('获取容器详情失败: ' + (error as Error).message)
    }
  }

  const handleViewLogs = (containerId: string) => {
    const container = containers.find((c) => c.id === containerId)
    if (container) {
      setLogsModal({ containerId, containerName: container.name })
    }
  }

  const handleOpenTerminal = (containerId: string) => {
    const container = containers.find((c) => c.id === containerId)
    if (container) {
      setTerminalModal({ containerId, containerName: container.name })
    }
  }
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

  // 点击外部关闭下拉菜单
  const handleClickOutside = (e: React.MouseEvent) => {
    if (expandedRow && !(e.target as HTMLElement).closest('.relative')) {
      setExpandedRow(null)
    }
  }

  if (containers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>暂无容器</p>
      </div>
    )
  }

  return (
    <div onClick={handleClickOutside}>
      {/* 批量操作工具栏 */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              已选择 {selectedIds.size} 个容器
            </span>
            {onBatchStart && (
              <button
                onClick={handleBatchStart}
                disabled={isBatchStarting}
                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-1"
              >
                <Play size={14} />
                批量启动
              </button>
            )}
            {onBatchStop && (
              <button
                onClick={handleBatchStop}
                disabled={isBatchStopping}
                className="px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-1"
              >
                <Square size={14} />
                批量停止
              </button>
            )}
            {onBatchDelete && (
              <button
                onClick={handleBatchDelete}
                disabled={isBatchDeleting}
                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-1"
              >
                <Trash2 size={14} />
                批量删除
              </button>
            )}
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
              <th className="px-4 py-3 text-left">容器名称</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">镜像</th>
              <th className="px-4 py-3 text-left">创建时间</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {containers.map((container) => (
              <tr
                key={container.id}
                className={`hover:bg-blue-50 transition-colors ${selectedIds.has(container.id) ? 'bg-blue-50' : ''
                  }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(container.id)}
                    onChange={(e) => handleSelectOne(container.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">{container.name}</td>
                <td className="px-4 py-3">{getStatusBadge(container.status)}</td>
                <td className="px-4 py-3">{container.image}</td>
                <td className="px-4 py-3">{formatDate(container.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {/* 主要操作按钮组 */}
                    <div className="flex gap-1">
                      {/* 启动按钮 */}
                      {(container.status === 'stopped' ||
                        container.status === 'exited' ||
                        container.status === 'created' ||
                        container.status === 'paused') && (
                          <button
                            type="button"
                            onClick={() => onStart(container.id)}
                            disabled={isStarting || isResuming}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="启动容器"
                          >
                            <Play size={16} />
                          </button>
                        )}
                      {/* 停止按钮 */}
                      {container.status === 'running' && (
                        <button
                          type="button"
                          onClick={() => onStop(container.id)}
                          disabled={isStopping}
                          className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="停止容器"
                        >
                          <Square size={16} />
                        </button>
                      )}
                      {/* 重启按钮 - 仅在运行状态显示 */}
                      {container.status === 'running' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('确定要重启容器吗？')) {
                              onRestart(container.id)
                            }
                          }}
                          disabled={isRestarting}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="重启容器"
                        >
                          <RotateCw size={16} />
                        </button>
                      )}
                      {/* 暂停按钮 - 仅在运行状态显示 */}
                      {container.status === 'running' && (
                        <button
                          type="button"
                          onClick={() => onPause(container.id)}
                          disabled={isPausing}
                          className="p-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="暂停容器"
                        >
                          <Pause size={16} />
                        </button>
                      )}
                      {/* 恢复按钮 - 仅在暂停状态显示 */}
                      {container.status === 'paused' && (
                        <button
                          type="button"
                          onClick={() => onResume(container.id)}
                          disabled={isResuming}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="恢复容器"
                        >
                          <Play size={16} />
                        </button>
                      )}
                    </div>

                    {/* 更多操作下拉菜单 */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRow(expandedRow === container.id ? null : container.id)
                        }
                        className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        title="更多操作"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {expandedRow === container.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            type="button"
                            onClick={() => {
                              handleViewDetails(container.id)
                              setExpandedRow(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Info size={16} />
                            查看详情
                          </button>
                          {container.status === 'running' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  handleViewLogs(container.id)
                                  setExpandedRow(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FileText size={16} />
                                查看日志
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleOpenTerminal(container.id)
                                  setExpandedRow(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Terminal size={16} />
                                进入终端
                              </button>
                            </>
                          )}
                          <div className="border-t border-gray-200"></div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('确定要删除容器吗？此操作不可恢复。')) {
                                onDelete(container.id)
                              }
                              setExpandedRow(null)
                            }}
                            disabled={isDeleting}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            删除容器
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 模态组件 */}
      {detailsModal && (
        <ContainerDetailsModal
          container={detailsModal}
          onClose={() => setDetailsModal(null)}
        />
      )}

      {logsModal && (
        <ContainerLogsModal
          containerId={logsModal.containerId}
          containerName={logsModal.containerName}
          onClose={() => setLogsModal(null)}
          onFetchLogs={onGetLogs}
          isFetching={isGettingLogs}
        />
      )}

      {terminalModal && (
        <ContainerTerminalModal
          containerId={terminalModal.containerId}
          containerName={terminalModal.containerName}
          onClose={() => setTerminalModal(null)}
          onExecCommand={onExecCommand}
          isExecuting={isExecuting}
        />
      )}
    </div>
  )
}
