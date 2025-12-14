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

export interface ContainerDetails extends Container {
  command?: string[]
  workingDir?: string
  environment?: Record<string, string>
  mounts?: Array<{
    source: string
    destination: string
    type: string
    readOnly?: boolean
  }>
  networkSettings?: {
    networks?: Record<string, {
      ipAddress?: string
      gateway?: string
      macAddress?: string
    }>
  }
  resources?: {
    cpuUsage?: number
    memoryUsage?: number
    memoryLimit?: number
    networkIn?: number
    networkOut?: number
    diskRead?: number
    diskWrite?: number
  }
  restartPolicy?: string
  hostname?: string
  domainname?: string
  user?: string
}

export interface ContainerLogs {
  logs: string[]
  timestamp: string
}
