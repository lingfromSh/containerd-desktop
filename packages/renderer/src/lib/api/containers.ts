import type { Container, ContainerStatus } from '@/types/container'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock containers data
const mockContainers: Container[] = [
  {
    id: 'container-1',
    name: 'web-server',
    status: 'running',
    image: 'nginx:latest',
    imageId: 'img-1',
    createdAt: '2024-01-15T10:30:00Z',
    startedAt: '2024-01-15T10:31:00Z',
    ports: [
      { containerPort: 80, hostPort: 8080, protocol: 'tcp' },
      { containerPort: 443, hostPort: 8443, protocol: 'tcp' },
    ],
  },
  {
    id: 'container-2',
    name: 'redis-cache',
    status: 'stopped',
    image: 'redis:7-alpine',
    imageId: 'img-2',
    createdAt: '2024-01-14T15:20:00Z',
    ports: [{ containerPort: 6379, hostPort: 6379, protocol: 'tcp' }],
  },
  {
    id: 'container-3',
    name: 'db-postgres',
    status: 'running',
    image: 'postgres:15',
    imageId: 'img-3',
    createdAt: '2024-01-13T09:10:00Z',
    startedAt: '2024-01-13T09:11:00Z',
    ports: [{ containerPort: 5432, hostPort: 5432, protocol: 'tcp' }],
  },
]

export async function getContainers(): Promise<Container[]> {
  await delay(500)
  return mockContainers
}

export async function startContainer(containerId: string): Promise<Container> {
  await delay(1000)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }
  container.status = 'running'
  container.startedAt = new Date().toISOString()
  return container
}

export async function stopContainer(containerId: string): Promise<Container> {
  await delay(800)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }
  container.status = 'stopped'
  delete container.startedAt
  return container
}

export async function deleteContainer(containerId: string): Promise<void> {
  await delay(600)
  const index = mockContainers.findIndex((c) => c.id === containerId)
  if (index > -1) {
    mockContainers.splice(index, 1)
  }
}
