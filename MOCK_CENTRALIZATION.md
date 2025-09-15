# Centralisation des Données Mockées - Yello Studio

## 🎯 Objectif

Centraliser toutes les données mockées du projet dans un fichier unique pour améliorer la maintenabilité, la cohérence et la réutilisabilité.

## 📁 Structure Mise en Place

### Fichiers Créés/Modifiés

1. **`src/constants/mocks.ts`** - Fichier central des mocks
2. **`src/constants/index.ts`** - Re-exports des mocks
3. **`src/types/index.ts`** - Types TypeScript étendus
4. **`.cursor/rules/mock-data-management.mdc`** - Règles Cursor pour les mocks

### Pages Mises à Jour

- **`src/pages/TeacherDashboardPage.tsx`** - Utilise les mocks centralisés
- **`src/pages/CourseEditorPage.tsx`** - Utilise les mocks centralisés
- **`src/components/forms/LoginForm.tsx`** - Clés d'utilisateurs corrigées

## 🗂️ Données Centralisées

### Mocks Disponibles

```typescript
// Utilisateurs de test
MOCK_USERS = {
  teacher: { email: 'teacher@yello.com', password: 'teacher123', ... },
  student: { email: 'student@yello.com', password: 'student123', ... },
  parent: { email: 'parent@yello.com', password: 'parent123', ... },
  admin: { email: 'admin@yello.com', password: 'admin123', ... }
}

// Cours et contenu
MOCK_COURSES = [/* 5 cours avec différents statuts */]
MOCK_COURSE_CONTENT = [/* Contenu complet du cours Pythagore */]

// Analytics et statistiques
MOCK_ANALYTICS = { /* Statistiques complètes */ }
MOCK_DASHBOARD_STATS = { /* Métriques du tableau de bord */ }

// Données de configuration
MOCK_SCHOOL_LEVELS = [/* 13 niveaux scolaires */]
MOCK_EXPORT_FORMATS = [/* 4 formats d'export */]
MOCK_NOTIFICATIONS = [/* Notifications système */]
MOCK_QUICK_START_STEPS = [/* Étapes de démarrage rapide */]
```

### Types TypeScript Ajoutés

```typescript
// Interfaces pour les cours
interface Course {
  id: number;
  title: string;
  type: 'pdf' | 'manual' | 'template';
  status: 'draft' | 'completed' | 'published' | 'archived';
  studentCount: number;
  quizCount: number;
  // ...
}

interface CourseContent {
  id: string;
  type: 'heading' | 'paragraph' | 'formula' | 'example' | 'exercise';
  level: 1 | 2 | 3;
  content: string;
  metadata?: Record<string, unknown>;
}

// Interfaces pour les analytics
interface Analytics {
  totalCourses: number;
  totalStudents: number;
  completionRate: number;
  averageScore: number;
  recentActivity: Activity[];
  monthlyStats: MonthlyStat[];
}

// Interfaces pour les notifications
interface Notification {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
```

## 🔧 Règles Cursor Ajoutées

### Nouvelle Règle : `mock-data-management.mdc`

**Principe** : Toujours centraliser les données mockées dans `src/constants/mocks.ts`

**Interdictions** :
- ❌ Données mockées dans les composants
- ❌ Données mockées dans les pages
- ❌ Données mockées dans les hooks

**Obligations** :
- ✅ Import depuis `../constants`
- ✅ Types TypeScript stricts
- ✅ Préfixe `MOCK_` pour toutes les variables
- ✅ Re-export via `constants/index.ts`

### Règle Mise à Jour : `project-structure.mdc`

**Ajouts** :
- Section sur la gestion des constants
- Règles pour les mocks centralisés
- Structure du dossier `constants/`

## 📊 Bénéfices Obtenus

### 1. **Maintenabilité**
- ✅ Une seule source de vérité pour les données mockées
- ✅ Modifications centralisées
- ✅ Pas de duplication de données

### 2. **Cohérence**
- ✅ Données réalistes et cohérentes
- ✅ Types TypeScript stricts
- ✅ Noms de variables standardisés

### 3. **Réutilisabilité**
- ✅ Import simple depuis `../constants`
- ✅ Données réutilisables dans plusieurs composants
- ✅ Structure extensible

### 4. **Qualité du Code**
- ✅ Respect des standards TypeScript
- ✅ Pas d'erreurs de compilation
- ✅ Code plus propre et organisé

## 🚀 Utilisation

### Import Standard
```typescript
import { MOCK_COURSES, MOCK_USERS, MOCK_ANALYTICS } from '../constants';

export default function MyComponent() {
  const courses = MOCK_COURSES;
  const users = MOCK_USERS;
  const analytics = MOCK_ANALYTICS;
  
  // ...
}
```

### Filtrage et Manipulation
```typescript
// Cours récents (3 premiers)
const recentCourses = MOCK_COURSES.slice(0, 3);

// Cours publiés uniquement
const publishedCourses = MOCK_COURSES.filter(c => c.status === 'published');

// Utilisateur enseignant
const teacherUser = MOCK_USERS.teacher;
```

## 📋 Prochaines Étapes

1. **Continuer la migration** des autres composants vers les mocks centralisés
2. **Ajouter de nouveaux mocks** selon les besoins des fonctionnalités
3. **Étendre les types TypeScript** pour de nouvelles entités
4. **Créer des services mockés** pour simuler les appels API

## 🔍 Vérifications

- ✅ Build TypeScript sans erreurs
- ✅ Toutes les règles Cursor appliquées
- ✅ Mocks centralisés et typés
- ✅ Pages mises à jour pour utiliser les mocks
- ✅ Documentation complète

---

**Résultat** : Le projet dispose maintenant d'un système de mocks centralisé, typé et maintenable, respectant les bonnes pratiques TypeScript et les règles Cursor établies.
