'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface StockDisponible {
    codigo_producto: string;
    nombre_prod: string;
    unidad_medida: string | null;
    stock_minimo: number;
    activo: boolean;
    total_ingresos: number;
    total_salidas: number;
    stock_disponible: number;
    porcentaje_stock_min: number | null;
    estado_stock: string;
}

export function useStockDisponible() {
    const [stock, setStock] = useState<StockDisponible[]>([]);
    const [loading, setLoading] = useState(true);

    async function cargarStock() {
        setLoading(true);

        const { data, error } = await supabase
            .from('v_stock_disponible')
            .select('*')
            .order('nombre_prod', { ascending: true });

        if (error) {
            console.error('Error cargando stock disponible:', error.message);
            setStock([]);
            setLoading(false);
            return;
        }

        setStock(data || []);
        setLoading(false);
    }

    useEffect(() => {
        cargarStock();
    }, []);

    return {
        stock,
        loading,
        cargarStock,
    };
}
