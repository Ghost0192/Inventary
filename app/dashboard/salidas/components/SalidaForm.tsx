'use client';

import { useState } from 'react';
import {
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
    Boxes,
    Scan,
    AlertTriangle,
} from 'lucide-react';
import { SUCURSALES_SALIDA, AREA_DESTINO, UNIDADES_MEDIDA } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';
import { useIngresos } from '@/hooks/useIngresos';
import { useSalidas } from '@/hooks/useSalidas';

interface Props {
    crearSalida: (salida: {
        codigo_producto: string;
        cantidad: number;
        area_destino?: string;
        numero_documento?: string;
        usuario_id?: string;
        nota?: string;
        fecha_salida?: string;
        unidad_salida?: string;
        numero_semana?: string;
        sucursal_salida?: string;
    }) => Promise<void>;
}

export default function SalidaForm({ crearSalida }: Props) {
    const { usuario } = useAuth();
    const { productos } = useProductos();
    const { ingresos } = useIngresos();
    const { salidas } = useSalidas();

    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    const inicialForm = {
        codigo_producto: '',
        cantidad: 0,
        area_destino: '',
        numero_documento: '',
        nota: '',
        fecha_salida: new Date().toISOString().split('T')[0],
        unidad_salida: '',
        sucursal_salida: 'HIJUELAS',
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

    // Calcular stock disponible
    function calcularStockDisponible(codigoProducto: string): number {
        const totalIngresos = ingresos
            .filter((ingreso) => ingreso.codigo_producto === codigoProducto)
            .reduce((sum, ingreso) => sum + ingreso.cantidad, 0);

        const totalSalidas = salidas
            .filter((salida) => salida.codigo_producto === codigoProducto)
            .reduce((sum, salida) => sum + salida.cantidad, 0);

        return totalIngresos - totalSalidas;
    }

    const stockDisponible = formData.codigo_producto
        ? calcularStockDisponible(formData.codigo_producto)
        : 0;

    const hayStockInsuficiente = formData.cantidad > stockDisponible;

    function handleProductoSelect(codigo: string) {
        setFormData((prev) => ({
            ...prev,
            codigo_producto: codigo,
            cantidad: 0, // Reset cantidad al cambiar producto
        }));
        setProductoSeleccionado(codigo);
        setBusquedaProducto('');
        setMostrarDropdown(false);
    }

    function handleInputChange(field: string, value: any) {
        const fieldsToUppercase = ['area_destino', 'numero_documento', 'numero_semana', 'nota', 'sucursal_salida'];
        const finalValue = fieldsToUppercase.includes(field)
            ? value.toUpperCase()
            : value;

        setFormData((prev) => ({
            ...prev,
            [field]: finalValue,
        }));
    }

    async function guardarSalida(e: React.FormEvent) {
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

        if (hayStockInsuficiente) {
            setError(`Stock insuficiente. Disponible: ${stockDisponible}`);
            return;
        }

        try {
            setGuardando(true);

            await crearSalida({
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
            setError(err.message || 'Error al guardar la salida');
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
                        Nueva Salida
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Registra una salida de producto del inventario
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
                    <p className="text-sm text-[#2A7933] font-medium">Salida registrada exitosamente</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={guardarSalida} className="space-y-5">

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

                {/* Stock Disponible */}
                {productoSeleccionado && (
                    <div className={`p-3.5 rounded-xl border-2 ${
                        hayStockInsuficiente
                            ? 'bg-red-50 border-red-300'
                            : 'bg-green-50 border-green-300'
                    }`}>
                        <div className="flex items-center gap-2">
                            {hayStockInsuficiente ? (
                                <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
                            ) : (
                                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                            )}
                            <div>
                                <p className={`text-sm font-semibold ${
                                    hayStockInsuficiente ? 'text-red-700' : 'text-green-700'
                                }`}>
                                    Stock disponible: {stockDisponible} unidades
                                </p>
                                {hayStockInsuficiente && (
                                    <p className="text-xs text-red-600 mt-0.5">
                                        No hay stock suficiente. Requieres {formData.cantidad} pero solo hay {stockDisponible}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Unidad de Salida + Cantidad */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyles}>Unidad de Salida</label>
                        <select
                            value={formData.unidad_salida || ''}
                            onChange={(e) => handleInputChange('unidad_salida', e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccionar unidad</option>
                            {UNIDADES_MEDIDA.map((unidad) => (
                                <option key={unidad} value={unidad}>
                                    {unidad}
                                </option>
                            ))}
                        </select>
                    </div>

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
                </div>

                {/* 3. Fecha de Salida */}
                <div>
                    <label className={labelStyles}>Fecha de Salida</label>
                    <input
                        type="date"
                        value={formData.fecha_salida}
                        onChange={(e) => handleInputChange('fecha_salida', e.target.value)}
                        className={inputStyles}
                    />
                </div>

                {/* Detalles */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3 -mt-1">
                    {/* Área Destino + Sucursal Salida */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Área Destino</label>
                            <select
                                value={formData.area_destino}
                                onChange={(e) => handleInputChange('area_destino', e.target.value)}
                                className={selectStyles}
                            >
                                <option value="">Seleccionar área</option>
                                {AREA_DESTINO.map((area) => (
                                    <option key={area} value={area}>
                                        {area}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelStyles}>Sucursal Salida</label>
                            <select
                                value={formData.sucursal_salida}
                                onChange={(e) => handleInputChange('sucursal_salida', e.target.value)}
                                className={selectStyles}
                            >
                                {SUCURSALES_SALIDA.map((sucursal) => (
                                    <option key={sucursal} value={sucursal}>
                                        {sucursal}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Número de Documento / Solicitud */}
                    <div>
                        <label className={labelStyles}>N° Documento / Solicitud</label>
                        <input
                            type="text"
                            placeholder="Número de solicitud"
                            value={formData.numero_documento}
                            onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                            className={inputStyles}
                        />
                    </div>
                </div>

                {/* Nota / Observaciones */}
                <div>
                    <label className={labelStyles}>Nota / Observaciones</label>
                    <textarea
                        placeholder="Observaciones sobre la salida..."
                        rows={3}
                        value={formData.nota}
                        onChange={(e) => handleInputChange('nota', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={guardando || hayStockInsuficiente}
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
                            <span>Registrar Salida</span>
                        </>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>* Campos obligatorios</span>
                <span className="font-medium text-slate-500">Fecha: {formData.fecha_salida}</span>
            </div>
        </div>
    );
}
