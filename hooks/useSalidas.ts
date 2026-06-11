'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getWeekNumber } from '@/lib/dateUtils';

export interface Salida {
    id: string;
    codigo_producto: string;
    cantidad: number;
    area_destino: string | null;
    numero_documento: string | null;
    usuario_id: string | null;
    fecha_registro: string;
    nota: string | null;
    fecha_salida: string;
    unidad_salida: string | null;
    numero_semana: string | null;
    sucursal_salida: string;
}

export function useSalidas() {
    const [salidas, setSalidas] = useState<Salida[]>([]);
    const [loading, setLoading] = useState(true);

    async function cargarSalidas() {
        setLoading(true);

        const { data, error } = await supabase
            .from('salidas')
            .select('*')
            .order('fecha_salida', {
                ascending: false,
            })
            .range(0, 9999); // Aumentar límite de 1000 a 10000

        if (error) {
            console.error('Error cargando salidas:', error.message);
            setSalidas([]);
            setLoading(false);
            return;
        }

        setSalidas(data || []);
        setLoading(false);
    }

    async function crearSalida(salida: {
        codigo_producto: string;
        cantidad: number;
        area_destino?: string;
        numero_documento?: string;
        nota?: string;
        fecha_salida?: string;
        unidad_salida?: string;
        numero_semana?: string;
        sucursal_salida?: string;
        usuario_id?: string;
    }) {
        const fecha_salida = salida.fecha_salida || new Date().toISOString().split('T')[0];
        const numero_semana = getWeekNumber(fecha_salida);

        const { error } = await supabase
            .from('salidas')
            .insert({
                codigo_producto: salida.codigo_producto,
                cantidad: salida.cantidad,
                area_destino: salida.area_destino || null,
                numero_documento: salida.numero_documento || null,
                nota: salida.nota || null,
                fecha_salida: fecha_salida,
                unidad_salida: salida.unidad_salida || null,
                numero_semana: numero_semana,
                sucursal_salida: salida.sucursal_salida || 'Hijuelas',
                usuario_id: salida.usuario_id || null,
            });

        if (error) {
            throw error;
        }

        await cargarSalidas();
    }

    async function editarSalida(id: string, actualizaciones: Partial<Salida>) {
        // Calculate week number if fecha_salida is being updated
        const numero_semana = actualizaciones.fecha_salida
            ? getWeekNumber(actualizaciones.fecha_salida)
            : actualizaciones.numero_semana;

        const { error } = await supabase
            .from('salidas')
            .update({
                cantidad: actualizaciones.cantidad,
                area_destino: actualizaciones.area_destino,
                numero_documento: actualizaciones.numero_documento,
                nota: actualizaciones.nota,
                fecha_salida: actualizaciones.fecha_salida,
                unidad_salida: actualizaciones.unidad_salida,
                numero_semana: numero_semana,
                sucursal_salida: actualizaciones.sucursal_salida,
            })
            .eq('id', id);

        if (error) {
            throw error;
        }

        await cargarSalidas();
    }

    useEffect(() => {
        cargarSalidas();
    }, []);

    return {
        salidas,
        loading,
        cargarSalidas,
        crearSalida,
        editarSalida,
    };
}
