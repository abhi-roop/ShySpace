'use client'
import { UserButton } from '@clerk/nextjs';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {
    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[])
return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <img src={'/logo.svg'} width={50} height={50} alt="Logo" />
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/questions' && 'text-primary font-bold'}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/how-it-works' && 'text-primary font-bold'}`}>How it works?</li>
        </ul>
        <UserButton />
    </div>
);
}

export default Header;
