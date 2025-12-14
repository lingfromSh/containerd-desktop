import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRegistryConfigs,
  saveRegistryConfig,
  deleteRegistryConfig,
} from '@/lib/api/images'
import type { RegistryConfig } from '@/types/image'

export function useRegistry() {
  const queryClient = useQueryClient()

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['registry-configs'],
    queryFn: getRegistryConfigs,
  })

  const saveMutation = useMutation({
    mutationFn: saveRegistryConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registry-configs'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRegistryConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registry-configs'] })
    },
  })

  return {
    configs,
    isLoading,
    saveConfig: saveMutation.mutateAsync,
    deleteConfig: deleteMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
