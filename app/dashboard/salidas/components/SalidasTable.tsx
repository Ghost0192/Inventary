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
import { Salida } from '@/hooks/useSalidas';
import { useProductos } from '@/hooks/useProductos';
import { SUCURSALES_SALIDA } from '@/lib/constants';
import Drawer from '@/components/Drawer';
import SalidaEditForm from './SalidaEditForm';

interface Props {
    salidas: Salida[];
    loading: boolean;
    onEditarSalida?: (id: string, datos: Partial<Salida>) => Promise<void>;
}

type SortField = 'codigo_producto' | 'cantidad' | 'fecha_salida' | 'sucursal_salida' | null;
type SortOrder = 'asc' | 'desc';

export default function SalidasTable({ salidas, loading, onEditarSalida }: Props) {
    const { productos } = useProductos();
    const [busqueda, setBusqueda] = useState('');
    const [sucursalFilter, setSucursalFilter] = useState('');
    const [semanaFilter, setSemanaFilter] = useState('');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [drawerAbierto, setDrawerAbierto] = useState(false);
    const [salidaEditando, setSalidaEditando] = useState<Salida | null>(null);

    function obtenerNombreProducto(codigo: string): string {
        const producto = productos.find(p => p.codigo_producto === codigo);
        return producto?.nombre_prod || 'Producto';
    }

    // Get unique weeks for filter dropdown
    const semanas = Array.from(new Set(salidas.map(s => s.numero_semana))).sort();

    let salidasFiltradas = salidas.filter((salida) => {
        const coincideBusqueda = salida.codigo_producto?.toLowerCase().includes(busqueda.toLowerCase());
        const coincideSucursal = sucursalFilter === '' || salida.sucursal_salida === sucursalFilter;
        const coincideSemana = semanaFilter === '' || salida.numero_semana === semanaFilter;
        return coincideBusqueda && coincideSucursal && coincideSemana;
    });

    if (sortField) {
        salidasFiltradas = [...salidasFiltradas].sort((a, b) => {
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
                case 'fecha_salida':
                    aValue = a.fecha_salida || '';
                    bValue = b.fecha_salida || '';
                    break;
                case 'sucursal_salida':
                    aValue = a.sucursal_salida || '';
                    bValue = b.sucursal_salida || '';
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

    function abrirEditar(salida: Salida) {
        setSalidaEditando(salida);
        setDrawerAbierto(true);
    }

    function cerrarDrawer() {
        setDrawerAbierto(false);
        setSalidaEditando(null);
    }

    async function guardarEdicion(datos: Partial<Salida>) {
        if (salidaEditando && onEditarSalida) {
            await onEditarSalida(salidaEditando.id, datos);
        }
    }

    return (
        <div className="space-y-4">

            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">

                {/*Titulo*/}
                <h2 className="text-xl font-bold text-slate-800">Historial de salidas</h2>

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
                            value={sucursalFilter}
                            onChange={(e) => setSucursalFilter(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933]"
                        >
                            <option value="">Todas las sucursales</option>
                            {SUCURSALES_SALIDA.map((suc) => (
                                <option key={suc} value={suc}>{suc}</option>
                            ))}
                        </select>

                        <select
                            value={semanaFilter}
                            onChange={(e) => setSemanaFilter(e.target.value)}
                            className="w-full sm:w-40 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933]"
                        >
                            <option value="">Todas las semanas</option>
                            {semanas.map((semana) => (
                                <option key={semana} value={semana}>{semana}</option>
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
                        <p className="text-sm font-medium">Cargando salidas...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full table-layout:fixed">
                            <thead className="bg-slate-50/70 border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th className="px-3 py-3">
                                        <button
                                            onClick={() => toggleSort('fecha_salida')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Fecha Salida
                                            {renderSortIcon('fecha_salida')}
                                        </button>
                                    </th>
                                    <th className="px-3 py-3">
                                        <button
                                            onClick={() => toggleSort('codigo_producto')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Código
                                            {renderSortIcon('codigo_producto')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        Semana
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        Producto
                                    </th>
                                    <th className="px-3 py-3">
                                        <button
                                            onClick={() => toggleSort('cantidad')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Cantidad
                                            {renderSortIcon('cantidad')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        Área Destino
                                    </th>
                                    <th className="px-3 py-3">
                                        <button
                                            onClick={() => toggleSort('sucursal_salida')}
                                            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase hover:text-slate-900"
                                        >
                                            Sucursal
                                            {renderSortIcon('sucursal_salida')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                                        N° Documento
                                    </th>
                                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {salidasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-3 py-16 text-center text-slate-400">
                                            <Package size={36} className="mx-auto text-slate-300 mb-2.5" />
                                            <p className="text-sm font-medium">No se encontraron salidas</p>
                                        </td>
                                    </tr>
                                ) : (
                                    (() => {
                                        const totalPages = Math.ceil(salidasFiltradas.length / itemsPerPage);
                                        const startIdx = (currentPage - 1) * itemsPerPage;
                                        const endIdx = startIdx + itemsPerPage;
                                        const salidasActuales = salidasFiltradas.slice(startIdx, endIdx);

                                        return salidasActuales.map((salida) => (
                                            <tr key={salida.id} className="hover:bg-slate-50/40">
                                                <td className="px-3 py-3 text-sm text-slate-600">
                                                    {(() => {
                                                        const date = new Date(salida.fecha_salida);
                                                        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                                                    })()}
                                                </td>
                                                <td className="px-3 py-3 font-mono text-xs text-slate-500 font-medium">
                                                    {salida.codigo_producto}
                                                </td>
                                                <td className="px-3 py-3 text-sm font-semibold text-[#2A7933]">
                                                    {salida.numero_semana}
                                                </td>
                                                <td className="px-3 py-3 max-w-xs group relative">
                                                    <div className="text-sm font-medium text-slate-900 line-clamp-2">{obtenerNombreProducto(salida.codigo_producto)}</div>
                                                    <div className="absolute left-0 top-full mt-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-normal z-50 hidden group-hover:block w-64 pointer-events-none">
                                                        {obtenerNombreProducto(salida.codigo_producto)}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-sm font-mono font-medium text-slate-600">
                                                    {salida.cantidad.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-3 text-sm text-slate-600">
                                                    {salida.area_destino || '—'}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/40">
                                                        {salida.sucursal_salida || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-sm text-slate-600">
                                                    {salida.numero_documento || '—'}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="flex justify-center items-center gap-1">
                                                        <button
                                                            onClick={() => abrirEditar(salida)}
                                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-amber-600"
                                                            title="Editar salida"
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
                        {salidasFiltradas.length > 0 && (
                            <div className="px-4 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/30">
                                <div className="text-sm text-slate-600">
                                    Mostrando <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, salidasFiltradas.length)}</span> de <span className="font-semibold">{salidasFiltradas.length}</span> salidas
                                </div>

                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const totalPages = Math.ceil(salidasFiltradas.length / itemsPerPage);
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
                title="Editar Salida"
                description={salidaEditando?.codigo_producto}
            >
                {salidaEditando && (
                    <SalidaEditForm
                        salida={salidaEditando}
                        onSave={guardarEdicion}
                        onClose={cerrarDrawer}
                    />
                )}
            </Drawer>
        </div>
    );
}
