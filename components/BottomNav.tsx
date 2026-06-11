'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Boxes,
    ArrowLeftRight,
    BarChart3,
    Users,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Productos',
        href: '/dashboard/productos',
        icon: Package,
    },
    {
        name: 'Ingresos',
        href: '/dashboard/ingresos',
        icon: TrendingUp,
    },
    {
        name: 'Salidas',
        href: '/dashboard/salidas',
        icon: TrendingDown,
    },
    {
        name: 'Reportes',
        href: '/dashboard/reportes',
        icon: BarChart3,
    },
    {
        name: 'Usuarios',
        href: '/dashboard/usuarios',
        icon: Users,
    },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50">
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                            isActive
                                ? 'text-[#2A7933] bg-green-50'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Icon size={24} />
                        <span className="text-xs font-medium">
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
