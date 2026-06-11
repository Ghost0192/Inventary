'use client';

interface SalidaArea {
    area: string;
    cantidad: number;
}

interface SalidasPorAreaChartProps {
    salidasPorArea: SalidaArea[];
}

export default function SalidasPorAreaChart({ salidasPorArea }: SalidasPorAreaChartProps) {
    const top7Areas = salidasPorArea.slice(0, 7);
    const remainingAreas = Math.max(0, salidasPorArea.length - 7);
    const maxCantidad = top7Areas.length > 0 ? Math.max(...top7Areas.map(s => s.cantidad)) : 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Salidas por Área Destino (Últimos 7 días)</h3>

            {salidasPorArea.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-slate-500 text-xs">
                    No hay salidas esta semana
                </div>
            ) : (
                <div className="space-y-1.5">
                    {top7Areas.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-700 truncate">{item.area}</span>
                                <span className="text-xs font-bold text-slate-900">{item.cantidad}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#2A7933] to-[#3a9a47] h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${maxCantidad > 0 ? (item.cantidad / maxCantidad) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {remainingAreas > 0 && (
                        <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                            +{remainingAreas} áreas más
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
