'use client';

import { useState } from 'react';
import {
    Package,
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
    Tag,
    Layers,
    Scale,
    FileText,
    Hash,
    ToggleLeft
} from 'lucide-react';
import {
    CATEGORIAS,
    UNIDADES_MEDIDA,
    TIPO_INVENTARIO,
} from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

interface Props {
    crearProducto: (producto: {
        nombre_prod: string;
        descripcion?: string;
        categoria?: string;
        unidad_medida?: string;
        stock_minimo?: number;
        tipo_inventario?: string;
        cuenta_contable?: string;
        activo?: boolean;
        ranking_notas?: string;
        usuario_creacion_id?: string;
    }) => Promise<void>;
}

export default function ProductoForm({ crearProducto }: Props) {
    const { usuario } = useAuth();

    const inicialForm = {
        nombre_prod: '',
        descripcion: '',
        categoria: 'SIN DEFINIR',
        unidad_medida: 'UNIDAD',
        stock_minimo: 0,
        tipo_inventario: 'GENERAL',
        cuenta_contable: '',
        activo: true,
        ranking_notas: '',
    };

    const [formData, setFormData] = useState(inicialForm);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);

    function handleInputChange(field: string, value: any) {
        // Convertir a mayúsculas para campos de texto
        const fieldsToUppercase = ['nombre_prod', 'descripcion', 'ranking_notas', 'cuenta_contable'];
        const finalValue = fieldsToUppercase.includes(field)
            ? value.toUpperCase()
            : value;

        setFormData((prev) => ({
            ...prev,
            [field]: finalValue,
        }));
    }

    async function guardarProducto(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setExito(false);

        if (!formData.nombre_prod.trim()) {
            setError('El nombre del producto es requerido');
            return;
        }

        try {
            setGuardando(true);

            // Generar código temporal hasta que el trigger funcione
            const codigoTemporal = `PROD-${Date.now()}`;

            await crearProducto({
                ...formData,
                usuario_creacion_id: usuario?.auth_uid,
            });

            setFormData(inicialForm);
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el producto');
        } finally {
            setGuardando(false);
        }
    }

    const labelStyles = "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5";
    const inputStyles = "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";
    const selectStyles = "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm appearance-none";

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sticky top-6 shadow-xl shadow-slate-100/50">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-[#2A7933] flex items-center justify-center shadow-sm text-white">
                    <Package size={22} />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-900">
                        Nuevo Producto
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Registra un artículo con sus especificaciones
                    </p>
                </div>
            </div>

            {/* Notification Messages */}
            {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex gap-3 animate-fadeIn">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
            )}

            {exito && (
                <div className="mb-5 p-3.5 bg-[#2A7933]/10 border border-[#2A7933]/30 rounded-xl flex gap-3 animate-fadeIn">
                    <CheckCircle size={18} className="text-[#2A7933] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#2A7933] font-medium">Producto creado exitosamente</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={guardarProducto} className="space-y-4">

                {/* Sección 1: Datos Principales */}
                <div className="space-y-4">
                    <div>
                        <label className={labelStyles}>
                            Nombre del Producto <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Ej: Papel A4 75gsm"
                                value={formData.nombre_prod}
                                onChange={(e) => handleInputChange('nombre_prod', e.target.value)}
                                required
                                className={inputStyles}
                            />
                        </div>

                        <div className="mt-2">
                            <label className={labelStyles}>Descripción Breve</label>
                            <textarea
                                placeholder="Detalles sobre especificaciones, marca o modelo..."
                                rows={2}
                                value={formData.descripcion}
                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Categoría</label>
                            <div className="relative">
                                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                                    className={selectStyles}
                                >
                                    {CATEGORIAS.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelStyles}>Unidad de Medida</label>
                            <div className="relative">
                                <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={formData.unidad_medida}
                                    onChange={(e) => handleInputChange('unidad_medida', e.target.value)}
                                    className={selectStyles}
                                >
                                    {UNIDADES_MEDIDA.map((um) => (
                                        <option key={um} value={um}>{um}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Sección 2: Control e Inventario */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Stock Mínimo</label>
                            <div className="relative">
                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.stock_minimo}
                                    onChange={(e) => handleInputChange('stock_minimo', parseInt(e.target.value) || 0)}
                                    min={0}
                                    className={inputStyles}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyles}>Tipo Inventario</label>
                            <div className="relative">
                                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={formData.tipo_inventario}
                                    onChange={(e) => handleInputChange('tipo_inventario', e.target.value)}
                                    className={selectStyles}
                                >
                                    {TIPO_INVENTARIO.map((ti) => (
                                        <option key={ti} value={ti}>{ti}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Cuenta Contable</label>
                            <div className="relative">
                                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Ej: 1001-00"
                                    value={formData.cuenta_contable}
                                    onChange={(e) => handleInputChange('cuenta_contable', e.target.value)}
                                    className={inputStyles}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyles}>Estado del Item</label>
                            <div className="relative">
                                <ToggleLeft className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={formData.activo ? 'activo' : 'inactivo'}
                                    onChange={(e) => handleInputChange('activo', e.target.value === 'activo')}
                                    className={selectStyles}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección 3: Textareas */}
                <div className="space-y-4">

                    <div>
                        <label className={labelStyles}>Notas Internas / Ranking</label>
                        <textarea
                            placeholder="Anotaciones de proveedores, prioridades de compra..."
                            rows={2}
                            value={formData.ranking_notas}
                            onChange={(e) => handleInputChange('ranking_notas', e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
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
                            <span>Guardar Producto</span>
                        </>
                    )}
                </button>
            </form>

            {/* Footer Tip */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>* Campos obligatorios</span>
                <span className="font-medium text-slate-500">ID autogenerado</span>
            </div>
        </div>
    );
}
