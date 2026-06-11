'use client';

interface ProductoSolicitado {
    codigo: string;
    nombre: string;
    unidad: string;
    cantidad: number;
}

interface ProductosSolicitadosTableProps {
    productos: ProductoSolicitado[];
}

export default function ProductosSolicitadosTable({ productos }: ProductosSolicitadosTableProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Productos Solicitados (Últimos 7 días: {productos.length})</h3>

            {productos.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-slate-500 text-xs">
                    No hay solicitudes esta semana
                </div>
            ) : (
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-xs">
                        <thead className="border-b border-slate-200 sticky top-0 bg-white">
                            <tr>
                                <th className="px-2 py-1.5 font-semibold text-slate-500 uppercase text-left">Código</th>
                                <th className="px-2 py-1.5 font-semibold text-slate-500 uppercase text-left">Producto</th>
                                <th className="px-2 py-1.5 font-semibold text-slate-500 uppercase text-right">Cant.</th>
                                <th className="px-2 py-1.5 font-semibold text-slate-500 uppercase text-right">Und.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {productos.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/40">
                                    <td className="px-2 py-1 font-mono text-slate-500 text-xs">{item.codigo}</td>
                                    <td className="px-2 py-1 font-medium text-slate-900 max-w-xs group relative">
                                        <div className="line-clamp-2">{item.nombre}</div>
                                        <div className="absolute left-0 top-full mt-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-normal z-50 hidden group-hover:block w-64 pointer-events-none">
                                            {item.nombre}
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 font-mono text-emerald-600 text-right font-bold">{item.cantidad.toFixed(0)}</td>
                                    <td className="px-2 py-1 text-slate-600 text-right text-xs">{item.unidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
