'use client';

import ProductoForm from './components/ProductoForm';
import ProductosTable from './components/ProductosTable';

import { useProductos } from '@/hooks/useProductos';

export default function ProductosPage() {
    const {
        productos,
        loading,
        crearProducto,
        editarProducto,
    } = useProductos();

    return (
        <div className="grid grid-cols-12 gap-6">

            <div className="col-span-12 lg:col-span-4">
                <ProductoForm
                    crearProducto={crearProducto}
                />
            </div>

            <div className="col-span-12 lg:col-span-8">
                <ProductosTable
                    productos={productos}
                    loading={loading}
                    onEditarProducto={editarProducto}
                />
            </div>

        </div>
    );
}