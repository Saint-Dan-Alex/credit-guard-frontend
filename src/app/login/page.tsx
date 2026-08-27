'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP
  const [identifier, setIdentifier] = useState('dandannykabuya@gmail.com');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [channel, setChannel] = useState<'email' | 'sms'>('email');
  const router = useRouter();

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRequestOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier) return;

    try {
      setLoading(true);
      setMessage(null);
      const res = await api.requestOTP(identifier.trim());
      setChannel(res.channel || (identifier.includes('@') ? 'email' : 'sms'));
      setMessage({
        text: res.message || `Code OTP envoyé avec succès par ${res.channel?.toUpperCase() || 'message'} !`,
        type: 'success',
      });
      setStep(2);
      setResendTimer(60);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Impossible d’envoyer le code de vérification. Vérifiez votre identifiant.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    try {
      setLoading(true);
      setMessage(null);
      const res = await api.verifyOTP(identifier.trim(), otp.trim());
      
      // Stocker le JWT
      setToken(res.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('creditguard_user', JSON.stringify(res.user));
      }

      setMessage({
        text: `Connexion réussie ! Bienvenue ${res.user?.name || ''}`,
        type: 'success',
      });

      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Code OTP invalide ou expiré.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[140px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="backdrop-blur-2xl bg-white/10 dark:bg-slate-900/60 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 mb-4 border border-white/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">CreditGuard Enterprise</h1>
            <p className="text-xs text-blue-200/80 mt-1 uppercase tracking-widest font-semibold">
              Authentification Passwordless & HRBAC
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`p-3.5 rounded-2xl mb-6 text-xs flex items-center gap-2.5 font-medium ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                : 'bg-red-500/20 text-red-200 border border-red-500/30'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
                  Email Professionnel ou N° Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-300">
                    {identifier.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ex: admin@creditguard.com ou +243816106307"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Un code sécurisé à usage unique (OTP) vous sera transmis instantanément.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Envoi du code en cours...
                  </>
                ) : (
                  <>
                    Recevoir le Code OTP <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Quick Demo Shortcuts */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center mb-2">Comptes de Démonstration HRBAC</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setIdentifier('dandannykabuya@gmail.com'); }}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-left text-blue-200 font-bold transition-all truncate"
                  >
                    👑 Super Admin<br />
                    <span className="text-[9px] font-normal text-slate-400">dandannykabuya@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIdentifier('jean.stock@creditguard.com'); }}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-left text-orange-200 font-bold transition-all truncate"
                  >
                    📦 Stock Manager (Overrides)<br />
                    <span className="text-[9px] font-normal text-slate-400">jean.stock@creditguard.com</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider">
                    Code de Sécurité (6 chiffres)
                  </label>
                  <span className="text-[10px] text-blue-300 font-semibold uppercase">
                    Canal: {channel === 'email' ? '📧 Email' : '📱 SMS'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-300">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl tracking-[0.5em] font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Vérification...
                  </>
                ) : (
                  <>
                    Vérifier & Accéder à la Plateforme <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); }}
                  className="text-blue-300 hover:text-white font-medium underline"
                >
                  Changer d'identifiant
                </button>
                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={() => handleRequestOTP()}
                  className="text-blue-300 hover:text-white font-medium disabled:text-slate-500"
                >
                  {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : 'Renvoyer le code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
