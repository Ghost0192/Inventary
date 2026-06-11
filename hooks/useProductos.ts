'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Producto {
    id: string;
    codigo_producto: string;
    nombre_prod: string;
    descripcion: string | null;
    categoria: string | null;
    unidad_medida: string | null;
    stock_minimo: number | null;
    tipo_inventario: string | null;
    cuenta_contable: string | null;
    activo: boolean;
    ranking_notas: string | null;
    fecha_creacion: string;
    fecha_actualizacion?: string;
    usuario_creacion_id: string | null;
}

export function useProductos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    async function cargarProductos() {
        setLoading(true);

        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .order('fecha_creacion', {
                ascending: false,
            })
            .range(0, 9999); // Aumentar límite de 1000 a 10000

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        setProductos(data || []);
        setLoading(false);
    }

    async function crearProducto(producto: {
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
    }) {
        // Generar código temporal hasta que el trigger funcione
        const codigoTemporal = `PROD-${Date.now()}`;

        const { error } = await supabase
            .from('productos')
            .insert({
                codigo_producto: codigoTemporal,
                nombre_prod: producto.nombre_prod,
                descripcion: producto.descripcion || null,
                categoria: producto.categoria || null,
                unidad_medida: producto.unidad_medida || null,
                stock_minimo: producto.stock_minimo || 0,
                tipo_inventario: producto.tipo_inventario || null,
                cuenta_contable: producto.cuenta_contable || null,
                activo: producto.activo !== false,
                ranking_notas: producto.ranking_notas || null,
                usuario_creacion_id: producto.usuario_creacion_id || null,
            });

        if (error) {
            throw error;
        }

        await cargarProductos();
    }

    async function editarProducto(id: string, actualizaciones: Partial<Producto>) {
        const { error } = await supabase
            .from('productos')
            .update({
                nombre_prod: actualizaciones.nombre_prod,
                descripcion: actualizaciones.descripcion,
                categoria: actualizaciones.categoria,
                unidad_medida: actualizaciones.unidad_medida,
                stock_minimo: actualizaciones.stock_minimo,
                tipo_inventario: actualizaciones.tipo_inventario,
                cuenta_contable: actualizaciones.cuenta_contable,
                activo: actualizaciones.activo,
                ranking_notas: actualizaciones.ranking_notas,
            })
            .eq('id', id);

        if (error) {
            throw error;
        }

        await cargarProductos();
    }

    useEffect(() => {
        cargarProductos();
    }, []);

    return {
        productos,
        loading,
        cargarProductos,
        crearProducto,
        editarProducto,
    };
}