export interface RegistryConfig {
  id: string
  name: string
  url: string
  isDefault: boolean
  credentials?: {
    username?: string
    password?: string
  }
}

export interface Image {
  id: string
  name: string
  tag: string
  size: number // bytes
  createdAt: string
  registry?: string
  digest?: string
}

export interface ImageDetails extends Image {
  architecture?: string
  os?: string
  author?: string
  description?: string
  layers?: string[]
  env?: Record<string, string>
  exposedPorts?: number[]
  volumes?: string[]
  workingDir?: string
  entrypoint?: string[]
  cmd?: string[]
  labels?: Record<string, string>
}

export interface RemoteImage {
  name: string
  tag: string
  registry: string
  description?: string
  size?: number
  pullCount?: number
  lastUpdated?: string
  isOfficial?: boolean
}
