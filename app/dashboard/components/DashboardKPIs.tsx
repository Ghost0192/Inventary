'use client';

import { Users, Package, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardKPIsProps {
    usuarios: number;
    productosActivos: number;
    productosInactivos: number;
    totalIngresos: number;
    totalSalidas: number;
}

export default function DashboardKPIs({
    usuarios,
    productosActivos,
    productosInactivos,
    totalIngresos,
    totalSalidas,
}: DashboardKPIsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Usuarios Registrados */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 uppercase">Usuarios</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{usuarios}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Users size={24} className="text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Productos Activos */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 uppercase">Productos Activos</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{productosActivos}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Package size={24} className="text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Productos Inactivos */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 uppercase">Productos Inactivos</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{productosInactivos}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Package size={24} className="text-slate-600" />
                    </div>
                </div>
            </div>

            {/* Total Ingresos */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 uppercase">Registros Ingreso</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{totalIngresos}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <TrendingUp size={24} className="text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Total Salidas */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 uppercase">Registros Salida</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{totalSalidas}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                        <TrendingDown size={24} className="text-orange-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
