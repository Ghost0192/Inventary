'use client';

import SalidaForm from './components/SalidaForm';
import SalidasTable from './components/SalidasTable';
import { useSalidas } from '@/hooks/useSalidas';

export default function SalidasPage() {
    const {
        salidas,
        loading,
        crearSalida,
        editarSalida,
    } = useSalidas();

    return (
        <div className="flex flex-col lg:flex-row gap-4">

            <div className="w-full lg:w-[30%]">
                <SalidaForm
                    crearSalida={crearSalida}
                />
            </div>

            <div className="w-full lg:w-[70%]">
                <SalidasTable
                    salidas={salidas}
                    loading={loading}
                    onEditarSalida={editarSalida}
                />
            </div>

        </div>
    );
}
