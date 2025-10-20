# 📖 Full Stack Story

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

Une plateforme complète de création d'histoires personnalisées avec templates PDF. Permettez aux utilisateurs de créer des histoires uniques en utilisant des templates PDF prédéfinis avec un éditeur visuel intuitif.

## ✨ Fonctionnalités Principales

- 🔐 **Authentification JWT** - Système d'authentification sécurisé avec gestion des rôles
- 📄 **Gestion des Templates** - Upload et gestion de templates PDF personnalisables
- 🎨 **Éditeur Visuel PDF** - Interface intuitive pour modifier les zones de texte et d'images
- 🏷️ **Gestion des Zones** - Définition de zones éditables dans les templates
- 👥 **Interface d'Administration** - Panel complet pour gérer utilisateurs et templates
- 📊 **Tableaux de Bord** - Métriques et statistiques en temps réel
- 📱 **Interface Responsive** - Design moderne et adaptatif
- 🔄 **Génération PDF** - Création de PDFs personnalisés à partir des templates

## 🛠️ Technologies Utilisées

### Backend
- **NestJS** - Framework Node.js pour applications côté serveur
- **MongoDB** - Base de données NoSQL
- **JWT** - Authentification basée sur JSON Web Tokens
- **PDFKit** - Génération et manipulation de fichiers PDF
- **Swagger** - Documentation automatique de l'API
- **Mongoose** - ODM pour MongoDB

### Frontend
- **Next.js 15** - Framework React avec rendu côté serveur
- **TypeScript** - JavaScript typé pour une meilleure maintenabilité
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations et transitions fluides
- **React PDF** - Affichage et manipulation de PDFs dans React
- **Zustand** - Gestion d'état légère et performante
- **Axios** - Client HTTP pour les requêtes API

### Outils de Développement
- **pnpm** - Gestionnaire de paquets rapide et efficace
- **ESLint** - Linting du code JavaScript/TypeScript
- **Prettier** - Formatage automatique du code
- **Workspaces** - Gestion de monorepo

## 🏗️ Architecture du Projet

```
full-stack-story/
├── apps/
│   ├── backend/story-backend/     # API NestJS
│   │   ├── src/
│   │   │   ├── modules/           # Modules métier
│   │   │   │   ├── auth/          # Authentification
│   │   │   │   ├── templates/     # Gestion templates
│   │   │   │   ├── pdf/           # Génération PDF
│   │   │   │   ├── users/         # Gestion utilisateurs
│   │   │   │   └── zones/         # Gestion zones
│   │   │   ├── common/            # Utilitaires communs
│   │   │   └── config/            # Configuration
│   │   └── uploads/               # Fichiers uploadés
│   └── frontend/story-frontend/   # Application Next.js
│       ├── src/
│       │   ├── app/               # Pages Next.js 13+
│       │   ├── components/        # Composants React
│       │   └── lib/               # Utilitaires frontend
│       └── public/                # Assets statiques
├── packages/
│   ├── shared/                    # Code partagé
│   └── utils/                     # Utilitaires partagés
└── package.json                   # Configuration monorepo
```

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **MongoDB** >= 5.0

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd full-stack-story
   ```

2. **Installer les dépendances**
   ```bash
   pnpm run bootstrap
   ```

3. **Configuration de l'environnement**

   Copier les fichiers d'exemple d'environnement :
   ```bash
   cp apps/backend/story-backend/.env.example apps/backend/story-backend/.env
   ```

   Configurer les variables dans `.env` :
   ```env
   # Base de données
   MONGODB_URI=mongodb://localhost:27017/story-db

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Application
   PORT=3000
   NODE_ENV=development

   # Upload
   UPLOAD_DEST=uploads
   ```

4. **Démarrer MongoDB**
   ```bash
   # Avec Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Ou installer MongoDB localement
   brew install mongodb-community
   brew services start mongodb-community
   ```

### Démarrage

1. **Démarrer tous les services**
   ```bash
   # Backend
   cd apps/backend/story-backend
   pnpm run start:dev

   # Frontend (dans un autre terminal)
   cd apps/frontend/story-frontend
   pnpm run dev
   ```

2. **Accéder aux applications**
   - **Frontend** : http://localhost:3000
   - **Backend API** : http://localhost:3000/api
   - **Documentation API** : http://localhost:3000/api/docs

## 📜 Scripts Disponibles

### Scripts Globaux (Racine du projet)
```bash
pnpm run bootstrap    # Installer toutes les dépendances
pnpm run lint         # Linter tous les workspaces
pnpm run build        # Builder tous les workspaces
```

### Scripts Backend
```bash
cd apps/backend/story-backend

