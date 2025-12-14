import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getImages,
  deleteImage,
  batchDeleteImages,
  getImageDetails,
  pullImage,
  searchRemoteImages,
} from '@/lib/api/images'
import type { Image, ImageDetails, RemoteImage } from '@/types/image'

export function useImages(searchTerm?: string) {
  const queryClient = useQueryClient()

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['images', searchTerm],
    queryFn: () => getImages(searchTerm),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] })
    },
  })

  const batchDeleteMutation = useMutation({
    mutationFn: batchDeleteImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] })
    },
  })

  const getDetailsMutation = useMutation({
    mutationFn: getImageDetails,
  })

  const pullMutation = useMutation({
    mutationFn: ({ imageName, tag, registry }: { imageName: string; tag?: string; registry?: string }) =>
      pullImage(imageName, tag, registry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] })
    },
  })

  return {
    images,
    isLoading,
    deleteImage: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    batchDeleteImages: batchDeleteMutation.mutateAsync,
    isBatchDeleting: batchDeleteMutation.isPending,
    getImageDetails: getDetailsMutation.mutateAsync,
    isGettingDetails: getDetailsMutation.isPending,
    pullImage: pullMutation.mutateAsync,
    isPulling: pullMutation.isPending,
    searchRemoteImages,
  }
}
