# Yello - Application React TypeScript

Une application React moderne construite avec TypeScript, Vite, Tailwind CSS 3, shadcn/ui et les meilleures pratiques de développement.

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque UI moderne avec hooks et concurrent features
- **TypeScript 5.8** - Typage statique strict pour JavaScript
- **Vite 7** - Build tool ultra-rapide et moderne
- **Tailwind CSS 3.4** - Framework CSS utility-first avec variables CSS personnalisées
- **shadcn/ui** - Composants UI accessibles et personnalisables
- **React Router 7** - Navigation côté client moderne
- **Zustand 5** - Gestion d'état légère et performante
- **Vitest 3** - Framework de tests rapide avec Testing Library
- **ESLint 9** & **Prettier 3** - Qualité et formatage du code
- **PostCSS** - Traitement CSS moderne

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants shadcn/ui
│   └── layout/         # Composants de mise en page
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et configurations
├── pages/              # Pages de l'application
├── store/              # Stores Zustand
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
└── constants/          # Constantes de l'application
```

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Tests
npm run test
npm run test:ui
npm run test:coverage

# Linting et formatage
npm run lint
npm run lint:fix
npm run format
```

## 🎨 Composants UI

Le projet utilise shadcn/ui pour les composants. Les composants sont personnalisables, accessibles et optimisés :

- **Button** - Boutons avec variants (default, secondary, outline, ghost, link)
- **Input** - Champs de saisie avec validation et états d'erreur
- **Card** - Cartes avec Header, Title, Description, Content, Footer
- **Thème** - Support des thèmes sombre/clair avec variables CSS

## 🧪 Tests

Les tests sont configurés avec Vitest et Testing Library :

```bash
# Lancer les tests
npm run test

# Lancer les tests avec interface
npm run test:ui

# Lancer les tests avec couverture
npm run test:coverage
```

## 🎯 Fonctionnalités

- ✅ **Configuration TypeScript stricte** - Typage strict sans `any`, règles avancées
- ✅ **ESLint 9 et Prettier 3** - Qualité de code et formatage automatique
- ✅ **Tailwind CSS 3.4** - Variables CSS personnalisées, thèmes, optimisations
- ✅ **shadcn/ui** - Composants accessibles et personnalisables
- ✅ **React Router 7** - Navigation moderne avec layouts
- ✅ **Zustand 5** - Gestion d'état avec persistence et middleware
- ✅ **Hooks personnalisés** - useTheme, useLocalStorage, useDebounce, useApi
- ✅ **Tests Vitest 3** - Tests unitaires avec Testing Library et mocks
- ✅ **Thème sombre/clair** - Basculement automatique avec persistence
- ✅ **Architecture modulaire** - Structure scalable respectant SOLID
- ✅ **Build optimisé** - Vite 7 avec optimisations de production
- ✅ **PostCSS moderne** - Traitement CSS avancé avec autoprefixer

## 🚀 Démarrage rapide

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur

## 📝 Principes suivis

- **SOLID** - Principes de programmation orientée objet
- **DRY** - Don't Repeat Yourself
- **TypeScript strict** - Typage strict sans `any`, règles avancées
- **Accessibilité** - Composants accessibles avec shadcn/ui et ARIA
- **Performance** - Optimisations Vite 7, React 18, et Tailwind CSS 3
- **Maintenabilité** - Code modulaire, tests, et documentation
- **Standards modernes** - ES modules, CSS variables, et APIs modernes

## 🔧 Configuration avancée

### Tailwind CSS 3
- Variables CSS personnalisées pour les thèmes
- Configuration ES modules compatible
- Optimisations de production automatiques
- Support des thèmes sombre/clair

### TypeScript
- Configuration stricte avec règles avancées
- Pas de types `any` autorisés
- Vérifications strictes des propriétés optionnelles
- Support des imports ES modules

### Tests
- Vitest 3 avec configuration optimisée
- Testing Library pour les tests de composants
- Mocks pour les APIs du navigateur
- Couverture de code configurée