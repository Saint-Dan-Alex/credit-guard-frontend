'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Save, Bell, Shield, Building, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Paramètres Système</h2>
            <p className="text-gray-500 text-sm">Configurez votre institution et vos règles de scoring</p>
          </div>

          <div className="max-w-4xl space-y-6">
            {/* Org Settings */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building size={20} /></div>
                <h3 className="font-bold">Informations de l'Institution</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de l'Institution</label>
                  <input type="text" defaultValue="CreditGuard Microfinance" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Devise par défaut</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option>Dollars US ($)</option>
                    <option>Franc Congolais (CDF)</option>
                    <option>Franc CFA (XAF)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scoring Settings */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Shield size={20} /></div>
                <h3 className="font-bold">Règles du Moteur de Scoring</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold">Approbation Automatique</p>
                    <p className="text-xs text-gray-500">Seuil de score minimum pour approbation sans intervention humaine</p>
                  </div>
                  <input type="number" defaultValue="80" className="w-16 px-3 py-1 border border-gray-200 rounded text-center font-bold" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold">Rejet Automatique</p>
                    <p className="text-xs text-gray-500">Seuil de score en dessous duquel la demande est rejetée d'office</p>
                  </div>
                  <input type="number" defaultValue="40" className="w-16 px-3 py-1 border border-gray-200 rounded text-center font-bold" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button className="btn-primary flex items-center gap-2">
                <Save size={18} /> Sauvegarder les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
