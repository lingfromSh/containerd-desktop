import { createRoute } from '@tanstack/react-router'
import { ContainerList } from '@/components/ContainerList'
import { useContainers } from '@/hooks/useContainers'
import type { RootRoute } from '@tanstack/react-router'

function ContainersPage() {
  const {
    containers,
    isLoading,
    startContainer,
    stopContainer,
    deleteContainer,
    isStarting,
    isStopping,
    isDeleting,
  } = useContainers()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">容器列表</h1>
          <p className="text-gray-400">管理您的容器</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">加载中...</div>
          ) : (
            <ContainerList
              containers={containers}
              onStart={startContainer}
              onStop={stopContainer}
              onDelete={deleteContainer}
              isStarting={isStarting}
              isStopping={isStopping}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/containers',
    component: ContainersPage,
  })
