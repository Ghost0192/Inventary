'use client';

import IngresoForm from './components/IngresoForm';
import IngresosTable from './components/IngresosTable';
import { useIngresos } from '@/hooks/useIngresos';

export default function IngresosPage() {
    const {
        ingresos,
        loading,
        crearIngreso,
        editarIngreso,
    } = useIngresos();

    return (
        <div className="flex flex-col lg:flex-row gap-4">

            <div className="w-full lg:w-[30%]">
                <IngresoForm
                    crearIngreso={crearIngreso}
                />
            </div>

            <div className="w-full lg:w-[70%]">
                <IngresosTable
                    ingresos={ingresos}
                    loading={loading}
                    onEditarIngreso={editarIngreso}
                />
            </div>

        </div>
    );
}
