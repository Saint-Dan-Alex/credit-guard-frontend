# 🛡️ CreditGuard — Infrastructure de Crédit Intelligente

CreditGuard est une plateforme SaaS de pointe pour la gestion du cycle de vie des crédits, optimisée pour le marché africain. Elle combine scoring déterministe, workflow de décision et analytics financiers.

## 📁 Structure du Projet

- **/frontend** : Interface Next.js 14 (React, Tailwind CSS, Lucide).
- **/backend** : API REST Node.js (Express, TypeScript, Prisma).

## 🚀 Installation & Lancement

### 1. Configuration de la Base de Données
Assurez-vous d'avoir **PostgreSQL** installé.
Créez un fichier `.env` dans le dossier `/backend` :
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/creditguard?schema=public"
JWT_SECRET="votre_secret_jwt"
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Modules Implémentés
1. **Authentification & Multi-tenant** : Isolation par organisation (Banque/Microfinance).
2. **KYC & Gestion Clients** : Création de profils financiers détaillés.
3. **Moteur de Scoring** : Algorithme déterministe calculant le risque en temps réel.
4. **Workflow de Décision** : Système d'approbation automatique et manuelle.
5. **Gestion des Prêts** : Activation des contrats et suivi des remboursements.
6. **Tableau de Bord Financier** : Statistiques en temps réel (Encours, Taux de défaut, Score moyen).

## 📊 Documentation
Consultez le fichier `DOCUMENTATION_CREDITGUARD.md` pour le détail fonctionnel complet.

---
*CreditGuard — Sécuriser l'avenir du crédit en Afrique.*
