'use client';

import { useState } from 'react';
import {
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { SUCURSALES_SALIDA, AREA_DESTINO, UNIDADES_MEDIDA } from '@/lib/constants';
import { Salida } from '@/hooks/useSalidas';

interface Props {
    salida: Salida;
    onSave: (datos: Partial<Salida>) => Promise<void>;
    onClose: () => void;
}

export default function SalidaEditForm({
    salida,
    onSave,
    onClose,
}: Props) {
    const [formData, setFormData] = useState(salida);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);

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

        if (!formData.cantidad || formData.cantidad <= 0) {
            setError('La cantidad debe ser mayor a 0');
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
            setError(err.message || 'Error al guardar la salida');
        } finally {
            setGuardando(false);
        }
    }

    const labelStyles = "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5";
    const inputStyles = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";
    const selectStyles = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm";

    return (
        <form onSubmit={guardarSalida} className="space-y-4">
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
                    <p className="text-sm text-[#2A7933]">Salida actualizada</p>
                </div>
            )}

            {/* Cantidad */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase">Datos de la Salida</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelStyles}>Unidad Salida</label>
                        <select
                            value={formData.unidad_salida || ''}
                            onChange={(e) => handleInputChange('unidad_salida', e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccionar</option>
                            {UNIDADES_MEDIDA.map((unidad) => (
                                <option key={unidad} value={unidad}>
                                    {unidad}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelStyles}>Cantidad</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.cantidad}
                            onChange={(e) => handleInputChange('cantidad', e.target.value)}
                            className={inputStyles}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelStyles}>Fecha Salida</label>
                    <input
                        type="date"
                        value={formData.fecha_salida}
                        onChange={(e) => handleInputChange('fecha_salida', e.target.value)}
                        className={inputStyles}
                    />
                </div>

                <div>
                    <label className={labelStyles}>Área Destino</label>
                    <select
                        value={formData.area_destino || ''}
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
            </div>

            <hr className="border-slate-100" />

            {/* Detalles */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase">Detalles</h3>

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

                <div>
                    <label className={labelStyles}>N° Documento / Solicitud</label>
                    <input
                        type="text"
                        value={formData.numero_documento || ''}
                        onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                        className={inputStyles}
                    />
                </div>

                <div>
                    <label className={labelStyles}>Número Semana</label>
                    <input
                        type="text"
                        value={formData.numero_semana || ''}
                        onChange={(e) => handleInputChange('numero_semana', e.target.value)}
                        className={inputStyles}
                    />
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Nota */}
            <div>
                <label className={labelStyles}>Nota / Observaciones</label>
                <textarea
                    placeholder="Observaciones"
                    rows={2}
                    value={formData.nota || ''}
                    onChange={(e) => handleInputChange('nota', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#2A7933]/10 focus:border-[#2A7933] transition-all text-sm resize-none"
                />
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
