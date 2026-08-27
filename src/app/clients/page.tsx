'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { UserPlus, Mail, Phone, MapPin, ExternalLink, ShieldCheck, Search, X, Briefcase, Building } from 'lucide-react';
import { api } from '@/lib/api';

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    // New Client Form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('Kinshasa');
    const [country, setCountry] = useState('RDC');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [occupation, setOccupation] = useState('');
    const [employer, setEmployer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await api.getClients(search || undefined);
            setClients(data);
        } catch (err) {
            console.error('Failed to load clients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadClients();
    };

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.createClient({
                firstName,
                lastName,
                email,
                phone,
                city,
                country,
                monthlyIncome: parseFloat(monthlyIncome),
                occupation,
                employer,
            });

            setShowModal(false);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setMonthlyIncome('');
            setOccupation('');
            setEmployer('');
            await loadClients();
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la création du client');
        } finally {
            setSubmitting(false);
        }
    };

    const viewClientDetails = async (id: string) => {
        try {
            const data = await api.getClientById(id);
            setSelectedClient(data);
        } catch (err) {
            console.error('Failed to load client details:', err);
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
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Annuaire Clients & KYC</h2>
                            <p className="text-gray-500 text-sm">Référentiel des emprunteurs et solvabilité</p>
                        </div>
                        <div className="flex gap-3">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher nom, téléphone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm"
                                />
                            </form>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <UserPlus size={16} /> Nouveau Client
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-3 text-center p-8 text-gray-400">Chargement des clients...</div>
                        ) : clients.length === 0 ? (
                            <div className="col-span-3 text-center p-8 text-gray-500">Aucun client enregistré.</div>
                        ) : (
                            clients.map((client) => (
                                <div 
                                    key={client.id} 
                                    onClick={() => viewClientDetails(client.id)}
                                    className="card group relative hover:border-blue-400 dark:hover:border-blue-800 transition-all cursor-pointer"
                                >
                                    <div className="absolute top-4 right-4 text-blue-500">
                                        <ExternalLink size={14} />
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 font-bold text-xl">
                                            {client.firstName?.[0] || 'C'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{client.firstName} {client.lastName}</h4>
                                            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{client.id.slice(0, 10)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {client.email && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail size={14} /> {client.email}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Phone size={14} /> {client.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MapPin size={14} /> {client.city || 'Ville non spécifiée'}, {client.country || 'RDC'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="text-xs">
                                            <span className="text-gray-400 block mb-1 uppercase tracking-tighter">Revenu Mensuel</span>
                                            <span className="font-bold text-gray-900 dark:text-white">${client.monthlyIncome?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-400 block mb-1 uppercase tracking-tighter text-[10px]">Dossiers Associés</span>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                                                {client._count?.applications || 0} demande(s)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Nouveau Client */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold">Nouveau Profil Emprunteur (KYC)</h3>
                                <p className="text-xs text-gray-500">Enregistrez un particulier ou une entreprise</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateClient} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prénom</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="+243 812 345 678"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="emprunteur@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ville</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Revenu Mensuel ($)</label>
                                    <input
                                        type="number"
                                        value={monthlyIncome}
                                        onChange={(e) => setMonthlyIncome(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profession / Poste</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Comptable, Commerçant"
                                        value={occupation}
                                        onChange={(e) => setOccupation(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employeur / Entreprise</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Société Minière"
                                        value={employer}
                                        onChange={(e) => setEmployer(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                                >
                                    Créer le Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails Emprunteur */}
            {selectedClient && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-bold">{selectedClient.firstName} {selectedClient.lastName}</h3>
                                <p className="text-xs text-gray-500">ID: {selectedClient.id}</p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="p-1.5 text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl text-xs">
                                <div>
                                    <span className="text-gray-400 block mb-1">Téléphone</span>
                                    <span className="font-bold">{selectedClient.phone}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-1">Email</span>
                                    <span className="font-bold">{selectedClient.email || 'Non renseigné'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-1">Revenu Mensuel</span>
                                    <span className="font-bold text-green-600">${selectedClient.monthlyIncome?.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-1">Profession & Employeur</span>
                                    <span className="font-bold">{selectedClient.occupation || '-'} ({selectedClient.employer || '-'})</span>
                                </div>
                            </div>

                            {/* Historique des demandes */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Historique des Demandes</h4>
                                <div className="space-y-2">
                                    {selectedClient.applications?.length === 0 ? (
                                        <p className="text-xs text-gray-400">Aucune demande enregistrée.</p>
                                    ) : (
                                        selectedClient.applications?.map((app: any) => (
                                            <div key={app.id} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-xs flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold">{app.applicationNo || app.id.slice(0, 8)}</span>
                                                    <p className="text-[10px] text-gray-400">${app.amount?.toLocaleString()} • {app.duration} mois</p>
                                                </div>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                                                    {app.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
