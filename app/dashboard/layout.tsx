'use client';

import { useRouter } from 'next/navigation';

import {
    LayoutDashboard,
    Package,
    Boxes,
    ArrowLeftRight,
    BarChart3,
    Users,
    LogOut,
    Loader2,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import NavItem from '@/components/NavItem';
import BottomNav from '@/components/BottomNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const { usuario, loading } = useAuth();

    async function cerrarSesion() {
        await supabase.auth.signOut();
        router.push('/login');
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#2A7933]" />
                <p className="text-sm font-medium text-slate-500">
                    Cargando StockFlow...
                </p>
            </div>
        );
    }

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
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#F5FFFA] to-[#E8F5F0]">

            {/* Sidebar - Fixed overlay */}
            <aside className="fixed left-0 top-0 h-screen w-20 hover:w-72 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex transition-all duration-300 ease-in-out group z-40">

                <div className="flex flex-col flex-1">

                    {/* Logo */}
                    <div className="h-20 flex flex-col justify-center px-3 group-hover:px-6 border-b border-slate-100 transition-all duration-300">

                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-[#2A7933] rounded-lg text-white flex-shrink-0">
                                <Boxes size={22} />
                            </div>

                            <span className="text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                StockFlow
                            </span>
                        </div>

                        <p className="text-xs font-medium text-slate-400 mt-0.5 pl-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Inventario Empresarial
                        </p>

                    </div>

                    {/* Menú */}
                    <nav className="flex-1 p-4 space-y-1">

                        {navigation.map((item) => (
                            <NavItem
                                key={item.name}
                                href={item.href}
                                icon={item.icon}
                            >
                                {item.name}
                            </NavItem>
                        ))}

                        {usuario?.rol === 'admin' && (
                            <NavItem
                                href="/dashboard/usuarios"
                                icon={Users}
                            >
                                Usuarios
                            </NavItem>
                        )}

                    </nav>

                </div>

                {/* Usuario */}
                <div className="border-t border-slate-100 p-3 group-hover:p-4 bg-slate-50/50 transition-all duration-300">

                    <div className="flex items-center gap-3 px-2 py-3 mb-3 rounded-xl">

                        <div className="h-10 w-10 rounded-full bg-[#2A7933] border border-[#2A7933] flex items-center justify-center font-semibold text-white text-sm uppercase flex-shrink-0">
                            {usuario?.nombre?.[0]}
                            {usuario?.apellido?.[0]}
                        </div>

                        <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                            <p className="text-sm font-semibold text-slate-800 truncate">
                                {usuario?.nombre} {usuario?.apellido}
                            </p>

                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2A7933]/10 text-[#2A7933] capitalize">
                                {usuario?.rol}
                            </span>

                        </div>

                    </div>

                    <button
                        onClick={cerrarSesion}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            group-hover:px-4
                            py-2.5
                            rounded-xl
                            text-sm
                            font-medium
                            text-red-600
                            hover:bg-red-50
                            hover:text-red-700
                            transition-all
                            duration-300
                        "
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Cerrar sesión
                        </span>
                    </button>

                </div>

            </aside>

            {/* Contenido */}
            <main className="w-full px-2 py-4 md:px-4 md:py-8 min-h-screen overflow-y-auto pb-20 md:pb-8">
                <div className="max-w-10/12 mx-auto">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation (Mobile only) */}
            <BottomNav />

        </div>
    );
}