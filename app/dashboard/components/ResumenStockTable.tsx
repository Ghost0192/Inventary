'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResumenProducto {
    id: string;
    codigo_producto: string;
    nombre_prod: string;
    stock_minimo: number;
    total_ingresos: number;
    total_salidas: number;
    stock_actual: number;
    estado: 'critico' | 'atencion' | 'optimo';
}

interface ResumenStockTableProps {
    resumen: ResumenProducto[];
}

type SortField = keyof ResumenProducto | null;
type SortOrder = 'asc' | 'desc';

export default function ResumenStockTable({ resumen }: ResumenStockTableProps) {
    const [busqueda, setBusqueda] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'critico':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'atencion':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'optimo':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'critico':
                return <AlertCircle size={16} />;
            case 'atencion':
                return <AlertTriangle size={16} />;
            case 'optimo':
                return <CheckCircle size={16} />;
            default:
                return null;
        }
    };

    function toggleSort(field: SortField) {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    }

    function renderSortIcon(field: SortField) {
        if (sortField !== field) return <ArrowUp size={14} className="opacity-30" />;
        return sortOrder === 'asc' ? (
            <ArrowUp size={14} className="text-[#2A7933]" />
        ) : (
            <ArrowDown size={14} className="text-[#2A7933]" />
        );
    }

    let resumenFiltrado = resumen.filter((item) => {
        const coincideBusqueda =
            item.codigo_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.nombre_prod.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado = estadoFilter === '' || item.estado === estadoFilter;
        return coincideBusqueda && coincideEstado;
    });

    if (sortField) {
        resumenFiltrado = [...resumenFiltrado].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue as string)
                    : (bValue as string).localeCompare(aValue);
            } else {
                return sortOrder === 'asc'
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });
    }

    const totalPages = Math.ceil(resumenFiltrado.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const resumenActual = resumenFiltrado.slice(startIdx, endIdx);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Resumen de Stock por Producto</h2>

                {/* Filtros */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código o producto..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] focus:bg-white transition-all text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase bg-slate-100/80 px-3 py-2.5 rounded-lg border border-slate-200/50">
                            <SlidersHorizontal size={14} />
                            <span>Filtros</span>
                        </div>

                        <select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933]"
                        >
                            <option value="">Todos los estados</option>
                            <option value="critico">Crítico</option>
                            <option value="atencion">Atención</option>
                            <option value="optimo">Óptimo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                    <thead className="bg-slate-50/70 border-b border-slate-200 sticky top-0">
                        <tr>
                            <th className="px-3 py-3">
                                <button
                                    onClick={() => toggleSort('codigo_producto')}
                                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                >
                                    Código
                                    {renderSortIcon('codigo_producto')}
                                </button>
                            </th>
                            <th className="px-3 py-3">
                                <button
                                    onClick={() => toggleSort('nombre_prod')}
                                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                >
                                    Producto
                                    {renderSortIcon('nombre_prod')}
                                </button>
                            </th>
                            <th className="px-3 py-3">
                                <button
                                    onClick={() => toggleSort('stock_minimo')}
                                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900 justify-end"
                                >
                                    Stock Mín.
                                    {renderSortIcon('stock_minimo')}
                                </button>
                            </th>
                            <th className="px-3 py-3">
                                <button
                                    onClick={() => toggleSort('total_ingresos')}
                                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900 justify-end ml-auto"
                                >
                                    Ingresos
                                    {renderSortIcon('total_ingresos')}
                                </button>
                            </th>
                            <th className="px-3 py-3">
                                <button
                                    onClick={() => toggleSort('total_salidas')}
                                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900 justify-end ml-auto"
                                >
                                    Salidas
                                    {renderSortIcon('total_salidas')}
                                </button>
                            </th>
                            <th className="px-3 py-3">
                                <button
                                    onClick={() => toggleSort('stock_actual')}
                                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900 justify-end ml-auto"
                                >
                                    Stock Actual
                                    {renderSortIcon('stock_actual')}
                                </button>
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {resumenFiltrado.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                    {resumen.length === 0 ? 'No hay productos registrados' : 'No hay productos que coincidan con los filtros'}
                                </td>
                            </tr>
                        ) : (
                            resumenActual.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/40">
                                    <td className="px-3 py-3 text-sm font-mono text-slate-600">{item.codigo_producto}</td>
                                    <td className="px-3 py-3 text-sm font-medium text-slate-900 max-w-xs group relative">
                                        <div className="line-clamp-2">{item.nombre_prod}</div>
                                        <div className="absolute left-0 top-full mt-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-normal z-50 hidden group-hover:block w-64 pointer-events-none">
                                            {item.nombre_prod}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-slate-600 text-right">{item.stock_minimo.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm font-mono text-emerald-600 text-right">{item.total_ingresos.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm font-mono text-orange-600 text-right">{item.total_salidas.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm font-bold text-slate-900 text-right">{item.stock_actual.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-center">
                                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(item.estado)}`}>
                                            {getEstadoIcon(item.estado)}
                                            <span className="capitalize">
                                                {item.estado === 'critico' && 'Crítico'}
                                                {item.estado === 'atencion' && 'Atención'}
                                                {item.estado === 'optimo' && 'Óptimo'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {resumenFiltrado.length > 0 && (
                <div className="px-4 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/30">
                    <div className="text-sm text-slate-600">
                        Mostrando <span className="font-semibold">{startIdx + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, resumenFiltrado.length)}</span> de <span className="font-semibold">{resumenFiltrado.length}</span> productos
                    </div>

                    <div className="flex items-center gap-3">
                        {(() => {
                            return (
                                <>
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                                        title="Página anterior"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <span className="text-sm text-slate-600 font-medium whitespace-nowrap">
                                        Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                                        title="Página siguiente"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
