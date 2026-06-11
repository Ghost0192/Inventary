'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Usuario {
    auth_uid: string;
    correo: string;
    nombre: string;
    apellido: string;
    rol: string;
    sucursal: string | null;
    bodega: string | null;
    activo: boolean;
}

export function useAuth() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarUsuario() {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('auth_uid', user.id)
                    .single();

                if (error) {
                    console.error(error);
                    return;
                }

                setUsuario(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        cargarUsuario();
    }, []);

    return {
        usuario,
        loading,
    };
}