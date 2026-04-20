"use client";

import { motion } from "framer-motion";


export default function GeneralSettings() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Général</h1>
                <p className="text-slate-400">Gérez les informations de base de votre institution.</p>
            </div>

            <div className="glass-card p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Nom de l'institution</label>
                        <input
                            type="text"
                            placeholder="Ex: Banque Centrale de Crédit"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Slug / URL</label>
                        <input
                            type="text"
                            placeholder="banque-credit"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <textarea
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Décrivez brièvement votre institution..."
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button className="btn-premium">Sauvegarder les modifications</button>
                </div>
            </div>

            <div className="glass-card p-8 border-red-500/20">
                <h3 className="text-lg font-bold text-red-500 mb-2">Zone de danger</h3>
                <p className="text-slate-400 mb-6">La suppression de l'organisation est irréversible. Toutes les données seront perdues.</p>
                <button className="px-6 py-2.5 border border-red-500/50 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
                    Supprimer l'organisation
                </button>
            </div>
        </div>
    );
}
