'use client';

import { useState } from 'react';

import {
    Search,
    Package,
    Pencil,
    QrCode,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { Producto } from '@/hooks/useProductos';
import { CATEGORIAS } from '@/lib/constants';
import Drawer from '@/components/Drawer';
import ProductoEditForm from './ProductoEditForm';

interface Props {
    productos: Producto[];
    loading: boolean;
    onEditarProducto?: (id: string, datos: Partial<Producto>) => Promise<void>;
}

type SortField = 'codigo' | 'nombre' | 'categoria' | 'stock_minimo' | 'estatus' | null;
type SortOrder = 'asc' | 'desc';

export default function ProductosTable({
    productos,
    loading,
    onEditarProducto,
}: Props) {
    const [busqueda, setBusqueda] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [estatusFilter, setEstatusFilter] = useState('');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [drawerAbierto, setDrawerAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

    // Filtrar productos
    let productosFiltrados = productos.filter((producto) => {
        const coincideBusqueda =
            producto.nombre_prod?.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.codigo_producto?.toLowerCase().includes(busqueda.toLowerCase());

        const coincideCategoria =
            categoriaFilter === '' || producto.categoria === categoriaFilter;

        const coincideEstatus =
            estatusFilter === '' ||
            (estatusFilter === 'activo' && producto.activo) ||
            (estatusFilter === 'inactivo' && !producto.activo);

        return coincideBusqueda && coincideCategoria && coincideEstatus;
    });

    // Ordenar productos
    if (sortField) {
        productosFiltrados = [...productosFiltrados].sort((a, b) => {
            let aValue: any = '';
            let bValue: any = '';

            switch (sortField) {
                case 'codigo':
                    aValue = a.codigo_producto || '';
                    bValue = b.codigo_producto || '';
                    break;
                case 'nombre':
                    aValue = a.nombre_prod || '';
                    bValue = b.nombre_prod || '';
                    break;
                case 'categoria':
                    aValue = a.categoria || '';
                    bValue = b.categoria || '';
                    break;
                case 'stock_minimo':
                    aValue = a.stock_minimo || 0;
                    bValue = b.stock_minimo || 0;
                    break;
                case 'estatus':
                    aValue = a.activo ? 1 : 0;
                    bValue = b.activo ? 1 : 0;
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

    function abrirEditar(producto: Producto) {
        setProductoEditando(producto);
        setDrawerAbierto(true);
    }

    function cerrarDrawer() {
        setDrawerAbierto(false);
        setProductoEditando(null);
    }

    async function guardarEdicion(datos: Partial<Producto>) {
        if (productoEditando && onEditarProducto) {
            await onEditarProducto(productoEditando.id, datos);
        }
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">

                {/*Titulo*/}
                <h2 className="text-xl font-bold text-slate-800">Historial de productos</h2>

            </div>
            {/* Controles de Filtro y Búsqueda */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
                {/* Búsqueda */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Buscar por Código o Producto
                    </label>
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Ej: PROD-123 o Computador..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                            Categoría
                        </label>
                        <select
                            value={categoriaFilter}
                            onChange={(e) => setCategoriaFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm"
                        >
                            <option value="">Todas las categorías</option>
                            {CATEGORIAS.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                            Estatus
                        </label>
                        <select
                            value={estatusFilter}
                            onChange={(e) => setEstatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm"
                        >
                            <option value="">Todos los estatus</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center">
                        Cargando productos...
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-4 text-left">
                                        <button
                                            onClick={() => toggleSort('codigo')}
                                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase hover:text-[#2A7933] transition-colors"
                                        >
                                            Código
                                            {renderSortIcon('codigo')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-4 text-left">
                                        <button
                                            onClick={() => toggleSort('nombre')}
                                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase hover:text-[#2A7933] transition-colors"
                                        >
                                            Producto
                                            {renderSortIcon('nombre')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                                        Descripción
                                    </th>

                                    <th className="px-4 py-4 text-left">
                                        <button
                                            onClick={() => toggleSort('categoria')}
                                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase hover:text-[#2A7933] transition-colors"
                                        >
                                            Categoría
                                            {renderSortIcon('categoria')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                                        Unidad
                                    </th>

                                    <th className="px-4 py-4 text-left">
                                        <button
                                            onClick={() => toggleSort('stock_minimo')}
                                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase hover:text-[#2A7933] transition-colors"
                                        >
                                            Stock Mín.
                                            {renderSortIcon('stock_minimo')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                                        Fecha Registro
                                    </th>

                                    <th className="px-4 py-4 text-left">
                                        <button
                                            onClick={() => toggleSort('estatus')}
                                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase hover:text-[#2A7933] transition-colors"
                                        >
                                            Estatus
                                            {renderSortIcon('estatus')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-700 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {productosFiltrados.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-12 text-center text-slate-500"
                                        >
                                            <p className="text-sm">
                                                No hay productos que coincidan con los filtros
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    (() => {
                                        const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
                                        const startIdx = (currentPage - 1) * itemsPerPage;
                                        const endIdx = startIdx + itemsPerPage;
                                        const productosActuales = productosFiltrados.slice(startIdx, endIdx);

                                        return productosActuales.map((producto) => (
                                        <tr
                                            key={producto.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-4 py-4 font-mono text-xs text-slate-600 font-medium">
                                                {producto.codigo_producto}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-[#2A7933]/10 flex items-center justify-center flex-shrink-0">
                                                        <Package
                                                            size={16}
                                                            className="text-[#2A7933]"
                                                        />
                                                    </div>

                                                    <div className="font-medium text-slate-900 text-sm max-w-xs group relative">
                                                        <div className="line-clamp-2">{producto.nombre_prod}</div>
                                                        <div className="absolute left-0 top-full mt-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-normal z-50 hidden group-hover:block w-64 pointer-events-none">
                                                            {producto.nombre_prod}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-slate-600 max-w-xs group relative">
                                                <div className="line-clamp-2">
                                                    {producto.descripcion || '-'}
                                                </div>
                                                {producto.descripcion && (
                                                    <div className="absolute left-0 top-full mt-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-normal z-50 hidden group-hover:block w-64 pointer-events-none">
                                                        {producto.descripcion}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-slate-600">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                    {producto.categoria || '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-slate-600">
                                                {producto.unidad_medida || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-slate-600 text-right font-medium">
                                                {producto.stock_minimo !== null
                                                    ? producto.stock_minimo
                                                    : '-'}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-slate-600">
                                                {producto.fecha_creacion
                                                    ? new Date(
                                                        producto.fecha_creacion
                                                    ).toLocaleDateString('es-CL', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : '-'}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${producto.activo
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {producto.activo
                                                        ? 'Activo'
                                                        : 'Inactivo'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => abrirEditar(producto)}
                                                        className="p-2 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                                                        title="Editar producto"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button className="p-2 rounded-lg hover:bg-[#2A7933]/10 text-[#2A7933] transition-colors">
                                                        <QrCode size={16} />
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
                        {productosFiltrados.length > 0 && (
                            <div className="px-4 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/30">
                                <div className="text-sm text-slate-600">
                                    Mostrando <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, productosFiltrados.length)}</span> de <span className="font-semibold">{productosFiltrados.length}</span> productos
                                </div>

                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
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
                title="Editar Producto"
                description={productoEditando?.codigo_producto}
            >
                {productoEditando && (
                    <ProductoEditForm
                        producto={productoEditando}
                        onSave={guardarEdicion}
                        onClose={cerrarDrawer}
                    />
                )}
            </Drawer>
        </div>
    );
}
