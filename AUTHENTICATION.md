# Système d'Authentification Yello

## 📋 Vue d'ensemble

Ce document décrit l'implémentation du système d'authentification pour l'application Yello, incluant la connexion, l'inscription, la gestion des rôles et les redirections sécurisées.

## 🏗️ Architecture

### Structure des fichiers
```
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx      # Provider d'authentification
│   │   ├── ProtectedRoute.tsx    # Composant de protection des routes
│   │   └── index.ts              # Exports
│   └── forms/
│       ├── LoginForm.tsx         # Formulaire de connexion
│       ├── RegisterForm.tsx      # Formulaire d'inscription
│       └── index.ts              # Exports
├── hooks/
│   ├── useAuth.ts               # Hook principal d'authentification
│   ├── useLogin.ts              # Hook pour la connexion
│   ├── useRegister.ts           # Hook pour l'inscription
│   └── index.ts                 # Exports
├── pages/
│   ├── LoginPage.tsx            # Page de connexion
│   ├── RegisterPage.tsx         # Page d'inscription
│   └── DashboardPage.tsx        # Tableau de bord (protégé)
├── services/
│   └── authService.ts           # Service d'authentification avec mocks
├── store/
│   └── useAppStore.ts           # Store Zustand mis à jour
├── types/
│   └── index.ts                 # Types TypeScript étendus
└── constants/
    └── index.ts                 # Constantes et utilisateurs de test
```

## 🔐 Utilisateurs de test

### Comptes disponibles
- **Enseignant** : `enseignant@yello.africa` / `password123`
- **Élève** : `eleve@yello.africa` / `password123`
- **Parent** : `parent@yello.africa` / `password123`
- **Admin** : `admin@yello.africa` / `password123`

### Rôles et permissions
- **Enseignant** : Création de leçons, gestion des classes, rapports
- **Élève** : Accès aux cours, quiz, progression
- **Parent** : Suivi des enfants, rapports, communications
- **Admin** : Gestion école, utilisateurs, statistiques, paramètres

## 🛠️ Fonctionnalités implémentées

### ✅ Authentification
- [x] Connexion avec email/mot de passe
- [x] Inscription avec validation
- [x] Déconnexion sécurisée
- [x] Gestion des tokens (mock)
- [x] Rafraîchissement automatique des tokens

### ✅ Gestion des rôles
- [x] 4 rôles : teacher, student, parent, admin
- [x] Permissions basées sur les rôles
- [x] Vérification des permissions dans les composants

### ✅ Protection des routes
- [x] Routes protégées par authentification
- [x] Routes protégées par rôle
- [x] Redirections automatiques
- [x] Routes publiques (redirection si connecté)

### ✅ Interface utilisateur
- [x] Formulaires avec validation
- [x] Messages d'erreur en français
- [x] États de chargement
- [x] Boutons de test rapide (dev)
- [x] Tableau de bord adaptatif selon le rôle

### ✅ Persistance
- [x] Stockage sécurisé des tokens
- [x] Persistance de l'état utilisateur
- [x] Vérification automatique au chargement

## 🚀 Utilisation

### Connexion rapide (développement)
Les formulaires de connexion incluent des boutons pour remplir automatiquement les comptes de test.

### Protection d'une route
```tsx
import { ProtectedRoute } from '../components/auth';

function MyProtectedPage() {
  return (
    <ProtectedRoute requiredRoles={['teacher', 'admin']}>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### Vérification des permissions
```tsx
import { usePermissions } from '../components/auth';

function MyComponent() {
  const { canAccess, hasPermission } = usePermissions();
  
  if (!canAccess(['teacher'], ['create_lessons'])) {
    return <div>Accès refusé</div>;
  }
  
  return <div>Contenu autorisé</div>;
}
```

### Utilisation des hooks
```tsx
import { useAuth, useLogin } from '../hooks';

function LoginComponent() {
  const { isAuthenticated, user } = useAuth();
  const { formData, handleSubmit, isLoading } = useLogin();
  
  // ...
}
```

## 🔧 Configuration

### Variables d'environnement
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Constantes personnalisables
- `ROUTES` : Chemins des pages
- `STORAGE_KEYS` : Clés de stockage localStorage
- `MOCK_USERS` : Utilisateurs de test
- `USER_ROLES` : Définition des rôles

## 🧪 Tests

### Scénarios de test
1. **Connexion réussie** : Utiliser un compte de test
2. **Connexion échouée** : Mauvais email/mot de passe
3. **Inscription** : Créer un nouveau compte
4. **Protection de route** : Accéder à `/dashboard` sans être connecté
5. **Permissions** : Tester l'accès selon les rôles
6. **Déconnexion** : Vérifier la suppression des tokens

### Commandes de test
```bash
# Démarrer l'application
npm run dev

# Tester la connexion
# Aller sur http://localhost:5173/login
# Utiliser les boutons de test rapide
```

## 🔒 Sécurité

### Bonnes pratiques implémentées
- Validation côté client ET serveur (mock)
- Tokens sécurisés (simulation)
- Protection CSRF (à implémenter avec vraie API)
- Gestion des erreurs sans exposition d'informations sensibles
- Redirections sécurisées avec `replace: true`

### À implémenter avec la vraie API
- JWT tokens réels
- Refresh tokens automatiques
- Validation côté serveur
- Protection CSRF
- Rate limiting
- Audit logs

## 📱 Responsive Design

L'interface est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Mobile : Formulaire en pleine largeur
- Tablette : Centré avec marge
- Desktop : Largeur maximale avec centrage

## 🌍 Internationalisation

Tous les textes sont en français, prêts pour l'internationalisation future avec react-i18next.

## 🔄 Prochaines étapes

1. **API réelle** : Remplacer les mocks par de vrais appels API
2. **Tests unitaires** : Ajouter des tests avec Vitest
3. **Tests E2E** : Tests d'intégration avec Playwright
4. **Gestion d'erreurs** : Améliorer la gestion des erreurs réseau
5. **Performance** : Optimiser les re-renders avec React.memo
6. **Accessibilité** : Ajouter les attributs ARIA
7. **Thème** : Intégrer le système de thèmes existant
