'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Users, 
  Shield, 
  Plus, 
  Search,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  X,
  RefreshCw,
  Settings2,
  Sliders,
  Check,
  Ban,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<any>(null);

  // New user form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Override Editor State: Map of permissionId -> 'INHERIT' | 'ALLOW' | 'DENY'
  const [overrideMap, setOverrideMap] = useState<Record<string, 'INHERIT' | 'ALLOW' | 'DENY'>>({});
  const [savingOverrides, setSavingOverrides] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, permsData] = await Promise.all([
        api.getUsers().catch(() => []),
        api.getRoles().catch(() => []),
        api.getPermissions().catch(() => []),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setAllPermissions(permsData);
      if (rolesData.length > 0) setRoleId(rolesData[0].id);
    } catch (err) {
      console.error('Failed to load user management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openOverrideEditor = (user: any) => {
    setSelectedUserForOverride(user);
    const map: Record<string, 'INHERIT' | 'ALLOW' | 'DENY'> = {};

    // Initialiser chaque permission du catalogue
    for (const p of allPermissions) {
      const userOverride = user.overrides?.find((o: any) => o.permissionId === p.id);
      if (userOverride) {
        map[p.id] = userOverride.type; // 'ALLOW' | 'DENY'
      } else {
        map[p.id] = 'INHERIT';
      }
    }
    setOverrideMap(map);
  };

  const handleSaveOverrides = async () => {
    if (!selectedUserForOverride) return;

    try {
      setSavingOverrides(true);
      const overridesToSave: Array<{ permissionId: string; type: 'ALLOW' | 'DENY' }> = [];

      Object.entries(overrideMap).forEach(([permId, type]) => {
        if (type === 'ALLOW' || type === 'DENY') {
          overridesToSave.push({ permissionId: permId, type });
        }
      });

      await api.updateUserOverrides(selectedUserForOverride.id, overridesToSave);
      alert('Matrice HRBAC mise à jour avec succès !');
      setSelectedUserForOverride(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde des overrides');
    } finally {
      setSavingOverrides(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createUser({ name, email, phone, roleId: roleId || undefined });
      setShowCreateModal(false);
      setName('');
      setEmail('');
      setPhone('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de l’utilisateur');
    } finally {
      setSubmitting(false);
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
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Accès & Sécurité HRBAC</h2>
              <p className="text-gray-500 text-sm mt-1">
                Architecture Hybride : Rôles institutionnels + Permissions CRUD + Overrides individuels (Allow / Deny)
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-semibold"
              >
                <Plus size={18} /> Nouvel Utilisateur
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Utilisateurs</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{users.length}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rôles Définis</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{roles.length}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catalogue Permissions</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{allPermissions.length}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overrides Actifs (RPBAC+)</p>
              <h3 className="text-2xl font-bold text-orange-500 mt-1">
                {users.reduce((acc, u) => acc + (u.overrides?.length || 0), 0)}
              </h3>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                  <tr>
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Identifiants</th>
                    <th className="px-6 py-4">Rôle Principal</th>
                    <th className="px-6 py-4">Overrides Individuels</th>
                    <th className="px-6 py-4 text-right">Contrôle Accès</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Chargement des comptes utilisateurs...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucun utilisateur enregistré.</td>
                    </tr>
                  ) : (
                    users.map(user => {
                      const userAllows = user.userAllows || [];
                      const userDenies = user.userDenies || [];

                      return (
                        <tr key={user.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                {user.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name || 'Utilisateur'}</p>
                                <p className="text-[10px] text-gray-400 font-mono">ID: {user.id.slice(0, 10)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                <Mail size={12} className="text-gray-400" /> {user.email}
                              </p>
                              {user.phone && (
                                <p className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                  <Phone size={12} className="text-gray-400" /> {user.phone}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-bold">
                              {user.role?.name || 'Viewer'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {userAllows.length === 0 && userDenies.length === 0 ? (
                                <span className="text-[10px] text-gray-400 italic">Hérite 100% du rôle</span>
                              ) : (
                                <>
                                  {userAllows.map((perm: string) => (
                                    <span key={perm} className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                                      + {perm}
                                    </span>
                                  ))}
                                  {userDenies.map((perm: string) => (
                                    <span key={perm} className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                                      - {perm}
                                    </span>
                                  ))}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openOverrideEditor(user)}
                              className="px-3.5 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-700 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200 rounded-lg font-bold transition-all inline-flex items-center gap-1.5"
                            >
                              <Sliders size={14} /> Éditeur Overrides
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Création Utilisateur (Admin uniquement) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold">Créer un Compte Utilisateur</h3>
                <p className="text-xs text-gray-500">Connexion passwordless par OTP (SMS ou Email)</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-gray-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Jean Stock"
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Professionnel</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@creditguard.com"
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone (SMS OTP)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243 812 345 678"
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rôle Principal</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.description})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  Créer Compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Éditeur d'Overrides Individuels (HRBAC / RPBAC+) */}
      {selectedUserForOverride && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black">{selectedUserForOverride.name}</h3>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    Rôle : {selectedUserForOverride.role?.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ajustez les permissions individuelles. Priorité : 1. Deny | 2. Allow | 3. Rôle | 4. Default Deny
                </p>
              </div>
              <button onClick={() => setSelectedUserForOverride(null)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Permission Matrix */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2 custom-scrollbar">
              {allPermissions.map((perm) => {
                const isInheritedFromRole = selectedUserForOverride.role?.permissions?.some(
                  (rp: any) => rp.permission?.name === perm.name
                );
                const currentSetting = overrideMap[perm.id] || 'INHERIT';

                // Calcul du statut résolu final
                let finalAccess = false;
                if (currentSetting === 'DENY') finalAccess = false;
                else if (currentSetting === 'ALLOW') finalAccess = true;
                else finalAccess = isInheritedFromRole;

                return (
                  <div
                    key={perm.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      currentSetting === 'DENY' 
                        ? 'bg-red-50/40 border-red-200 dark:bg-red-950/20 dark:border-red-900' 
                        : currentSetting === 'ALLOW' 
                        ? 'bg-green-50/40 border-green-200 dark:bg-green-950/20 dark:border-green-900' 
                        : 'bg-gray-50/50 border-gray-200 dark:bg-slate-800/40 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                          {perm.name}
                        </span>
                        {isInheritedFromRole && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded">
                            Hérité du Rôle
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          finalAccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {finalAccess ? '✔️ Accordé' : '❌ Refusé'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">{perm.description}</p>
                    </div>

                    {/* 3-State Override Selector */}
                    <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 shrink-0">
                      <button
                        type="button"
                        onClick={() => setOverrideMap({ ...overrideMap, [perm.id]: 'INHERIT' })}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentSetting === 'INHERIT'
                            ? 'bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        Hériter
                      </button>
                      <button
                        type="button"
                        onClick={() => setOverrideMap({ ...overrideMap, [perm.id]: 'ALLOW' })}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                          currentSetting === 'ALLOW'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40'
                        }`}
                      >
                        <Check size={12} /> Allow
                      </button>
                      <button
                        type="button"
                        onClick={() => setOverrideMap({ ...overrideMap, [perm.id]: 'DENY' })}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                          currentSetting === 'DENY'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                        }`}
                      >
                        <Ban size={12} /> Deny
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 shrink-0">
              <span className="text-xs text-gray-500">
                {Object.values(overrideMap).filter(v => v !== 'INHERIT').length} override(s) personnalisé(s) configuré(s)
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForOverride(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={savingOverrides}
                  onClick={handleSaveOverrides}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {savingOverrides ? 'Sauvegarde...' : 'Appliquer & Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
