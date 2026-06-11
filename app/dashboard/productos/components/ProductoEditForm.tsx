'use client';

import { useState } from 'react';
import {
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { CATEGORIAS, UNIDADES_MEDIDA } from '@/lib/constants';
import { Producto } from '@/hooks/useProductos';

interface Props {
    producto: Producto;
    onSave: (datos: Partial<Producto>) => Promise<void>;
    onClose: () => void;
}

export default function ProductoEditForm({
    producto,
    onSave,
    onClose,
}: Props) {
    const [formData, setFormData] = useState(producto);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);

    function handleInputChange(field: string, value: any) {
        const fieldsToUppercase = ['nombre_prod', 'descripcion', 'ranking_notas'];
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

        if (!formData.nombre_prod) {
            setError('El nombre del producto es requerido');
            return;
        }

        try {
            setGuardando(true);
            await onSave(formData);
            setExito(true);
            setTimeout(() => {
                setExito(false);
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el producto');
        } finally {
            setGuardando(false);
        }
    }

    const labelStyles = "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5";
    const inputStyles = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";
    const selectStyles = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";

    return (
        <form onSubmit={guardarProducto} className="space-y-4">
            {/* Messages */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {exito && (
                <div className="p-3 bg-[#2A7933]/10 border border-[#2A7933]/30 rounded-lg flex gap-2">
                    <CheckCircle size={16} className="text-[#2A7933] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#2A7933]">Producto actualizado</p>
                </div>
            )}

            {/* Datos Principales */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase">Datos Principales</h3>

                <div>
                    <label className={labelStyles}>Nombre Producto</label>
                    <input
                        type="text"
                        value={formData.nombre_prod}
                        onChange={(e) => handleInputChange('nombre_prod', e.target.value)}
                        className={inputStyles}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={labelStyles}>Categoría</label>
                        <select
                            value={formData.categoria || ''}
                            onChange={(e) => handleInputChange('categoria', e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccionar</option>
                            {CATEGORIAS.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelStyles}>Unidad Medida</label>
                        <select
                            value={formData.unidad_medida || ''}
                            onChange={(e) => handleInputChange('unidad_medida', e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccionar</option>
                            {UNIDADES_MEDIDA.map((um) => (
                                <option key={um} value={um}>{um}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Control e Inventario */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase">Control e Inventario</h3>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={labelStyles}>Stock Mínimo</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.stock_minimo || 0}
                            onChange={(e) => handleInputChange('stock_minimo', e.target.value)}
                            className={inputStyles}
                        />
                    </div>

                    <div>
                        <label className={labelStyles}>Tipo Inventario</label>
                        <input
                            type="text"
                            placeholder="A o B"
                            value={formData.tipo_inventario || ''}
                            onChange={(e) => handleInputChange('tipo_inventario', e.target.value)}
                            className={inputStyles}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelStyles}>Cuenta Contable</label>
                    <input
                        type="text"
                        placeholder="1.1.1.010"
                        value={formData.cuenta_contable || ''}
                        onChange={(e) => handleInputChange('cuenta_contable', e.target.value)}
                        className={inputStyles}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="activo"
                        checked={formData.activo || false}
                        onChange={(e) => handleInputChange('activo', e.target.checked)}
                        className="w-4 h-4 accent-[#2A7933] rounded"
                    />
                    <label htmlFor="activo" className="text-sm font-medium text-slate-700">
                        Producto Activo
                    </label>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Textareas */}
            <div className="space-y-3">
                <div>
                    <label className={labelStyles}>Descripción</label>
                    <textarea
                        placeholder="Descripción del producto"
                        rows={2}
                        value={formData.descripcion || ''}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                    />
                </div>

                <div>
                    <label className={labelStyles}>Ranking / Notas</label>
                    <textarea
                        placeholder="Notas adicionales"
                        rows={2}
                        value={formData.ranking_notas || ''}
                        onChange={(e) => handleInputChange('ranking_notas', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={guardando}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-[#2A7933] hover:bg-[#1F5225] text-white rounded-lg py-2 flex items-center justify-center gap-2 font-medium text-sm transition-colors disabled:opacity-50"
                >
                    {guardando ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            <span>Guardar</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
