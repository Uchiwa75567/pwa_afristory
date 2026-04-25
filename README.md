# AFRISTORY

AFRISTORY est une PWA Angular pensée comme un réseau social culturel et sportif autour des JOJ Dakar 2026.

Le projet est organisé en monorepo avec :

- `frontend` Angular pour l’interface mobile
- `backend` Node/Express pour l’authentification et la persistance locale

## Démarrage

```bash
npm install
npm start
```

Le script `npm start` lance :

- le backend sur `http://localhost:3000`
- le front Angular avec proxy API

## Démo

Compte de démonstration :

- e-mail: `demo@afristory.app`
- mot de passe: `AfriStory2026!`

## Scripts utiles

```bash
npm run build
npm run build:frontend
npm run build:backend
npm run start:frontend
npm run start:backend
npm run start:backend:prod
```

## Déploiement Render

Avec ce repo, le plus propre est de déployer un seul **Web Service** Render:

- le backend Express sert l'API
- le frontend Angular compilé est servi par le backend depuis `dist/afristory/browser`

### Option recommandée: Blueprint `render.yaml`

1. Pousse le projet sur GitHub.
2. Dans Render, crée un nouveau service à partir du repo ou importe directement le `render.yaml`.
3. Renseigne les variables d'environnement:
   - `DATABASE_URL` avec l'URL externe de ta base PostgreSQL Render
   - `JWT_SECRET` si tu veux imposer un secret fixe, sinon Render en génère un
   - `NODE_ENV=production`
4. Laisse ces commandes:
   - Build: `npm ci && npm run build`
   - Start: `npm run start:backend:prod`
5. Déploie.

Le backend initialise automatiquement la base au premier démarrage s'il ne trouve pas encore les tables ou les données.

### Option manuelle

Si tu préfères tout configurer à la main dans le dashboard Render:

- Type: `Web Service`
- Runtime: `Node`
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start:backend:prod`
- Health Check Path: `/api/health`
- Environment Variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NODE_ENV=production`

Une fois en ligne, tu n'as plus besoin d'un service frontend séparé avec l'architecture actuelle.

## Structure

```text
src/                 Frontend Angular
backend/             API Express + auth JWT
src/assets/          Logo, icônes et ressources
src/app/             Pages, services et shell mobile
```

## Fonctionnalités

- authentification via backend
- fil social avec posts, likes et commentaires
- suivi des JOJ Dakar 2026
- culture africaine
- récompenses et badges
- exploration de Dakar
- mode installable PWA et cache hors ligne
