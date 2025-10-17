# Utilisateurs de Test - Mode Développement

Ce document liste tous les utilisateurs de test disponibles pour le développement de l'application Yello.

## 🔑 Informations de Connexion

**Mot de passe pour tous les comptes :** `password123`

## 👨‍🏫 Enseignants

| Nom | Email | Description |
|-----|-------|-------------|
| Marie Dubois | marie.dubois@yello.com | Enseignante principale - Mathématiques |
| Jean Martin | jean.martin@yello.com | Enseignant - Physique-Chimie |
| Sophie Bernard | sophie.bernard@yello.com | Enseignante - Histoire-Géographie |

### Classes Créées par les Enseignants

#### Marie Dubois
- **Mathématiques 6ème - Groupe A** (3 étudiants)
- **Français 5ème - Groupe A** (3 étudiants)
- **Mathématiques Avancées - 5ème** (2 étudiants, inactive)
- **Mathématiques - Révision Brevet** (2 étudiants, terminée)

#### Jean Martin
- **Physique-Chimie 6ème - Groupe B** (3 étudiants)
- **SVT 4ème - Groupe A** (2 étudiants)

#### Sophie Bernard
- **Histoire-Géographie 6ème - Groupe C** (3 étudiants)

## 👨‍🎓 Étudiants

| Nom | Email | Matricule | Niveau | Classes Inscrites |
|-----|-------|-----------|--------|-------------------|
| Alice Dupont | alice.dupont@yello.com | STU001 | 6ème | Mathématiques 6ème, Physique-Chimie 6ème, Histoire-Géographie 6ème |
| Bob Leroy | bob.leroy@yello.com | STU002 | 5ème | Physique-Chimie 6ème, Histoire-Géographie 6ème, Français 5ème |
| Claire Moreau | claire.moreau@yello.com | STU003 | 4ème | Histoire-Géographie 6ème, Français 5ème, SVT 4ème |
| David Petit | david.petit@yello.com | STU004 | 3ème | Français 5ème, SVT 4ème |
| Emma Rousseau | emma.rousseau@yello.com | STU005 | 2nde | SVT 4ème |
| Lucas Simon | lucas.simon@yello.com | STU006 | 6ème | Mathématiques 6ème, Physique-Chimie 6ème |

## 👨‍👩‍👧‍👦 Parents

| Nom | Email | Étudiants Associés |
|-----|-------|-------------------|
| Camille Laurent | camille.laurent@yello.com | Alice Dupont, Bob Leroy |
| Pierre Moreau | pierre.moreau@yello.com | Claire Moreau, David Petit |

## ⚙️ Administrateur

| Nom | Email | Rôle |
|-----|-------|------|
| Admin Yello | admin@yello.com | Super administrateur |

## 📚 Cours Disponibles

1. **Introduction aux Mathématiques 6ème** (Marie Dubois)
2. **Physique-Chimie 6ème** (Jean Martin)
3. **Histoire-Géographie 6ème** (Sophie Bernard)
4. **Français 5ème** (Marie Dubois)
5. **Sciences de la Vie et de la Terre 4ème** (Jean Martin)

## 🏫 Classes Virtuelles

### Classes Actives
- **Mathématiques 6ème - Groupe A** (Marie Dubois) - 3/25 étudiants
- **Physique-Chimie 6ème - Groupe B** (Jean Martin) - 3/20 étudiants
- **Histoire-Géographie 6ème - Groupe C** (Sophie Bernard) - 3/22 étudiants
- **Français 5ème - Groupe A** (Marie Dubois) - 3/20 étudiants
- **SVT 4ème - Groupe A** (Jean Martin) - 2/18 étudiants

### Classes Inactives
- **Mathématiques Avancées - 5ème** (Marie Dubois) - 2/15 étudiants

### Classes Terminées
- **Mathématiques - Révision Brevet** (Marie Dubois) - 2/30 étudiants

## 🧪 Comment Utiliser

1. **Démarrer le backend** avec les données de seed :
   ```bash
   cd yello-app-backend
   yarn seed:complete
   yarn start:dev
   ```

2. **Démarrer le frontend** :
   ```bash
   cd yello-app-frontend
   npm run dev
   ```

3. **Se connecter** en utilisant les boutons de test sur la page de connexion ou en saisissant manuellement les identifiants.

## 🔄 Réinitialiser les Données

Pour réinitialiser la base de données avec de nouvelles données de test :

```bash
cd yello-app-backend
yarn seed:complete
```

## 📝 Notes de Développement

- Les utilisateurs de test ne sont visibles qu'en mode développement (`import.meta.env.DEV`)
- Tous les mots de passe sont hashés avec bcrypt (10 rounds)
- Les classes ont des horaires réalistes pour tester les fonctionnalités
- Les étudiants sont répartis de manière équilibrée dans les classes
- Les parents sont associés à plusieurs étudiants pour tester les vues agrégées

## 🐛 Dépannage

Si vous ne pouvez pas vous connecter :

1. Vérifiez que le backend est démarré
2. Vérifiez que la base de données contient les données de seed
3. Vérifiez que l'URL de l'API est correcte dans les variables d'environnement
4. Consultez les logs du backend pour les erreurs d'authentification
