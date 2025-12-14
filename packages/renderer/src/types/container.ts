export type ContainerStatus = 'running' | 'stopped' | 'paused' | 'created' | 'exited'

export interface Container {
  id: string
  name: string
  status: ContainerStatus
  image: string
  imageId: string
  createdAt: string
  startedAt?: string
  ports?: Array<{
    containerPort: number
    hostPort?: number
    protocol: string
  }>
}
