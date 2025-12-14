import { useState } from 'react'
import { Plus } from 'lucide-react'
import { createRoute } from '@tanstack/react-router'
import { ContainerList } from '@/components/ContainerList'
import { CreateContainerModal } from '@/components/CreateContainerModal'
import { useContainers } from '@/hooks/useContainers'
import { useImages } from '@/hooks/useImages'
import type { RootRoute } from '@tanstack/react-router'

function ContainersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const {
    containers,
    isLoading,
    startContainer,
    stopContainer,
    deleteContainer,
    restartContainer,
    pauseContainer,
    resumeContainer,
    getContainerLogs,
    execContainer,
    getContainerDetails,
    createContainer,
    batchStartContainers,
    batchStopContainers,
    batchDeleteContainers,
    isStarting,
    isStopping,
    isDeleting,
    isRestarting,
    isPausing,
    isResuming,
    isGettingLogs,
    isExecuting,
    isGettingDetails,
    isCreating,
    isBatchStarting,
    isBatchStopping,
    isBatchDeleting,
  } = useContainers()

  const { images } = useImages()

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">容器管理</h1>
            <p className="text-gray-600">管理您的容器</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            创建容器
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          {isLoading ? (
            <div className="text-center py-12 text-gray-600">加载中...</div>
          ) : (
            <ContainerList
              containers={containers}
              onStart={startContainer}
              onStop={stopContainer}
              onDelete={deleteContainer}
              onRestart={restartContainer}
              onPause={pauseContainer}
              onResume={resumeContainer}
              onGetDetails={getContainerDetails}
              onGetLogs={getContainerLogs}
              onExecCommand={execContainer}
              onBatchStart={batchStartContainers}
              onBatchStop={batchStopContainers}
              onBatchDelete={batchDeleteContainers}
              isStarting={isStarting}
              isStopping={isStopping}
              isDeleting={isDeleting}
              isRestarting={isRestarting}
              isPausing={isPausing}
              isResuming={isResuming}
              isGettingDetails={isGettingDetails}
              isGettingLogs={isGettingLogs}
              isExecuting={isExecuting}
              isBatchStarting={isBatchStarting}
              isBatchStopping={isBatchStopping}
              isBatchDeleting={isBatchDeleting}
            />
          )}
        </div>
      </div>

      {/* 创建容器模态框 */}
      {showCreateModal && (
        <CreateContainerModal
          images={images}
          onClose={() => setShowCreateModal(false)}
          onCreate={createContainer}
          isCreating={isCreating}
        />
      )}
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/containers',
    component: ContainersPage,
  })
