'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useProductos } from '@/hooks/useProductos';
import { useIngresos } from '@/hooks/useIngresos';
import { useSalidas } from '@/hooks/useSalidas';
import { useStockDisponible } from '@/hooks/useStockDisponible';
import DashboardKPIs from './components/DashboardKPIs';
import SalidasPorAreaChart from './components/SalidasPorAreaChart';
import ProductosSolicitadosTable from './components/ProductosSolicitadosTable';
import ResumenStockTable from './components/ResumenStockTable';

interface ResumenProducto {
    id: string;
    codigo_producto: string;
    nombre_prod: string;
    stock_minimo: number;
    total_ingresos: number;
    total_salidas: number;
    stock_actual: number;
    estado: 'critico' | 'atencion' | 'optimo';
}

interface SalidaArea {
    area: string;
    cantidad: number;
}

interface ProductoSolicitado {
    codigo: string;
    nombre: string;
    unidad: string;
    cantidad: number;
}

export default function DashboardPage() {
    const { productos } = useProductos();
    const { ingresos } = useIngresos();
    const { salidas } = useSalidas();
    const { stock: stockDisponible } = useStockDisponible();

    const [usuarios, setUsuarios] = useState(0);
    const [resumen, setResumen] = useState<ResumenProducto[]>([]);
    const [salidasPorArea, setSalidasPorArea] = useState<SalidaArea[]>([]);
    const [productosSolicitadosSemana, setProductosSolicitadosSemana] = useState<ProductoSolicitado[]>([]);

    useEffect(() => {
        // Cargar cantidad de usuarios
        async function cargarUsuarios() {
            const { data } = await supabase
                .from('auth.users')
                .select('id', { count: 'exact' });
        }
        cargarUsuarios();
    }, []);

    // Convertir stockDisponible a resumen
    useEffect(() => {
        if (stockDisponible.length > 0) {
            const resumenData = stockDisponible.map((item) => {
                let estado: 'critico' | 'atencion' | 'optimo' = 'optimo';
                if (item.estado_stock.includes('URGENTE')) {
                    estado = 'critico';
                } else if (item.estado_stock.includes('BAJO')) {
                    estado = 'atencion';
                }

                return {
                    id: item.codigo_producto,
                    codigo_producto: item.codigo_producto,
                    nombre_prod: item.nombre_prod,
                    stock_minimo: item.stock_minimo,
                    total_ingresos: item.total_ingresos,
                    total_salidas: item.total_salidas,
                    stock_actual: item.stock_disponible,
                    estado,
                };
            });

            setResumen(resumenData);
        }
    }, [stockDisponible]);

    const productosActivos = productos.filter((p) => p.activo).length;
    const productosInactivos = productos.filter((p) => !p.activo).length;
    const totalIngresos = ingresos.length;
    const totalSalidas = salidas.length;

    // Calcular últimos 7 días (useMemo para evitar recalcular en cada render)
    const { hoy, hace7Dias } = useMemo(() => {
        const hoyDate = new Date();
        hoyDate.setHours(23, 59, 59, 999);

        const hace7DiasDate = new Date(hoyDate);
        hace7DiasDate.setDate(hoyDate.getDate() - 6);
        hace7DiasDate.setHours(0, 0, 0, 0);

        return { hoy: hoyDate, hace7Dias: hace7DiasDate };
    }, []);

    // Calcular salidas por área destino de los últimos 7 días
    useEffect(() => {
        const mapa = new Map<string, number>();
        salidas.forEach((salida) => {
            const fechaSalida = new Date(salida.fecha_salida);
            if (fechaSalida >= hace7Dias && fechaSalida <= hoy) {
                const area = salida.area_destino || 'SIN ASIGNAR';
                mapa.set(area, (mapa.get(area) || 0) + salida.cantidad);
            }
        });
        const areas = Array.from(mapa.entries())
            .map(([area, cantidad]) => ({ area, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);
        setSalidasPorArea(areas);
    }, [salidas, hace7Dias, hoy]);

    // Productos más solicitados de los últimos 7 días
    useEffect(() => {
        const mapa = new Map<string, { codigo: string; nombre: string; unidad: string; cantidad: number }>();
        salidas.forEach((salida) => {
            const fechaSalida = new Date(salida.fecha_salida);
            if (fechaSalida >= hace7Dias && fechaSalida <= hoy) {
                const producto = productos.find(p => p.codigo_producto === salida.codigo_producto);
                if (producto) {
                    const existing = mapa.get(salida.codigo_producto) || {
                        codigo: salida.codigo_producto,
                        nombre: producto.nombre_prod,
                        unidad: producto.unidad_medida || 'UNIDAD',
                        cantidad: 0
                    };
                    mapa.set(salida.codigo_producto, {
                        ...existing,
                        cantidad: existing.cantidad + salida.cantidad
                    });
                }
            }
        });
        const productosList = Array.from(mapa.values()).sort((a, b) => b.cantidad - a.cantidad);
        setProductosSolicitadosSemana(productosList);
    }, [salidas, productos, hace7Dias, hoy]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">Resumen general del inventario</p>
            </div>

            {/* Cards KPIs */}
            <DashboardKPIs
                usuarios={usuarios}
                productosActivos={productosActivos}
                productosInactivos={productosInactivos}
                totalIngresos={totalIngresos}
                totalSalidas={totalSalidas}
            />

            {/* Gráficos y Tablas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SalidasPorAreaChart salidasPorArea={salidasPorArea} />
                <ProductosSolicitadosTable productos={productosSolicitadosSemana} />
            </div>

            {/* Tabla de Resumen */}
            <ResumenStockTable resumen={resumen} />
        </div>
    );
}
