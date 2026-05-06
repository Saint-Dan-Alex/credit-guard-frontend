'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call - in production this would call your backend /request-otp
    console.log('Requesting OTP for', identifier);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call - in production this would call /verify-otp and store the JWT
    console.log('Verifying OTP', otp);
    setTimeout(() => {
      // localStorage.setItem('token', '...');
      router.push('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 transition-transform hover:scale-110 duration-300">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">CreditGuard</h1>
            <p className="text-blue-100/60 text-sm mt-2">Authentification Sécurisée Enterprise</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Email ou Téléphone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-white transition-colors">
                    {identifier.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="admin@creditguard.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Continuer <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2 text-center">Code de vérification (OTP)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-white transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none tracking-[0.5em] text-center font-mono text-xl"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <p className="text-xs text-blue-200/50 mt-3 text-center">
                  Un code à 6 chiffres a été envoyé à <span className="text-blue-100 font-medium">{identifier}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Se connecter'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-blue-200/60 text-sm hover:text-white transition-colors text-center"
              >
                Changer d'identifiant
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-blue-200/40 uppercase tracking-widest font-semibold">
              Propulsé par CreditGuard HRBAC+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
