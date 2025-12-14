import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getContainers,
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
  type CreateContainerOptions,
} from '@/lib/api/containers'
import type { Container, ContainerDetails, ContainerLogs } from '@/types/container'

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

  const restartMutation = useMutation({
    mutationFn: restartContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const pauseMutation = useMutation({
    mutationFn: pauseContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const resumeMutation = useMutation({
    mutationFn: resumeContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const getLogsMutation = useMutation({
    mutationFn: ({ containerId, tail }: { containerId: string; tail?: number }) =>
      getContainerLogs(containerId, tail),
  })

  const execMutation = useMutation({
    mutationFn: ({ containerId, command }: { containerId: string; command: string }) =>
      execContainer(containerId, command),
  })

  const getDetailsMutation = useMutation({
    mutationFn: getContainerDetails,
  })

  const createMutation = useMutation({
    mutationFn: createContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const batchStartMutation = useMutation({
    mutationFn: batchStartContainers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const batchStopMutation = useMutation({
    mutationFn: batchStopContainers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
    },
  })

  const batchDeleteMutation = useMutation({
    mutationFn: batchDeleteContainers,
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
    restartContainer: restartMutation.mutateAsync,
    pauseContainer: pauseMutation.mutateAsync,
    resumeContainer: resumeMutation.mutateAsync,
    getContainerLogs: getLogsMutation.mutateAsync,
    execContainer: execMutation.mutateAsync,
    getContainerDetails: getDetailsMutation.mutateAsync,
    createContainer: createMutation.mutateAsync,
    batchStartContainers: batchStartMutation.mutateAsync,
    batchStopContainers: batchStopMutation.mutateAsync,
    batchDeleteContainers: batchDeleteMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRestarting: restartMutation.isPending,
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
    isGettingLogs: getLogsMutation.isPending,
    isExecuting: execMutation.isPending,
    isGettingDetails: getDetailsMutation.isPending,
    isCreating: createMutation.isPending,
    isBatchStarting: batchStartMutation.isPending,
    isBatchStopping: batchStopMutation.isPending,
    isBatchDeleting: batchDeleteMutation.isPending,
  }
}