pnpm run build        # Compiler TypeScript
pnpm run start        # Démarrer en production
pnpm run start:dev    # Démarrer en mode développement
pnpm run start:debug  # Démarrer avec debugger
pnpm run test         # Exécuter les tests
pnpm run test:watch   # Tests en mode watch
pnpm run lint         # Linter le code
pnpm run format       # Formatter le code
```

### Scripts Frontend
```bash
cd apps/frontend/story-frontend

pnpm run dev          # Démarrer le serveur de développement
pnpm run build        # Builder pour la production
pnpm run start        # Démarrer en production
pnpm run lint         # Linter le code
```

## 🔌 API Endpoints

### Authentification
```
POST   /auth/register     # Inscription utilisateur
POST   /auth/login        # Connexion utilisateur
GET    /auth/profile      # Profil utilisateur (authentifié)
```

### Templates
```
GET    /templates         # Liste des templates
GET    /templates/:id     # Détails d'un template
POST   /templates         # Créer un template (admin)
PUT    /templates/:id     # Modifier un template (admin)
PUT    /templates/:id/status # Changer statut (admin)
DELETE /templates/:id     # Supprimer un template (admin)
```

### PDF
```
POST   /pdf/generate      # Générer un PDF personnalisé
GET    /pdf/generated     # Liste des PDFs générés
```

### Utilisateurs (Administration)
```
GET    /users             # Liste des utilisateurs
GET    /users/:id         # Détails utilisateur
POST   /users             # Créer utilisateur (admin)
PUT    /users/:id         # Modifier utilisateur
DELETE /users/:id         # Supprimer utilisateur
```

### Zones
```
GET    /zones/:templateId # Zones d'un template
POST   /zones             # Créer une zone (admin)
PUT    /zones/:id         # Modifier une zone (admin)
DELETE /zones/:id         # Supprimer une zone (admin)
```

## 📁 Structure des Dossiers

### Backend (`apps/backend/story-backend/`)
```
src/
├── modules/              # Modules métier
│   ├── auth/            # Authentification JWT
│   ├── templates/       # Gestion des templates
│   ├── pdf/             # Génération PDF
│   ├── users/           # Gestion utilisateurs
│   └── zones/           # Gestion des zones
├── common/              # Utilitaires communs
├── config/              # Configuration
└── uploads/             # Fichiers uploadés
```

### Frontend (`apps/frontend/story-frontend/`)
```
src/
├── app/                 # Pages Next.js (App Router)
│   ├── dashboard/       # Tableau de bord
│   ├── editor/          # Éditeur de templates
│   ├── templates/       # Gestion des templates
│   ├── users/           # Gestion utilisateurs
│   └── login/           # Authentification
├── components/          # Composants React réutilisables
└── lib/                 # Utilitaires et hooks
```

### Packages Partagés
```
packages/
├── shared/              # Types et interfaces communs
└── utils/               # Fonctions utilitaires
```

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment contribuer :

### Processus de Contribution

1. **Forker** le projet
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commiter vos changements** (`git commit -m 'Add some AmazingFeature'`)
4. **Pousser vers la branche** (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Guidelines de Développement

- **Code Style** : Respecter les configurations ESLint et Prettier
- **Tests** : Ajouter des tests pour les nouvelles fonctionnalités
- **Documentation** : Mettre à jour la documentation pour les changements d'API
- **Commits** : Utiliser des messages de commit descriptifs

### Configuration de Développement

```bash
# Installation des hooks de pre-commit
pnpm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "pnpm run lint"
```

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés. Le code est privé et non ouvert au public.

---

**Développé avec ❤️ par bilelOS**