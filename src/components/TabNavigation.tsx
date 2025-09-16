'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Tab {
  id: string
  label: string
  href: string
}

interface TabNavigationProps {
  activeTab?: string
}

const tabs: Tab[] = [
  { id: 'job', label: '직무', href: '/job' },
  { id: 'research', label: '연구', href: '/research' },
  { id: 'industry', label: '산업', href: '/industry' }
]

export default function TabNavigation({ activeTab = 'job' }: TabNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`py-4 px-2 text-lg font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}












