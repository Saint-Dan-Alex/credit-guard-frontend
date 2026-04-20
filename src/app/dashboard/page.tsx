export default function DashboardPage() {
  return (
    <div className="p-12 space-y-8">
      <h1 className="text-4xl font-bold bg-premium-gradient bg-clip-text text-transparent inline-block">
        CreditGuard Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-slate-400 text-sm mb-1">Crédits Actifs</p>
          <p className="text-3xl font-bold">1,250</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-400 text-sm mb-1">Taux de Défaut</p>
          <p className="text-3xl font-bold text-green-500">3.2%</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-400 text-sm mb-1">Portefeuille Total</p>
          <p className="text-3xl font-bold">$4.5M</p>
        </div>
      </div>

      <div className="glass-card p-8 h-64 flex items-center justify-center border-dashed border-white/10">
        <p className="text-slate-500">Analyse de risque en temps réel...</p>
      </div>
    </div>
  );
}
