import type { PortMapping, VolumeMapping, NetworkMapping } from '@/types/mapping'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock mappings data
const mockPortMappings: PortMapping[] = [
  {
    id: 'port-1',
    containerId: 'container-1',
    containerName: 'web-server',
    containerPort: 80,
    hostPort: 8080,
    protocol: 'tcp',
  },
  {
    id: 'port-2',
    containerId: 'container-1',
    containerName: 'web-server',
    containerPort: 443,
    hostPort: 8443,
    protocol: 'tcp',
  },
]

const mockVolumeMappings: VolumeMapping[] = [
  {
    id: 'volume-1',
    containerId: 'container-3',
    containerName: 'db-postgres',
    containerPath: '/var/lib/postgresql/data',
    hostPath: '/data/postgres',
    readOnly: false,
  },
]

const mockNetworkMappings: NetworkMapping[] = [
  {
    id: 'network-1',
    containerId: 'container-1',
    containerName: 'web-server',
    networkName: 'bridge',
    ipAddress: '172.17.0.2',
    aliases: ['web'],
  },
]

export async function getPortMappings(): Promise<PortMapping[]> {
  await delay(300)
  return mockPortMappings
}

export async function getVolumeMappings(): Promise<VolumeMapping[]> {
  await delay(300)
  return mockVolumeMappings
}

export async function getNetworkMappings(): Promise<NetworkMapping[]> {
  await delay(300)
  return mockNetworkMappings
}

export async function createPortMapping(
  mapping: Omit<PortMapping, 'id'>,
): Promise<PortMapping> {
  await delay(500)
  const newMapping: PortMapping = {
    ...mapping,
    id: `port-${Date.now()}`,
  }
  mockPortMappings.push(newMapping)
  return newMapping
}

export async function createVolumeMapping(
  mapping: Omit<VolumeMapping, 'id'>,
): Promise<VolumeMapping> {
  await delay(500)
  const newMapping: VolumeMapping = {
    ...mapping,
    id: `volume-${Date.now()}`,
  }
  mockVolumeMappings.push(newMapping)
  return newMapping
}

export async function createNetworkMapping(
  mapping: Omit<NetworkMapping, 'id'>,
): Promise<NetworkMapping> {
  await delay(500)
  const newMapping: NetworkMapping = {
    ...mapping,
    id: `network-${Date.now()}`,
  }
  mockNetworkMappings.push(newMapping)
  return newMapping
}

export async function deletePortMapping(mappingId: string): Promise<void> {
  await delay(400)
  const index = mockPortMappings.findIndex((m) => m.id === mappingId)
  if (index > -1) {
    mockPortMappings.splice(index, 1)
  }
}

export async function deleteVolumeMapping(mappingId: string): Promise<void> {
  await delay(400)
  const index = mockVolumeMappings.findIndex((m) => m.id === mappingId)
  if (index > -1) {
    mockVolumeMappings.splice(index, 1)
  }
}

export async function deleteNetworkMapping(mappingId: string): Promise<void> {
  await delay(400)
  const index = mockNetworkMappings.findIndex((m) => m.id === mappingId)
  if (index > -1) {
    mockNetworkMappings.splice(index, 1)
  }
}

export async function batchDeletePortMappings(mappingIds: string[]): Promise<void> {
  await delay(400)
  mappingIds.forEach((mappingId) => {
    const index = mockPortMappings.findIndex((m) => m.id === mappingId)
    if (index > -1) {
      mockPortMappings.splice(index, 1)
    }
  })
}

export async function batchDeleteVolumeMappings(mappingIds: string[]): Promise<void> {
  await delay(400)
  mappingIds.forEach((mappingId) => {
    const index = mockVolumeMappings.findIndex((m) => m.id === mappingId)
    if (index > -1) {
      mockVolumeMappings.splice(index, 1)
    }
  })
}

export async function batchDeleteNetworkMappings(mappingIds: string[]): Promise<void> {
  await delay(400)
  mappingIds.forEach((mappingId) => {
    const index = mockNetworkMappings.findIndex((m) => m.id === mappingId)
    if (index > -1) {
      mockNetworkMappings.splice(index, 1)
    }
  })
}
