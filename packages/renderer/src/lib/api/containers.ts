import type {
  Container,
  ContainerStatus,
  ContainerDetails,
  ContainerLogs,
} from '@/types/container'

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

export async function restartContainer(containerId: string): Promise<Container> {
  await delay(1200)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }
  // 先停止再启动
  container.status = 'stopped'
  await delay(300)
  container.status = 'running'
  container.startedAt = new Date().toISOString()
  return container
}

export async function pauseContainer(containerId: string): Promise<Container> {
  await delay(500)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }
  if (container.status !== 'running') {
    throw new Error('Container must be running to pause')
  }
  container.status = 'paused'
  return container
}

export async function resumeContainer(containerId: string): Promise<Container> {
  await delay(500)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }
  if (container.status !== 'paused') {
    throw new Error('Container must be paused to resume')
  }
  container.status = 'running'
  if (!container.startedAt) {
    container.startedAt = new Date().toISOString()
  }
  return container
}

export async function getContainerLogs(
  containerId: string,
  tail: number = 100,
): Promise<ContainerLogs> {
  await delay(300)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }

  // 生成模拟日志
  const logs: string[] = []
  for (let i = 0; i < Math.min(tail, 50); i++) {
    const timestamp = new Date(Date.now() - (tail - i) * 1000).toISOString()
    logs.push(
      `${timestamp} [INFO] Container ${container.name} log entry ${i + 1}`,
    )
  }

  return {
    logs,
    timestamp: new Date().toISOString(),
  }
}

export async function execContainer(
  containerId: string,
  command: string,
): Promise<{ output: string; exitCode: number }> {
  await delay(500)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }
  if (container.status !== 'running') {
    throw new Error('Container must be running to execute commands')
  }

  // 模拟命令执行结果
  return {
    output: `执行命令: ${command}\n容器: ${container.name}\n输出: 命令执行成功\n`,
    exitCode: 0,
  }
}

export async function getContainerDetails(
  containerId: string,
): Promise<ContainerDetails> {
  await delay(400)
  const container = mockContainers.find((c) => c.id === containerId)
  if (!container) {
    throw new Error('Container not found')
  }

  // 扩展容器信息为详情
  const details: ContainerDetails = {
    ...container,
    command: ['/bin/sh', '-c', 'nginx -g "daemon off;"'],
    workingDir: '/usr/share/nginx/html',
    environment: {
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      NGINX_VERSION: '1.25.0',
      NJS_VERSION: '0.8.0',
    },
    mounts: [
      {
        source: '/host/data',
        destination: '/var/www/html',
        type: 'bind',
        readOnly: false,
      },
    ],
    networkSettings: {
      networks: {
        bridge: {
          ipAddress: '172.17.0.2',
          gateway: '172.17.0.1',
          macAddress: '02:42:ac:11:00:02',
        },
      },
    },
    resources: {
      cpuUsage: container.status === 'running' ? 15.5 : 0,
      memoryUsage: container.status === 'running' ? 52428800 : 0, // 50MB
      memoryLimit: 1073741824, // 1GB
      networkIn: container.status === 'running' ? 1024000 : 0,
      networkOut: container.status === 'running' ? 512000 : 0,
      diskRead: container.status === 'running' ? 2048000 : 0,
      diskWrite: container.status === 'running' ? 1024000 : 0,
    },
    restartPolicy: 'unless-stopped',
    hostname: container.name,
    user: 'root',
  }

  return details
}

export interface CreateContainerOptions {
  name: string
  image: string
  imageId: string
  ports?: Array<{
    containerPort: number
    hostPort?: number
    protocol: string
  }>
  environment?: Record<string, string>
  command?: string[]
  workingDir?: string
  restartPolicy?: string
}

export async function createContainer(
  options: CreateContainerOptions,
): Promise<Container> {
  await delay(1500)
  const newContainer: Container = {
    id: `container-${Date.now()}`,
    name: options.name,
    status: 'created',
    image: options.image,
    imageId: options.imageId,
    createdAt: new Date().toISOString(),
    ports: options.ports,
  }
  mockContainers.push(newContainer)
  return newContainer
}

export async function batchStartContainers(
  containerIds: string[],
): Promise<Container[]> {
  await delay(1000)
  const results: Container[] = []
  for (const id of containerIds) {
    const container = mockContainers.find((c) => c.id === id)
    if (container && (container.status === 'stopped' || container.status === 'exited' || container.status === 'created' || container.status === 'paused')) {
      container.status = 'running'
      container.startedAt = new Date().toISOString()
      results.push(container)
    }
  }
  return results
}

export async function batchStopContainers(
  containerIds: string[],
): Promise<Container[]> {
  await delay(1000)
  const results: Container[] = []
  for (const id of containerIds) {
    const container = mockContainers.find((c) => c.id === id)
    if (container && container.status === 'running') {
      container.status = 'stopped'
      delete container.startedAt
      results.push(container)
    }
  }
  return results
}

export async function batchDeleteContainers(
  containerIds: string[],
): Promise<void> {
  await delay(800)
  for (const id of containerIds) {
    const index = mockContainers.findIndex((c) => c.id === id)
    if (index > -1) {
      mockContainers.splice(index, 1)
    }
  }
}
