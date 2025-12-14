import type { Image, RegistryConfig } from '@/types/image'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Default Flexiv Harbor registry
const DEFAULT_REGISTRY: RegistryConfig = {
  id: 'flexiv-harbor',
  name: 'Flexiv Harbor',
  url: 'harbor.flexiv.com',
  isDefault: true,
}

// Mock images data
const mockImages: Image[] = [
  {
    id: 'img-1',
    name: 'nginx',
    tag: 'latest',
    size: 133700000,
    createdAt: '2024-01-15T10:30:00Z',
    registry: 'harbor.flexiv.com',
    digest: 'sha256:abc123',
  },
  {
    id: 'img-2',
    name: 'redis',
    tag: '7-alpine',
    size: 45600000,
    createdAt: '2024-01-14T15:20:00Z',
    registry: 'harbor.flexiv.com',
    digest: 'sha256:def456',
  },
  {
    id: 'img-3',
    name: 'postgres',
    tag: '15',
    size: 234500000,
    createdAt: '2024-01-13T09:10:00Z',
    registry: 'docker.io',
    digest: 'sha256:ghi789',
  },
  {
    id: 'img-4',
    name: 'node',
    tag: '20-slim',
    size: 178900000,
    createdAt: '2024-01-12T14:45:00Z',
    registry: 'docker.io',
    digest: 'sha256:jkl012',
  },
  {
    id: 'img-5',
    name: 'ubuntu',
    tag: '22.04',
    size: 78900000,
    createdAt: '2024-01-11T11:00:00Z',
    registry: 'harbor.flexiv.com',
    digest: 'sha256:mno345',
  },
]

// Registry configs storage key
const REGISTRY_STORAGE_KEY = 'containerd-desktop-registry-configs'

// Get registry configs from localStorage or return default
function getStoredRegistryConfigs(): RegistryConfig[] {
  try {
    const stored = localStorage.getItem(REGISTRY_STORAGE_KEY)
    if (stored) {
      const configs = JSON.parse(stored) as RegistryConfig[]
      // Ensure default registry exists
      const hasDefault = configs.some((c) => c.id === DEFAULT_REGISTRY.id)
      if (!hasDefault) {
        return [DEFAULT_REGISTRY, ...configs]
      }
      return configs
    }
    return [DEFAULT_REGISTRY]
  } catch {
    return [DEFAULT_REGISTRY]
  }
}

// Save registry configs to localStorage
function saveRegistryConfigsToStorage(configs: RegistryConfig[]): void {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(configs))
  } catch (error) {
    console.error('Failed to save registry configs:', error)
  }
}

export async function getImages(searchTerm?: string): Promise<Image[]> {
  await delay(500)

  if (!searchTerm) {
    return mockImages
  }

  const lowerSearch = searchTerm.toLowerCase()
  return mockImages.filter(
    (img) =>
      img.name.toLowerCase().includes(lowerSearch) ||
      img.tag.toLowerCase().includes(lowerSearch) ||
      img.registry?.toLowerCase().includes(lowerSearch),
  )
}

export async function deleteImage(imageId: string): Promise<void> {
  await delay(800)
  // Mock: image would be deleted
  const index = mockImages.findIndex((img) => img.id === imageId)
  if (index > -1) {
    mockImages.splice(index, 1)
  }
}

export async function getRegistryConfigs(): Promise<RegistryConfig[]> {
  await delay(300)
  return getStoredRegistryConfigs()
}

export async function saveRegistryConfig(
  config: Omit<RegistryConfig, 'id'> | RegistryConfig,
): Promise<RegistryConfig> {
  await delay(400)
  const configs = getStoredRegistryConfigs()

  // If it's an update (has id), update existing
  if ('id' in config && config.id) {
    const index = configs.findIndex((c) => c.id === config.id)
    if (index > -1) {
      configs[index] = config as RegistryConfig
    } else {
      configs.push(config as RegistryConfig)
    }
  } else {
    // New config
    const newConfig: RegistryConfig = {
      ...config,
      id: `registry-${Date.now()}`,
    } as RegistryConfig
    configs.push(newConfig)
  }

  // If this is set as default, unset others
  if (config.isDefault) {
    configs.forEach((c) => {
      if (c.id !== (config as RegistryConfig).id) {
        c.isDefault = false
      }
    })
  }

  saveRegistryConfigsToStorage(configs)
  return configs.find((c) => c.id === (config as RegistryConfig).id) || (config as RegistryConfig)
}

export async function deleteRegistryConfig(configId: string): Promise<void> {
  await delay(400)
  // Don't allow deleting the default Flexiv Harbor registry
  if (configId === DEFAULT_REGISTRY.id) {
    throw new Error('Cannot delete default Flexiv Harbor registry')
  }

  const configs = getStoredRegistryConfigs()
  const index = configs.findIndex((c) => c.id === configId)
  if (index > -1) {
    configs.splice(index, 1)
    saveRegistryConfigsToStorage(configs)
  }
}
