import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getImages, deleteImage } from '@/lib/api/images'
import type { Image } from '@/types/image'

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

  return {
    images,
    isLoading,
    deleteImage: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
