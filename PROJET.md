# Projet : portfolio-api

## Objectif

API autonome pour gérer les portfolios élèves (FDAP - Fiches d'Activités Pédagogiques).

## Architecture

| Composant | Technologie | Port |
|-----------|-------------|------|
| Backend | Node.js + Express + Prisma | 3001 |
| Frontend | React + Vite + Tailwind | 3000 |
| Database | PostgreSQL | 5432 |

## Infrastructure

| Serveur | IP | Usage |
|---------|-----|-------|
| dev-api (LXC 103) | 192.168.10.224 | Déploiement |

## GitHub

- **Repo :** https://github.com/rpfe26/portfolio-api
- **Branche principale :** main

## Structure

```
portfolio-api/
├── backend/           # API REST
│   ├── src/
│   ├── prisma/        # Schéma BDD
│   └── uploads/      # Fichiers
├── frontend/          # Interface React
│   └── src/
│       └── styles/    # Design FDAP (réutilisé)
└── docs/              # Documentation
```

## Commandes

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Déploiement

```bash
# Sur dev-api (LXC 103)
ssh root@192.168.10.102 "pct exec 103 -- bash -c 'cd /opt/portfolio-api && git pull && npm install && npx prisma migrate deploy && pm2 restart all'"
```

## État actuel

- [x] Repo GitHub créé
- [x] Structure backend/frontend
- [x] Schéma Prisma (User, Fdap, Media)
- [x] Design CSS réutilisé du plugin FDAP
- [ ] Backend API REST
- [ ] Frontend React
- [ ] Authentification
- [ ] Déploiement sur dev-api

---

*Dernière mise à jour : 2026-03-16*