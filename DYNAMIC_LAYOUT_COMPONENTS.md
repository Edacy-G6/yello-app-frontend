# Composants Layout Dynamiques - Yello Studio

## 🎯 Objectif

Rendre les composants Header, Sidebar et Footer dynamiques pour s'adapter automatiquement avant et après la connexion, en utilisant une architecture modulaire et réutilisable.

## 🏗️ Architecture Implémentée

### 1. **Layout Principal Unifié**

Le `Layout.tsx` utilise maintenant les composants existants de manière conditionnelle :

```typescript
// Détermine si on doit afficher le sidebar
const shouldShowSidebar = user && (
  (user.role === 'teacher' && location.pathname.startsWith('/teacher')) ||
  (user.role === 'student' && location.pathname.startsWith('/student')) ||
  (user.role === 'parent' && location.pathname.startsWith('/parent')) ||
  (user.role === 'admin' && location.pathname.startsWith('/admin'))
);

// Layout conditionnel
if (shouldShowSidebar) {
  return <SidebarLayout />;
}
return <StandardLayout />;
```

### 2. **Header Dynamique**

#### Props et Interface
```typescript
interface HeaderProps {
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ showSidebar = false, onToggleSidebar }: HeaderProps)
```

#### Comportements Adaptatifs

**Avec Sidebar (Pages Authentifiées)**
```typescript
if (showSidebar) {
  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Bouton toggle sidebar (mobile) */}
        <button onClick={onToggleSidebar} className="md:hidden">
          <MenuIcon />
        </button>
        
        <div className="flex-1" />
        
        {/* Actions : Notifications + Profil */}
        <div className="flex items-center space-x-4">
          <NotificationsButton />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
```

**Sans Sidebar (Pages Publiques)**
```typescript
return (
  <header className="bg-background shadow-sm border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Logo />
        
        {/* Navigation principale */}
        <nav className="hidden md:flex space-x-8">
          <NavLink to={ROUTES.HOME}>Accueil</NavLink>
          <NavLink to={ROUTES.ABOUT}>À propos</NavLink>
          <NavLink to={ROUTES.CONTACT}>Contact</NavLink>
        </nav>
        
        {/* Actions d'authentification */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? <AuthenticatedActions /> : <PublicActions />}
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
);
```

### 3. **Footer Dynamique**

#### Props et Interface
```typescript
interface FooterProps {
  showSidebar?: boolean;
}

export default function Footer({ showSidebar = false }: FooterProps)
```

#### Comportements Adaptatifs

**Avec Sidebar (Simplifié)**
```typescript
if (showSidebar) {
  return (
    <footer className="bg-muted text-muted-foreground py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm">
          &copy; 2025 Yello Studio. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
```

**Sans Sidebar (Complet)**
```typescript
return (
  <footer className="bg-muted text-muted-foreground">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <CompanyInfo />
        <ProductLinks />
        <AccountLinks isAuthenticated={isAuthenticated} />
        <SupportLinks />
      </div>
      <LegalLinks />
    </div>
  </footer>
);
```

### 4. **Sidebar Multi-Rôles**

Le Sidebar reste dynamique selon le rôle utilisateur :

```typescript
interface SidebarProps {
  className?: string;
  variant?: 'teacher' | 'student' | 'parent' | 'admin';
}

// Génération dynamique des éléments de navigation
const getNavigationItems = () => {
  const roleSpecificItems = {
    teacher: [/* éléments enseignant */],
    student: [/* éléments étudiant */],
    parent: [/* éléments parent */],
    admin: [/* éléments admin */]
  };
  
  return [...baseItems, ...(roleSpecificItems[variant] || [])];
};
```

## 🔧 Flux de Fonctionnement

### 1. **Pages Publiques (Avant Connexion)**
```
URL: /, /about, /contact, /login, /register
↓
Layout.tsx détecte: shouldShowSidebar = false
↓
Layout Standard:
- Header complet (Logo + Navigation + Auth buttons)
- Contenu principal
- Footer complet (4 colonnes + liens légaux)
```

### 2. **Pages Authentifiées (Après Connexion)**
```
URL: /teacher/dashboard, /student/courses, etc.
↓
Layout.tsx détecte: shouldShowSidebar = true
↓
Layout avec Sidebar:
- Sidebar (navigation spécifique au rôle)
- Header simplifié (toggle + actions)
- Contenu principal
- Footer simplifié (copyright seulement)
```

### 3. **Transitions Dynamiques**
```
Connexion: /login → /teacher/dashboard
↓
Header: Auth buttons → Toggle + Actions
Footer: Complet → Simplifié
Sidebar: Invisible → Visible avec navigation teacher
```

