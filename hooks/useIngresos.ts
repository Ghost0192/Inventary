'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Ingreso {
    id: string;
    codigo_producto: string;
    cantidad: number;
    marca: string | null;
    origen: string | null;
    proveedor: string | null;
    fecha_caducidad: string | null;
    bodega: string | null;
    usuario_id: string | null;
    fecha_registro: string;
    nota: string | null;
    fecha_recepcion: string;
}

export function useIngresos() {
    const [ingresos, setIngresos] = useState<Ingreso[]>([]);
    const [loading, setLoading] = useState(true);

    async function cargarIngresos() {
        setLoading(true);

        const { data, error } = await supabase
            .from('ingresos')
            .select('*')
            .order('fecha_recepcion', {
                ascending: false,
            })
            .range(0, 9999); // Aumentar límite de 1000 a 10000

        if (error) {
            console.error('Error cargando ingresos:', error.message);
            setIngresos([]);
            setLoading(false);
            return;
        }

        setIngresos(data || []);
        setLoading(false);
    }

    async function crearIngreso(ingreso: {
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
    }) {
        const { error } = await supabase
            .from('ingresos')
            .insert({
                codigo_producto: ingreso.codigo_producto,
                cantidad: ingreso.cantidad,
                marca: ingreso.marca || null,
                origen: ingreso.origen || null,
                proveedor: ingreso.proveedor || null,
                fecha_caducidad: ingreso.fecha_caducidad || null,
                bodega: ingreso.bodega || null,
                nota: ingreso.nota || null,
                fecha_recepcion: ingreso.fecha_recepcion || new Date().toISOString().split('T')[0],
                usuario_id: ingreso.usuario_id || null,
            });

        if (error) {
            throw error;
        }

        await cargarIngresos();
    }

    async function editarIngreso(id: string, actualizaciones: Partial<Ingreso>) {
        const { error } = await supabase
            .from('ingresos')
            .update({
                cantidad: actualizaciones.cantidad,
                marca: actualizaciones.marca,
                origen: actualizaciones.origen,
                proveedor: actualizaciones.proveedor,
                fecha_caducidad: actualizaciones.fecha_caducidad,
                bodega: actualizaciones.bodega,
                nota: actualizaciones.nota,
                fecha_recepcion: actualizaciones.fecha_recepcion,
            })
            .eq('id', id);

        if (error) {
            throw error;
        }

        await cargarIngresos();
    }

    useEffect(() => {
        cargarIngresos();
    }, []);

    return {
        ingresos,
        loading,
        cargarIngresos,
        crearIngreso,
        editarIngreso,
    };
}
