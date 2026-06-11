'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

export default function NavItem({
    href,
    icon: Icon,
    children,
}: NavItemProps) {
    const pathname = usePathname();

    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3
                px-3 group-hover:px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all duration-300
                flex-shrink-0
                ${
                    isActive
                        ? 'bg-[#2A7933]/10 text-[#2A7933]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
            `}
        >
            <Icon
                size={20}
                className={`flex-shrink-0 ${
                    isActive
                        ? 'text-[#2A7933]'
                        : 'text-slate-400'
                }`}
            />

            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {children}
            </span>
        </Link>
    );
}
