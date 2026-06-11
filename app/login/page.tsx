'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);
        setError('');

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push('/dashboard');
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F8FF] to-[#EEF8FF]" />

            {/* Blob 1 */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#DCEBFF] rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" />

            {/* Blob 2 */}
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#CFF8F2] rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4">

                <div
                    className="
                    bg-white/20
                    backdrop-blur-[30px]
                    border
                    border-white/40
                    rounded-3xl
                    p-10
                    shadow-2xl
                    "
                >
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-white/30
                            border
                            border-white/50
                            flex
                            items-center
                            justify-center
                            "
                        >
                            <Package
                                size={30}
                                className="text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-light text-slate-900">
                            Inventary
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Gestión inteligente de inventario
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            className="
                            w-full
                            px-5
                            py-4
                            rounded-full
                            bg-white/20
                            border
                            border-white/40
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#2A7933]/30
                            text-slate-800
                            placeholder:text-slate-500
                            "
                        />

                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                                className="
                                w-full
                                px-5
                                py-4
                                rounded-full
                                bg-white/20
                                border
                                border-white/40
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#2A7933]/30
                                text-slate-800
                                placeholder:text-slate-500
                                "
                            />

                            <button
                                type="button"
                                className="
                                absolute
                                right-5
                                top-1/2
                                -translate-y-1/2
                                text-xs
                                text-slate-500
                                hover:text-slate-700
                                "
                            >
                                ¿Olvidaste?
                            </button>
                        </div>

                        {error && (
                            <div
                                className="
                                text-sm
                                text-red-600
                                text-center
                                "
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                            w-full
                            py-4
                            rounded-full
                            bg-gradient-to-r
                            from-[#2A7933]
                            to-[#1F5225]
                            text-white
                            font-medium
                            shadow-lg
                            hover:scale-[1.02]
                            transition-all
                            duration-300
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            "
                        >
                            {loading
                                ? 'Ingresando...'
                                : 'Iniciar sesión'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            Multi-Sucursal • QR • Código de Barras • Reportes
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-600">
                            Sistema de Inventario Empresarial
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}