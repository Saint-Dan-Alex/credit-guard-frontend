'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Filter, Download, Plus, Eye, CheckCircle, XCircle, Clock, Search, X, Calculator, Shield } from 'lucide-react';
import { api } from '@/lib/api';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState<any>(null);

    // Form state
    const [clientId, setClientId] = useState('');
    const [productId, setProductId] = useState('');
    const [amount, setAmount] = useState('5000');
    const [duration, setDuration] = useState('12');
    const [purpose, setPurpose] = useState('Achat équipement');
    const [collateralType, setCollateralType] = useState('REAL_ESTATE');
    const [collateralValue, setCollateralValue] = useState('8000');
    const [collateralDesc, setCollateralDesc] = useState('Titre de propriété parcelle');

    // Live simulation
    const [simulation, setSimulation] = useState<any>(null);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await api.getApplications({
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                search: search || undefined,
            });
            setApplications(data);
        } catch (err) {
            console.error('Failed to load applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadAuxData = async () => {
        try {
            const [clientsData, productsData] = await Promise.all([
                api.getClients(),
                api.getProducts(true),
            ]);
            setClients(clientsData);
            setProducts(productsData);
            if (clientsData.length > 0) setClientId(clientsData[0].id);
            if (productsData.length > 0) setProductId(productsData[0].id);
        } catch (err) {
            console.error('Failed to load clients/products:', err);
        }
    };

    useEffect(() => {
        loadApplications();
        loadAuxData();
    }, [statusFilter]);

    useEffect(() => {
        // Run live simulation whenever amount or duration changes
        const selectedProd = products.find(p => p.id === productId);
        const rate = selectedProd ? selectedProd.interestRate : 12.0;
        const numAmount = parseFloat(amount) || 0;
        const numDur = parseInt(duration) || 12;

        if (numAmount > 0 && numDur > 0) {
            api.simulateLoan({
                amount: numAmount,
                duration: numDur,
                interestRate: rate,
            }).then(setSimulation).catch(() => setSimulation(null));
        }
    }, [amount, duration, productId, products]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadApplications();
    };

    const handleCreateApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createApplication({
                clientId,
                productId: productId || undefined,
                amount: parseFloat(amount),
                duration: parseInt(duration),
                purpose,
                collaterals: collateralValue && parseFloat(collateralValue) > 0 ? [
                    {
                        type: collateralType,
                        description: collateralDesc,
                        estimatedValue: parseFloat(collateralValue),
                    }
                ] : [],
            });

            setShowModal(false);
            loadApplications();
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la création');
        }
    };

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Demandes de Prêt</h2>
                            <p className="text-gray-500 text-sm">Origination et scoring IA des dossiers de crédit</p>
                        </div>
                        <div className="flex gap-3">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm"
                                />
                            </form>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm"
                            >
                                <option value="ALL">Tous les statuts</option>
                                <option value="SUBMITTED">Soumis</option>
                                <option value="UNDER_REVIEW">En Analyse</option>
                                <option value="APPROVED">Approuvé</option>
                                <option value="REJECTED">Refusé</option>
                                <option value="DISBURSED">Décaissé</option>
                            </select>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Plus size={16} /> Nouvelle Demande
                            </button>
                        </div>
                    </div>

                    <div className="card !p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">ID Dossier</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Durée</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Score Risk</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Chargement des dossiers...</td>
                                        </tr>
                                    ) : applications.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Aucun dossier trouvé.</td>
                                        </tr>
                                    ) : (
                                        applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                                <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                                                    {app.applicationNo || app.id.slice(0, 8)}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                    {app.client?.firstName} {app.client?.lastName}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                                    ${app.amount?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{app.duration} mois</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`font-bold ${(app.scoring?.score || 50) >= 75 ? 'text-green-600' : (app.scoring?.score || 50) >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                            {app.scoring?.score || 50}/100
                                                        </span>
                                                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                            <div 
                                                                className={`h-full ${(app.scoring?.score || 50) >= 75 ? 'bg-green-500' : (app.scoring?.score || 50) >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} 
                                                                style={{ width: `${app.scoring?.score || 50}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={app.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => setSelectedApp(app)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                                                        title="Voir les détails"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nouvelle Demande */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-bold">Nouvelle Demande de Crédit</h3>
                                <p className="text-sm text-gray-500">Saisie et scoring instantané du dossier</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateApplication} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Emprunteur</label>
                                    <select
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    >
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.phone})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Produit de Crédit</label>
                                    <select
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                    >
                                        <option value="">Produit standard (12%)</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.interestRate}%/an)</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Montant Demandé ($)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Durée (Mois)</label>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Objet du Financement</label>
                                <input
                                    type="text"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Ex: Financement stock commerce"
                                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                />
                            </div>

                            {/* Section Garantie */}
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5">
                                    <Shield size={14} /> Garantie / Collateral (Optionnel)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">Type de Garantie</label>
                                        <select
                                            value={collateralType}
                                            onChange={(e) => setCollateralType(e.target.value)}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs"
                                        >
                                            <option value="REAL_ESTATE">Immobilier / Foncier</option>
                                            <option value="VEHICLE">Véhicule</option>
                                            <option value="EQUIPMENT">Équipement / Matériel</option>
                                            <option value="PERSONAL_GUARANTEE">Caution Personnelle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">Valeur Estimée ($)</label>
                                        <input
                                            type="number"
                                            value={collateralValue}
                                            onChange={(e) => setCollateralValue(e.target.value)}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={collateralDesc}
                                            onChange={(e) => setCollateralDesc(e.target.value)}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Live Simulation Preview */}
                            {simulation && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-600 text-white rounded-lg">
                                            <Calculator size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Mensualité Estimée</p>
                                            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">${simulation.monthlyPayment?.toLocaleString()} / mois</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-gray-500">
                                        <p>Total Intérêts: <strong className="text-gray-900 dark:text-white">${simulation.totalInterest?.toLocaleString()}</strong></p>
                                        <p>Montant Global: <strong className="text-gray-900 dark:text-white">${simulation.totalAmount?.toLocaleString()}</strong></p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
                                >
                                    Calculer Scoring & Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails Dossier & Scoring XAI */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-bold">Détails du Dossier {selectedApp.applicationNo}</h3>
                                <p className="text-sm text-gray-500">Emprunteur : {selectedApp.client?.firstName} {selectedApp.client?.lastName}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs uppercase tracking-widest font-bold text-blue-300">Résultat Scoring IA</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedApp.scoring?.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        Risque {selectedApp.scoring?.riskLevel || 'Modéré'}
                                    </span>
                                </div>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-5xl font-extrabold">{selectedApp.scoring?.score || 50}</span>
                                    <span className="text-slate-400 text-lg mb-1">/ 100</span>
                                </div>
                                <p className="text-sm text-slate-300">{selectedApp.scoring?.recommendation || 'Dossier en attente de validation analyste.'}</p>
                            </div>

                            {/* Facteurs XAI */}
                            {selectedApp.scoring?.factors && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Facteurs Déterminants (XAI)</h4>
                                    <div className="space-y-2">
                                        {selectedApp.scoring.factors.positiveDrivers?.map((pos: string, idx: number) => (
                                            <div key={idx} className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 rounded-xl text-xs flex items-center gap-2">
                                                <CheckCircle size={14} className="shrink-0 text-green-600" />
                                                <span>{pos}</span>
                                            </div>
                                        ))}
                                        {selectedApp.scoring.factors.riskAlerts?.map((alert: string, idx: number) => (
                                            <div key={idx} className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
                                                <XCircle size={14} className="shrink-0 text-red-600" />
                                                <span>{alert}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <a
                                    href="/applications/tasks"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
                                >
                                    Passer en Comité de Décision →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        APPROVED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={10} />, label: 'Approuvé' },
        SUBMITTED: { color: 'bg-blue-100 text-blue-700', icon: <Clock size={10} />, label: 'Soumis' },
        UNDER_REVIEW: { color: 'bg-orange-100 text-orange-700', icon: <Clock size={10} />, label: 'En Analyse' },
        REJECTED: { color: 'bg-red-100 text-red-700', icon: <XCircle size={10} />, label: 'Refusé' },
        DISBURSED: { color: 'bg-purple-100 text-purple-700', icon: <CheckCircle size={10} />, label: 'Décaissé' },
    };

    const { color, icon, label } = config[status] || { color: 'bg-gray-100 text-gray-700', icon: null, label: status };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
            {icon}
            {label}
        </span>
    );
}
