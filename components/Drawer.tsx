'use client';

import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function Drawer({
    isOpen,
    onClose,
    title,
    description,
    children,
}: DrawerProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full md:max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-sm text-slate-500 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </>
    );
}
