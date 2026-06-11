'use client';

import { useState } from 'react';
import {
    Search,
    Package,
    Pencil,
    ArrowUp,
    ArrowDown,
    Loader2,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Ingreso } from '@/hooks/useIngresos';
import { useProductos } from '@/hooks/useProductos';
import { BODEGA_INGRESOSALIDA } from '@/lib/constants';
import Drawer from '@/components/Drawer';
import IngresoEditForm from './IngresoEditForm';

interface Props {
    ingresos: Ingreso[];
    loading: boolean;
    onEditarIngreso?: (id: string, datos: Partial<Ingreso>) => Promise<void>;
}

type SortField = 'fecha_recepcion' | 'codigo_producto' | 'cantidad' | 'bodega' | null;
type SortOrder = 'asc' | 'desc';

export default function IngresosTable({ ingresos, loading, onEditarIngreso }: Props) {
    const { productos } = useProductos();
    const [busqueda, setBusqueda] = useState('');
    const [bodegaFilter, setBodegaFilter] = useState('');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [drawerAbierto, setDrawerAbierto] = useState(false);
    const [ingresoEditando, setIngresoEditando] = useState<Ingreso | null>(null);

    function obtenerNombreProducto(codigo: string): string {
        const producto = productos.find(p => p.codigo_producto === codigo);
        return producto?.nombre_prod || 'Producto';
    }

    let ingresosFiltrados = ingresos.filter((ingreso) => {
        const coincideBusqueda = ingreso.codigo_producto?.toLowerCase().includes(busqueda.toLowerCase());
        const coincideBodega = bodegaFilter === '' || ingreso.bodega === bodegaFilter;
        return coincideBusqueda && coincideBodega;
    });

    if (sortField) {
        ingresosFiltrados = [...ingresosFiltrados].sort((a, b) => {
            let aValue: any = '';
            let bValue: any = '';

            switch (sortField) {
                case 'codigo_producto':
                    aValue = a.codigo_producto || '';
                    bValue = b.codigo_producto || '';
                    break;
                case 'cantidad':
                    aValue = a.cantidad || 0;
                    bValue = b.cantidad || 0;
                    break;
                case 'fecha_recepcion':
                    aValue = a.fecha_recepcion || '';
                    bValue = b.fecha_recepcion || '';
                    break;
                case 'bodega':
                    aValue = a.bodega || '';
                    bValue = b.bodega || '';
                    break;
            }

            if (typeof aValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });
    }

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

    function abrirEditar(ingreso: Ingreso) {
        setIngresoEditando(ingreso);
        setDrawerAbierto(true);
    }

    function cerrarDrawer() {
        setDrawerAbierto(false);
        setIngresoEditando(null);
    }

    async function guardarEdicion(datos: Partial<Ingreso>) {
        if (ingresoEditando && onEditarIngreso) {
            await onEditarIngreso(ingresoEditando.id, datos);
        }
    }

    return (
        <div className="space-y-4">

            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">

                {/*Titulo*/}
                <h2 className="text-xl font-bold text-slate-800">Historial de ingresos</h2>

            </div>
            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código de producto..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] focus:bg-white transition-all text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase bg-slate-100/80 px-3 py-2.5 rounded-xl border border-slate-200/50">
                            <SlidersHorizontal size={14} />
                            <span>Filtros</span>
                        </div>

                        <select
                            value={bodegaFilter}
                            onChange={(e) => setBodegaFilter(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933]"
                        >
                            <option value="">Todas las bodegas</option>
                            {BODEGA_INGRESOSALIDA.map((bodega) => (
                                <option key={bodega} value={bodega}>{bodega}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
                        <Loader2 className="h-7 w-7 animate-spin text-[#2A7933]" />
                        <p className="text-sm font-medium">Cargando ingresos...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/70 border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3.5">
                                        <button
                                            onClick={() => toggleSort('fecha_recepcion')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Fecha Recepción
                                            {renderSortIcon('fecha_recepcion')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5">
                                        <button
                                            onClick={() => toggleSort('codigo_producto')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Código
                                            {renderSortIcon('codigo_producto')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3.5">
                                        <button
                                            onClick={() => toggleSort('cantidad')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Cantidad
                                            {renderSortIcon('cantidad')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        Marca
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        Proveedor
                                    </th>
                                    <th className="px-6 py-3.5">
                                        <button
                                            onClick={() => toggleSort('bodega')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Bodega
                                            {renderSortIcon('bodega')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        F. Caducidad
                                    </th>
                                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {ingresosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-16 text-center text-slate-400">
                                            <Package size={36} className="mx-auto text-slate-300 mb-2.5" />
                                            <p className="text-sm font-medium">No se encontraron ingresos</p>
                                        </td>
                                    </tr>
                                ) : (
                                    (() => {
                                        const totalPages = Math.ceil(ingresosFiltrados.length / itemsPerPage);
                                        const startIdx = (currentPage - 1) * itemsPerPage;
                                        const endIdx = startIdx + itemsPerPage;
                                        const ingresosActuales = ingresosFiltrados.slice(startIdx, endIdx);

                                        return ingresosActuales.map((ingreso) => (
                                            <tr key={ingreso.id} className="hover:bg-slate-50/40">
                                                <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                                                    {(() => {
                                                        const date = new Date(ingreso.fecha_recepcion);
                                                        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                                                    })()}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-500 font-medium">
                                                    {ingreso.codigo_producto}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs group relative">
                                                    <div className="flex items-center gap-2">
                                                        <Package size={16} className="text-[#2A7933]" />
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-slate-900 line-clamp-2">{obtenerNombreProducto(ingreso.codigo_producto)}</div>
                                                            <div className="absolute left-0 top-full mt-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-normal z-50 hidden group-hover:block w-64 pointer-events-none">
                                                                {obtenerNombreProducto(ingreso.codigo_producto)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono font-medium text-slate-600">
                                                    {ingreso.cantidad.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {ingreso.marca || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {ingreso.proveedor || '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/40">
                                                        {ingreso.bodega || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {ingreso.fecha_caducidad
                                                        ? new Date(ingreso.fecha_caducidad).toLocaleDateString('es-CL')
                                                        : '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-1">
                                                        <button
                                                            onClick={() => abrirEditar(ingreso)}
                                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-amber-600"
                                                            title="Editar ingreso"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ));
                                    })()
                                )}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        {ingresosFiltrados.length > 0 && (
                            <div className="px-4 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/30">
                                <div className="text-sm text-slate-600">
                                    Mostrando <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, ingresosFiltrados.length)}</span> de <span className="font-semibold">{ingresosFiltrados.length}</span> ingresos
                                </div>

                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const totalPages = Math.ceil(ingresosFiltrados.length / itemsPerPage);
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
                )}
            </div>

            {/* Drawer de Edición */}
            <Drawer
                isOpen={drawerAbierto}
                onClose={cerrarDrawer}
                title="Editar Ingreso"
                description={ingresoEditando?.codigo_producto}
            >
                {ingresoEditando && (
                    <IngresoEditForm
                        ingreso={ingresoEditando}
                        onSave={guardarEdicion}
                        onClose={cerrarDrawer}
                    />
                )}
            </Drawer>
        </div>
    );
}
