import { createRoute } from '@tanstack/react-router'
import { MappingList } from '@/components/MappingList'
import { useMappings } from '@/hooks/useMappings'
import type { RootRoute } from '@tanstack/react-router'

function MappingsPage() {
  const {
    portMappings,
    volumeMappings,
    networkMappings,
    isLoading,
    createPortMapping,
    createVolumeMapping,
    createNetworkMapping,
    deletePortMapping,
    deleteVolumeMapping,
    deleteNetworkMapping,
    isCreating,
    isDeleting,
  } = useMappings()

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">映射列表</h1>
          <p className="text-gray-600">管理容器映射</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          {isLoading ? (
            <div className="text-center py-12 text-gray-600">加载中...</div>
          ) : (
            <MappingList
              portMappings={portMappings}
              volumeMappings={volumeMappings}
              networkMappings={networkMappings}
              onCreatePortMapping={createPortMapping}
              onCreateVolumeMapping={createVolumeMapping}
              onCreateNetworkMapping={createNetworkMapping}
              onDeletePortMapping={deletePortMapping}
              onDeleteVolumeMapping={deleteVolumeMapping}
              onDeleteNetworkMapping={deleteNetworkMapping}
              isCreating={isCreating}
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
    path: '/mappings',
    component: MappingsPage,
  })
