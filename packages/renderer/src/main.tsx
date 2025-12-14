import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import HomePage from './routes/index.tsx'
import ImagesPage from './routes/images.tsx'
import ContainersPage from './routes/containers.tsx'
import MappingsPage from './routes/mappings.tsx'

import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

const SIDEBAR_WIDTH = 260

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          paddingTop: '64px',
        }}
      >
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}

const rootRoute = createRootRoute({
  component: Layout,
})

const routeTree = rootRoute.addChildren([
  HomePage(rootRoute),
  ImagesPage(rootRoute),
  ContainersPage(rootRoute),
  MappingsPage(rootRoute),
])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
