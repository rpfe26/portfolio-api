# Portfolio API

API autonome pour la gestion des portfolios élèves (FDAP - Fiches d'Activités Pédagogiques).

## 🎯 Objectifs

Permettre aux élèves de créer, modifier et gérer leurs fiches d'activités pédagogiques avec :
- Upload de médias (photos, audio, vidéo, documents)
- Compression automatique des images
- Interface moderne et responsive
- Authentification avec rôles (admin/user)

## 🏗️ Architecture

```
portfolio-api/
├── backend/                    # API REST (Node.js + Express)
│   ├── src/
│   │   ├── routes/            # Endpoints REST
│   │   │   ├── auth.js        # Authentification
│   │   │   ├── fdap.js        # CRUD FDAP
│   │   │   ├── media.js       # Upload médias
│   │   │   └── users.js       # Gestion utilisateurs (admin)
│   │   ├── models/            # Schémas Prisma
│   │   │   ├── User.prisma    # Utilisateur
│   │   │   ├── Fdap.prisma    # Fiche activité
│   │   │   └── Media.prisma   # Fichier média
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── upload.js      # Multer config
│   │   │   └── compress.js   # Sharp compression
│   │   └── utils/
│   │       ├── db.js          # Prisma client
│   │       └── helpers.js     # Fonctions utilitaires
│   ├── uploads/               # Fichiers uploadés
│   ├── prisma/
│   │   └── schema.prisma      # Schéma base de données
│   └── package.json
│
├── frontend/                   # Interface (React + Tailwind)
│   ├── src/
│   │   ├── components/        # UI Components (CVA)
│   │   │   ├── ui/            # Boutons, Inputs, Cards
│   │   │   ├── forms/         # Formulaires FDAP
│   │   │   └── layouts/        # Layouts Admin/User
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── user/          # Dashboard utilisateur
│   │   │   └── admin/         # Dashboard admin
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/
│   │   │   ├── api.js        # Client API
│   │   │   └── utils.js      # Helpers
│   │   └── styles/
│   │       └── fdap.css       # Design existant (réutilisé)
│   ├── tailwind.config.js
│   └── package.json
│
└── docs/
    ├── API.md                 # Documentation API
    ├── DEPLOYMENT.md          # Déploiement
    └── DATABASE.md            # Schéma BDD
```

## 📊 Modèle de Données

### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // bcrypt hash
  nom       String
  prenom    String
  annee     String?  // Année scolaire
  niveau    String   // CAP, Bac Pro, etc.
  role      Role     @default(USER)
  fdaps     Fdap[]
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  USER
}
```

### Fdap (Fiche d'Activité Pédagogique)
```prisma
model Fdap {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User     @relation(fields: [userId])
  
  // Identité
  titre           String
  nomPrenom       String
  dateSaisie      DateTime
  
  // Contexte
  lieu            String   // lycee, pfmp
  enseigne        String?
  lieuSpecifique  String?
  
  // Domaine
  domaine         String?
  competences     String?
  
  // Conditions
  autonomie        Int?     @default(3)  // 1-5
  materiels       String?
  commanditaire   String?
  contraintes     String?
  consignes       String?
  
  // Descriptif
  avecQui         String?
  deroulement     String?
  resultats       String?
  
  // Bilan
  difficulte      Int?     @default(3)
  plaisir         Int?     @default(3)
  ameliorations   String?
  
  // Médias
  medias          Media[]
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt()
}
```

### Media
```prisma
model Media {
  id        Int      @id @default(autoincrement())
  fdapId    Int
  fdap      Fdap     @relation(fields: [fdapId])
  type      String   // photo, audio, video, document
  filename  String
  path      String
  size      Int
  compressed Boolean @default(false)
}
```

## 🎨 Design

Le design du frontend **réutilise les styles du plugin WordPress FDAP** :

- Variables CSS (`--fdap-primary`, `--fdap-accent`, etc.)
- Sections avec icônes emoji (👤, 📍, 🎯, ⚙️, 📝, 📊)
- Formulaires avec champs modernes et responsive
- Thème clair avec accents bleu/vert

Fichier source : `frontend/src/styles/fdap.css`

## 🔐 Authentification

- **Premier admin** : `admin` / `admin` (à changer à la première connexion)
- **Inscription** : Nom, Prénom, Année, Niveau (CAP/Bac Pro)
- **Rôles** :
  - `ADMIN` : Accès à tous les FDAP, gestion utilisateurs
  - `USER` : Accès à ses propres FDAP uniquement

## 🚀 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js 20 + Express + Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Frontend | React + Vite + Tailwind CSS |
| Compression | Sharp (images) |
| Upload | Multer |
| Deploiement | LXC dev-api (192.168.10.224) |

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur courant

### FDAP
- `GET /api/fdap` - Liste (admin: tous, user: les siens)
- `GET /api/fdap/:id` - Détail
- `POST /api/fdap` - Créer
- `PUT /api/fdap/:id` - Modifier
- `DELETE /api/fdap/:id` - Supprimer

### Users (admin)
- `GET /api/users` - Liste
- `PUT /api/users/:id/role` - Modifier rôle

### Media
- `POST /api/media/upload` - Upload fichier
- `DELETE /api/media/:id` - Supprimer

## 🔗 Intégrations Futures

L'API est conçue pour être connectée à :
- **WordPress** (plugin FDAP existant)
- **LMS** (Moodle, etc.)
- **Autres applications pédagogiques**

## 📦 Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📄 Licence

MIT

---

**Développé par Patrick L'Hôte - Projet Portfolio Élève**