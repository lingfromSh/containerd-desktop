import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getContainers,
  startContainer,
  stopContainer,
  deleteContainer,
} from '@/lib/api/containers'
import type { Container } from '@/types/container'

export function useContainers() {
  const queryClient = useQueryClient()

  const { data: containers = [], isLoading } = useQuery({
    queryKey: ['containers'],
    queryFn: getContainers,
  })

  const startMutation = useMutation({
    mutationFn: startContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const stopMutation = useMutation({
    mutationFn: stopContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  return {
    containers,
    isLoading,
    startContainer: startMutation.mutateAsync,
    stopContainer: stopMutation.mutateAsync,
    deleteContainer: deleteMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
