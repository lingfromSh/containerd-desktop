export interface PortMapping {
  id: string
  containerId: string
  containerName?: string
  containerPort: number
  hostPort: number
  protocol: 'tcp' | 'udp'
}

export interface VolumeMapping {
  id: string
  containerId: string
  containerName?: string
  containerPath: string
  hostPath: string
  readOnly: boolean
}

export interface NetworkMapping {
  id: string
  containerId: string
  containerName?: string
  networkName: string
  ipAddress?: string
  aliases?: string[]
}

export type Mapping = PortMapping | VolumeMapping | NetworkMapping
