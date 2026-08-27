'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  ArrowUpRight, 
  Plus, 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { api } from '@/lib/api';

export default function LoansPage() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [showRepayModal, setShowRepayModal] = useState(false);
    const [targetLoan, setTargetLoan] = useState<any>(null);

    // Repayment form
    const [repayAmount, setRepayAmount] = useState('');
    const [repayMethod, setRepayMethod] = useState('MOBILE_MONEY');
    const [transRef, setTransRef] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    // Restructuring form
    const [showRestructureModal, setShowRestructureModal] = useState(false);
    const [restructureLoanTarget, setRestructureLoanTarget] = useState<any>(null);
    const [newDuration, setNewDuration] = useState('18');
    const [newRate, setNewRate] = useState('12.0');
    const [restructureMethod, setRestructureMethod] = useState('CONSTANT_ANNUITY');
    const [restructureReason, setRestructureReason] = useState('');
    const [restructuring, setRestructuring] = useState(false);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const data = await api.getLoans(statusFilter !== 'ALL' ? statusFilter : undefined);
            setLoans(data);
        } catch (err) {
            console.error('Failed to load loans:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadLoanDetails = async (id: string) => {
        try {
            const details = await api.getLoanById(id);
            setSelectedLoan(details);
        } catch (err) {
            console.error('Failed to load loan details:', err);
        }
    };

    useEffect(() => {
        loadLoans();
    }, [statusFilter]);

    const handleRepayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetLoan || !repayAmount) return;

        try {
            setProcessing(true);
            await api.createRepayment({
                loanId: targetLoan.id,
                amount: parseFloat(repayAmount),
                method: repayMethod,
                transactionRef: transRef,
                notes,
            });

            alert('Paiement enregistré et imputé sur les échéances avec succès !');
            setShowRepayModal(false);
            setRepayAmount('');
            setTransRef('');
            await loadLoans();
            if (selectedLoan?.id === targetLoan.id) {
                await loadLoanDetails(targetLoan.id);
            }
        } catch (err: any) {
            alert(err.message || 'Erreur lors de l’enregistrement du remboursement');
        } finally {
            setProcessing(false);
        }
    };

    const handleRestructure = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!restructureLoanTarget) return;

        try {
            setRestructuring(true);
            await api.restructureLoan(restructureLoanTarget.id, {
                newDurationMonths: parseInt(newDuration),
                newInterestRate: parseFloat(newRate),
                amortizationType: restructureMethod,
                reason: restructureReason || 'Allongement de maturité convenu',
            });

            alert('Le crédit a été restructuré avec succès et le nouvel échéancier est actif.');
            setShowRestructureModal(false);
            await loadLoans();
        } catch (err: any) {
            alert(err.message || 'Échec de la restructuration du crédit');
        } finally {
            setRestructuring(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Portefeuille des Prêts & Restructuration</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Suivi des encours, recalcul d'échéanciers d'amortissement, encaissements et rééchelonnements
                            </p>
                        </div>
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
                            {['ALL', 'ACTIVE', 'OVERDUE', 'RESTRUCTURED', 'PAID'].map((st) => (
                                <button 
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        statusFilter === st 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'text-gray-500 hover:text-blue-600'
                                    }`}
                                >
                                    {st === 'ALL' ? 'Tous' : st === 'ACTIVE' ? 'Actifs' : st === 'OVERDUE' ? 'En Retard' : st === 'RESTRUCTURED' ? 'Restructurés' : 'Soldés'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Chargement des prêts en cours...</div>
                        ) : loans.length === 0 ? (
                            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-800 text-gray-400">
                                Aucun prêt trouvé avec ces critères.
                            </div>
                        ) : (
                            loans.map(loan => {
                                const totalPaid = loan.paidPrincipal + loan.paidInterest + loan.paidPenalties;
                                const progressPct = loan.amount > 0 ? Math.min(100, Math.round((loan.paidPrincipal / loan.amount) * 100)) : 0;

                                return (
                                    <div key={loan.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-xl">
                                                    {loan.loanNumber}
                                                </span>
                                                <h3 className="text-base font-black truncate">
                                                    {loan.client?.firstName} {loan.client?.lastName}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    loan.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    loan.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                    loan.status === 'RESTRUCTURED' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {loan.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Produit : <strong>{loan.product?.name || 'Crédit Standard'}</strong> • Taux : {loan.interestRate}%/an • Échéance finale : {new Date(loan.endDate).toLocaleDateString()}
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-gray-400">Capital Amorti : ${loan.paidPrincipal?.toLocaleString()}</span>
                                                    <span className="text-blue-600">{progressPct}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPct}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-8 shrink-0">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Restant Dû</p>
                                                <p className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                                                    ${loan.remainingPrincipal?.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Total Prêt : ${loan.amount?.toLocaleString()}</p>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => { setTargetLoan(loan); setRepayAmount(String(loan.installments?.[0]?.totalDue || 500)); setShowRepayModal(true); }}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-green-600/20 active:scale-95 transition-all"
                                                >
                                                    Payer / Encaisser
                                                </button>
                                                <button
                                                    onClick={() => { setRestructureLoanTarget(loan); setShowRestructureModal(true); }}
                                                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <RotateCcw size={12} /> Restructurer
                                                </button>
                                                <button
                                                    onClick={() => loadLoanDetails(loan.id)}
                                                    className="px-4 py-1.5 text-gray-500 hover:text-gray-800 text-xs font-bold underline"
                                                >
                                                    Voir Échéancier
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Restructuration de Prêt */}
            {showRestructureModal && restructureLoanTarget && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-black text-purple-700 dark:text-purple-400 flex items-center gap-2">
                                    <RotateCcw size={18} /> Restructuration Financière
                                </h3>
                                <p className="text-xs text-gray-500">Prêt {restructureLoanTarget.loanNumber} • Capital restant : ${restructureLoanTarget.remainingPrincipal?.toLocaleString()}</p>
                            </div>
                            <button onClick={() => setShowRestructureModal(false)} className="p-1.5 text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleRestructure} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nouvelle Durée (Mois)</label>
                                <input
                                    type="number"
                                    value={newDuration}
                                    onChange={(e) => setNewDuration(e.target.value)}
                                    min="3"
                                    max="60"
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nouveau Taux d'Intérêt Annuel (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={newRate}
                                    onChange={(e) => setNewRate(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mode d'Amortissement</label>
                                <select
                                    value={restructureMethod}
                                    onChange={(e) => setRestructureMethod(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                >
                                    <option value="CONSTANT_ANNUITY">Annuités Constantes (Standard)</option>
                                    <option value="LINEAR">Amortissement Linéaire (Capital Constant)</option>
                                    <option value="FLAT">Taux Fixe / Flat</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Motif du Rééchelonnement</label>
                                <textarea
                                    value={restructureReason}
                                    onChange={(e) => setRestructureReason(e.target.value)}
                                    placeholder="Ex: Difficultés temporaires de trésorerie, accord amiable de prolongation..."
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRestructureModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={restructuring}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                                >
                                    {restructuring ? 'Recalcul...' : 'Valider la Restructuration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Enregistrement de Paiement */}
            {showRepayModal && targetLoan && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">Enregistrer un Remboursement</h3>
                                <p className="text-xs text-gray-500">Prêt {targetLoan.loanNumber} • {targetLoan.client?.firstName} {targetLoan.client?.lastName}</p>
                            </div>
                            <button onClick={() => setShowRepayModal(false)} className="p-1.5 text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleRepayment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Montant Encaissé ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={repayAmount}
                                    onChange={(e) => setRepayAmount(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-base font-black text-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Moyen de Paiement</label>
                                <select
                                    value={repayMethod}
                                    onChange={(e) => setRepayMethod(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                >
                                    <option value="MOBILE_MONEY">Mobile Money (M-Pesa / Orange / Airtel)</option>
                                    <option value="BANK_TRANSFER">Virement Bancaire</option>
                                    <option value="CASH">Espèces / Guichet</option>
                                    <option value="CHEQUE">Chèque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Référence Transaction</label>
                                <input
                                    type="text"
                                    placeholder="Ex: MPESA-TX-9849204"
                                    value={transRef}
                                    onChange={(e) => setTransRef(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notes / Observations</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Échéance Mai 2026 reçue par agent terrain"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRepayModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                                >
                                    Valider l'Encaissement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Échéancier Complet */}
            {selectedLoan && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-black">Échéancier d'Amortissement — {selectedLoan.loanNumber}</h3>
                                <p className="text-xs text-gray-500 mt-1">Client : {selectedLoan.client?.firstName} {selectedLoan.client?.lastName} | Capital : ${selectedLoan.amount?.toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedLoan(null)} className="p-2 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 dark:bg-slate-800 uppercase tracking-wider font-bold text-gray-400 text-[10px]">
                                    <tr>
                                        <th className="p-3">N°</th>
                                        <th className="p-3">Date d'Échéance</th>
                                        <th className="p-3">Capital Dû</th>
                                        <th className="p-3">Intérêts</th>
                                        <th className="p-3">Pénalités</th>
                                        <th className="p-3">Total Dû</th>
                                        <th className="p-3">Total Payé</th>
                                        <th className="p-3">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {selectedLoan.installments?.map((inst: any) => (
                                        <tr key={inst.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-bold">{inst.installmentNumber}</td>
                                            <td className="p-3">{new Date(inst.dueDate).toLocaleDateString()}</td>
                                            <td className="p-3">${inst.principalDue?.toLocaleString()}</td>
                                            <td className="p-3">${inst.interestDue?.toLocaleString()}</td>
                                            <td className="p-3 text-red-600">${inst.penaltyDue?.toLocaleString()}</td>
                                            <td className="p-3 font-bold text-gray-900 dark:text-white">${inst.totalDue?.toLocaleString()}</td>
                                            <td className="p-3 font-bold text-green-600">${inst.totalPaid?.toLocaleString()}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inst.status === 'PAID' ? 'bg-green-100 text-green-700' : inst.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {inst.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
