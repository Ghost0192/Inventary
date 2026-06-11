'use client';

import { useState } from 'react';
import {
    Package,
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
    Boxes,
    Scan,
} from 'lucide-react';
import { BODEGA_INGRESOSALIDA, ORIGEN_PRODUCTO } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';

interface Props {
    crearIngreso: (ingreso: {
        codigo_producto: string;
        cantidad: number;
        marca?: string;
        origen?: string;
        proveedor?: string;
        fecha_caducidad?: string;
        bodega?: string;
        nota?: string;
        fecha_recepcion?: string;
        usuario_id?: string;
    }) => Promise<void>;
}

export default function IngresoForm({ crearIngreso }: Props) {
    const { usuario } = useAuth();
    const { productos } = useProductos();

    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    const inicialForm = {
        codigo_producto: '',
        cantidad: 0,
        marca: '',
        origen: '',
        proveedor: '',
        fecha_caducidad: '',
        bodega: 'BODEGA PRINCIPAL',
        nota: '',
        fecha_recepcion: new Date().toISOString().split('T')[0],
    };

    const [formData, setFormData] = useState(inicialForm);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);

    // Filtrar productos por código o nombre
    const productosFiltrados = productos.filter((prod) =>
        prod.codigo_producto.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        prod.nombre_prod.toLowerCase().includes(busquedaProducto.toLowerCase())
    );

    function handleProductoSelect(codigo: string) {
        setFormData((prev) => ({
            ...prev,
            codigo_producto: codigo,
        }));
        setProductoSeleccionado(codigo);
        setBusquedaProducto('');
        setMostrarDropdown(false);
    }

    function handleInputChange(field: string, value: any) {
        const fieldsToUppercase = ['marca', 'origen', 'proveedor', 'nota', 'bodega'];
        const finalValue = fieldsToUppercase.includes(field)
            ? value.toUpperCase()
            : value;

        setFormData((prev) => ({
            ...prev,
            [field]: finalValue,
        }));
    }

    async function guardarIngreso(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setExito(false);

        if (!formData.codigo_producto) {
            setError('Debe seleccionar un producto');
            return;
        }

        if (!formData.cantidad || formData.cantidad <= 0) {
            setError('La cantidad debe ser mayor a 0');
            return;
        }

        try {
            setGuardando(true);

            await crearIngreso({
                ...formData,
                cantidad: parseFloat(formData.cantidad.toString()),
                usuario_id: usuario?.auth_uid,
            });

            setFormData(inicialForm);
            setBusquedaProducto('');
            setProductoSeleccionado('');
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el ingreso');
        } finally {
            setGuardando(false);
        }
    }

    const labelStyles = "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5";
    const inputStyles = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";
    const selectStyles = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";

    const productoSeleccionadoNombre = productos.find(p => p.codigo_producto === productoSeleccionado)?.nombre_prod;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sticky top-6 shadow-xl shadow-slate-100/50">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-[#2A7933] flex items-center justify-center shadow-sm text-white">
                    <Boxes size={22} />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-900">
                        Nuevo Ingreso
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Registra una entrada de producto al inventario
                    </p>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
            )}

            {exito && (
                <div className="mb-5 p-3.5 bg-[#2A7933]/10 border border-[#2A7933]/30 rounded-xl flex gap-3">
                    <CheckCircle size={18} className="text-[#2A7933] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#2A7933] font-medium">Ingreso registrado exitosamente</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={guardarIngreso} className="space-y-5">

                {/* 1. Buscar Producto + Escanear */}
                <div>
                    <label className={labelStyles}>Producto <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por código o nombre..."
                                    value={busquedaProducto}
                                    onChange={(e) => {
                                        setBusquedaProducto(e.target.value);
                                        setMostrarDropdown(true);
                                    }}
                                    onFocus={() => setMostrarDropdown(true)}
                                    className={inputStyles}
                                />

                                {/* Dropdown de productos */}
                                {mostrarDropdown && busquedaProducto && productosFiltrados.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                                        {productosFiltrados.map((prod) => (
                                            <button
                                                key={prod.id}
                                                type="button"
                                                onClick={() => handleProductoSelect(prod.codigo_producto)}
                                                className="w-full px-4 py-2 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                                            >
                                                <div className="text-sm font-medium text-slate-900">{prod.nombre_prod}</div>
                                                <div className="text-xs text-slate-500">{prod.codigo_producto}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="px-4 py-2.5 bg-[#2A7933] hover:bg-[#1F5225] text-white rounded-xl transition-colors flex items-center gap-2"
                                title="Escanear QR (próximamente)"
                            >
                                <Scan size={18} />
                                <span className="text-xs font-medium">Escanear</span>
                            </button>
                        </div>

                        {productoSeleccionado && (
                            <div className="p-2.5 bg-[#2A7933]/10 border border-[#2A7933]/30 rounded-lg text-sm text-[#2A7933] font-medium">
                                ✓ {productoSeleccionadoNombre} ({productoSeleccionado})
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Cantidad */}
                <div>
                    <label className={labelStyles}>Cantidad <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.cantidad}
                        onChange={(e) => handleInputChange('cantidad', e.target.value)}
                        required
                        className={inputStyles}
                    />
                </div>

                <hr className="border-slate-100" />

                {/* 3. Bodega Ingreso + Fecha Recepción */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyles}>Bodega Ingreso</label>
                        <select
                            value={formData.bodega}
                            onChange={(e) => handleInputChange('bodega', e.target.value)}
                            className={selectStyles}
                        >
                            {BODEGA_INGRESOSALIDA.map((bodega) => (
                                <option key={bodega} value={bodega}>
                                    {bodega}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelStyles}>Fecha Recepción</label>
                        <input
                            type="date"
                            value={formData.fecha_recepcion}
                            onChange={(e) => handleInputChange('fecha_recepcion', e.target.value)}
                            className={inputStyles}
                        />
                    </div>
                </div>

                {/* Detalles */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
                    {/* Marca + Origen */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Marca</label>
                            <input
                                type="text"
                                placeholder="Marca del producto"
                                value={formData.marca}
                                onChange={(e) => handleInputChange('marca', e.target.value)}
                                className={inputStyles}
                            />
                        </div>

                        <div>
                            <label className={labelStyles}>Origen Producto</label>
                            <select
                                value={formData.origen}
                                onChange={(e) => handleInputChange('origen', e.target.value)}
                                className={selectStyles}
                            >
                                <option value="">Seleccionar origen</option>
                                {ORIGEN_PRODUCTO.map((origen) => (
                                    <option key={origen} value={origen}>
                                        {origen}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Proveedor + Fecha Caducidad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Proveedor</label>
                            <input
                                type="text"
                                placeholder="Nombre del proveedor"
                                value={formData.proveedor}
                                onChange={(e) => handleInputChange('proveedor', e.target.value)}
                                className={inputStyles}
                            />
                        </div>

                        <div>
                            <label className={labelStyles}>Fecha Caducidad</label>
                            <input
                                type="date"
                                value={formData.fecha_caducidad}
                                onChange={(e) => handleInputChange('fecha_caducidad', e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                    </div>
                </div>

                {/* Nota Observaciones */}
                <div>
                    <label className={labelStyles}>Nota Observaciones</label>
                    <textarea
                        placeholder="Observaciones sobre el ingreso..."
                        rows={3}
                        value={formData.nota}
                        onChange={(e) => handleInputChange('nota', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={guardando}
                    className="w-full bg-[#2A7933] hover:bg-[#1F5225] text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                    {guardando ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Registrando...</span>
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            <span>Registrar Ingreso</span>
                        </>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>* Campos obligatorios</span>
                <span className="font-medium text-slate-500">Fecha: {formData.fecha_recepcion}</span>
            </div>
        </div>
    );
}