## 🎨 Design et UX

### **Header Adaptatif**

#### Pages Publiques
- **Logo** : Lien vers l'accueil
- **Navigation** : Accueil, À propos, Contact
- **Actions** : Connexion/Inscription + Thème
- **Style** : Sticky, shadow, z-index élevé

#### Pages Authentifiées
- **Toggle** : Bouton menu (mobile)
- **Actions** : Notifications + Profil
- **Style** : Border-bottom, padding réduit

### **Footer Adaptatif**

#### Pages Publiques
- **4 Colonnes** : Produit, Compte, Support, Info
- **Liens Légaux** : Confidentialité, CGU, Cookies
- **Style** : Padding important, grille complexe

#### Pages Authentifiées
- **1 Ligne** : Copyright seulement
- **Style** : Padding minimal, centré

### **Sidebar Contextuel**
- **Navigation Active** : Page courante mise en surbrillance
- **Section Utilisateur** : Avatar + informations
- **Actions** : Paramètres + Déconnexion
- **Responsive** : Collapsible sur mobile

## 📱 Responsive Design

### **Mobile (< 768px)**
```typescript
// Header avec sidebar
<button className="md:hidden" onClick={onToggleSidebar}>
  <MenuIcon />
</button>

// Sidebar collapsible
<div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
  <Sidebar />
</div>
```

### **Desktop (≥ 768px)**
```typescript
// Navigation principale visible
<nav className="hidden md:flex space-x-8">
  {/* Liens de navigation */}
</nav>

// Sidebar fixe
<div className="w-64">
  <Sidebar />
</div>
```

## 🔗 Intégration avec l'Authentification

### **Détection Automatique**
```typescript
const { user } = useAuth();

// Vérification du rôle et de l'URL
const shouldShowSidebar = user && (
  (user.role === 'teacher' && location.pathname.startsWith('/teacher')) ||
  (user.role === 'student' && location.pathname.startsWith('/student')) ||
  // ...
);
```

### **Props Dynamiques**
```typescript
// Header
<Header 
  showSidebar={shouldShowSidebar} 
  onToggleSidebar={toggleSidebar}
/>

// Footer
<Footer showSidebar={shouldShowSidebar} />

// Sidebar
<Sidebar variant={user?.role} />
```

## 🎯 Avantages de l'Approche

### 1. **Réutilisabilité**
- **Composants Unifiés** : Header et Footer s'adaptent automatiquement
- **Logique Centralisée** : Layout.tsx gère toute la logique conditionnelle
- **Props Minimales** : Interface simple avec `showSidebar` boolean

### 2. **Maintenabilité**
- **Un Seul Layout** : Pas de duplication de code
- **Composants Cohérents** : Même structure, comportement adaptatif
- **Évolutivité** : Facile d'ajouter de nouveaux contextes

### 3. **Performance**
- **Rendu Conditionnel** : Seuls les composants nécessaires sont rendus
- **Transitions Optimisées** : CSS pur pour les animations
- **Bundle Size** : Pas de duplication de composants

### 4. **UX Cohérente**
- **Transitions Fluides** : Changement d'état seamless
- **Navigation Intuitive** : Adaptation automatique selon le contexte
- **Design Responsive** : Fonctionne sur tous les écrans

## 🚀 Utilisation

### **Avant Connexion**
- **Header** : Logo + Navigation + Boutons Auth
- **Footer** : Informations complètes + Liens
- **Sidebar** : Invisible

### **Après Connexion (Enseignant)**
- **Header** : Toggle + Notifications + Profil
- **Footer** : Copyright simplifié
- **Sidebar** : Navigation enseignant active

### **Après Connexion (Autres Rôles)**
- **Header** : Adapté selon le rôle
- **Footer** : Simplifié
- **Sidebar** : Navigation spécifique au rôle

## 📋 Points d'Amélioration

### **Fonctionnalités**
- [ ] Persistance de l'état du sidebar (collapsed/expanded)
- [ ] Animations d'entrée/sortie pour les transitions
- [ ] Breadcrumbs dans le header avec sidebar

### **Accessibilité**
- [ ] Navigation au clavier optimisée
- [ ] ARIA labels pour les boutons toggle
- [ ] Focus management lors des transitions

### **Performance**
- [ ] Lazy loading des composants selon le contexte
- [ ] Memoization des composants lourds
- [ ] Optimisation des re-renders

---

**Résultat** : Un système de layout complètement dynamique et adaptatif qui s'ajuste automatiquement selon l'état de connexion et le rôle utilisateur ! 🎓✨
