'use client'

import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Header() {
    const path = usePathname()
    useEffect(() => {
        console.log(path)
    }, [path])

    return (
        <header className='sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80'>
            <div className='container flex h-16 max-w-screen-2xl items-center'>
                <div className='mr-4 flex flex-1'>
                    <Link href="/" className='mr-10 flex items-center space-x-2'>
                        {/* Adjusted margin-left for more space from the left edge */}
                        <span className="hidden font-bold sm:inline-block text-purple-400 text-xl ml-4">ShySpace</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/dashboard" className={`transition-colors hover:text-gray-300 ${path === '/dashboard' ? 'text-white' : 'text-gray-400'}`}>Dashboard</Link>
                        <Link href="/questions" className={`transition-colors hover:text-gray-300 ${path === '/questions' ? 'text-white' : 'text-gray-400'}`}>About Us</Link>
                        <Link href="/upgrade" className={`transition-colors hover:text-gray-300 ${path === '/upgrade' ? 'text-white' : 'text-gray-400'}`}>Upgrade</Link>
                        <Link href="/how-it-works" className={`transition-colors hover:text-gray-300 ${path === '/how-it-works' ? 'text-white' : 'text-gray-400'}`}>How it works?</Link>
                    </nav>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <div className="w-full md:w-auto">
                        <Button variant="outline" className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 bg-transparent shadow-sm hover:bg-gray-800 hover:text-gray-300 h-9 px-4 py-2 relative w-full justify-start text-sm text-gray-400 sm:pr-12 md:w-40 lg:w-64">
                            <span className="hidden lg:inline-flex">Coming Soon</span>
                            <span className="inline-flex lg:hidden">Coming Soon</span>
                            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                    </div>
                    <UserButton />
                </div>
            </div>
        </header>
    )
}

export default Header
