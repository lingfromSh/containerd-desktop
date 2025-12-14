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
