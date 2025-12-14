import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Menu, Network, Package, Box, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center bg-blue-600 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Containerd Desktop
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white text-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-700"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 text-white',
            }}
          >
            <Home size={20} />
            <span className="font-medium">首页</span>
          </Link>

          <Link
            to="/images"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 text-white',
            }}
          >
            <Package size={20} />
            <span className="font-medium">镜像列表</span>
          </Link>

          <Link
            to="/containers"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 text-white',
            }}
          >
            <Box size={20} />
            <span className="font-medium">容器列表</span>
          </Link>

          <Link
            to="/mappings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 text-white',
            }}
          >
            <Network size={20} />
            <span className="font-medium">映射列表</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
