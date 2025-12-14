import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPortMappings,
  getVolumeMappings,
  getNetworkMappings,
  createPortMapping,
  createVolumeMapping,
  createNetworkMapping,
  deletePortMapping,
  deleteVolumeMapping,
  deleteNetworkMapping,
  batchDeletePortMappings,
  batchDeleteVolumeMappings,
  batchDeleteNetworkMappings,
} from '@/lib/api/mappings'
import type { PortMapping, VolumeMapping, NetworkMapping } from '@/types/mapping'

export function useMappings() {
  const queryClient = useQueryClient()

  const { data: portMappings = [], isLoading: isLoadingPorts } = useQuery({
    queryKey: ['mappings', 'ports'],
    queryFn: getPortMappings,
  })

  const { data: volumeMappings = [], isLoading: isLoadingVolumes } = useQuery({
    queryKey: ['mappings', 'volumes'],
    queryFn: getVolumeMappings,
  })

  const { data: networkMappings = [], isLoading: isLoadingNetworks } = useQuery({
    queryKey: ['mappings', 'networks'],
    queryFn: getNetworkMappings,
  })

  const createPortMutation = useMutation({
    mutationFn: createPortMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'ports'] })
    },
  })

  const createVolumeMutation = useMutation({
    mutationFn: createVolumeMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'volumes'] })
    },
  })

  const createNetworkMutation = useMutation({
    mutationFn: createNetworkMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'networks'] })
    },
  })

  const deletePortMutation = useMutation({
    mutationFn: deletePortMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'ports'] })
    },
  })

  const deleteVolumeMutation = useMutation({
    mutationFn: deleteVolumeMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'volumes'] })
    },
  })

  const deleteNetworkMutation = useMutation({
    mutationFn: deleteNetworkMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'networks'] })
    },
  })

  const batchDeletePortMutation = useMutation({
    mutationFn: batchDeletePortMappings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'ports'] })
    },
  })

  const batchDeleteVolumeMutation = useMutation({
    mutationFn: batchDeleteVolumeMappings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'volumes'] })
    },
  })

  const batchDeleteNetworkMutation = useMutation({
    mutationFn: batchDeleteNetworkMappings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', 'networks'] })
    },
  })

  return {
    portMappings,
    volumeMappings,
    networkMappings,
    isLoading: isLoadingPorts || isLoadingVolumes || isLoadingNetworks,
    createPortMapping: createPortMutation.mutateAsync,
    createVolumeMapping: createVolumeMutation.mutateAsync,
    createNetworkMapping: createNetworkMutation.mutateAsync,
    deletePortMapping: deletePortMutation.mutateAsync,
    deleteVolumeMapping: deleteVolumeMutation.mutateAsync,
    deleteNetworkMapping: deleteNetworkMutation.mutateAsync,
    batchDeletePortMappings: batchDeletePortMutation.mutateAsync,
    batchDeleteVolumeMappings: batchDeleteVolumeMutation.mutateAsync,
    batchDeleteNetworkMappings: batchDeleteNetworkMutation.mutateAsync,
    isCreating:
      createPortMutation.isPending ||
      createVolumeMutation.isPending ||
      createNetworkMutation.isPending,
    isDeleting:
      deletePortMutation.isPending ||
      deleteVolumeMutation.isPending ||
      deleteNetworkMutation.isPending,
    isBatchDeleting:
      batchDeletePortMutation.isPending ||
      batchDeleteVolumeMutation.isPending ||
      batchDeleteNetworkMutation.isPending,
  }
}
