# Guide d'utilisation - Formulaire Admin Deadlines

## 📋 Vue d'ensemble

Le formulaire d'administration des deadlines permet aux administrateurs de créer, gérer et supprimer des deadlines pour les étudiants. L'interface est accessible via l'URL `/admin-deadlines.html` et nécessite un compte administrateur.

## 🚀 Installation et configuration

### 1. Mise à jour de la base de données

Exécutez les scripts SQL dans l'ordre suivant :

```sql
-- 1. Mettre à jour la structure des tables
-- Exécuter database_update.sql

-- 2. Ajouter des données de test
-- Exécuter test_data.sql
```

### 2. Redémarrer l'application

```bash
./gradlew bootRun
```

### 3. Accéder à l'interface

Ouvrez votre navigateur et allez à :
```
http://localhost:8080/admin-deadlines.html
```

## 🔐 Authentification

- **Compte admin de test** : `admin` / `password`
- **Compte étudiant de test** : `etudiant1` / `password`

## 📝 Utilisation du formulaire

### Champs obligatoires

1. **Titre** : Nom de la deadline (ex: "Dépôt rapport PFE")
2. **Date limite** : Date et heure limite avec le sélecteur de date
3. **Cible** : Sélectionner le type de cible (promo/classe ou étudiant spécifique)

### Champs optionnels

1. **Description** : Détails supplémentaires sur la deadline
2. **Type** : Catégorie de la deadline (TP, Examen, Projet, etc.)

### Types de cibles

#### 🎯 Pour toute une promo/classe
- Sélectionner "Pour toute une promo/classe"
- Choisir dans la liste déroulante :
  - **Classes** : L3, M1, etc.
  - **Filières** : Informatique, Mathématiques, Physique, etc.

#### 👤 Pour un étudiant spécifique
- Sélectionner "Pour un étudiant spécifique"
- Choisir l'étudiant dans la liste déroulante

## 🔧 Fonctionnalités

### ✅ Créer une deadline
1. Remplir le formulaire
2. Cliquer sur "✅ Créer la deadline"
3. La deadline apparaît dans la liste

### 📋 Voir les deadlines existantes
- La liste se charge automatiquement
- Affichage des informations : titre, description, date, type, cible

### 🗑️ Supprimer une deadline
1. Cliquer sur "🗑️ Supprimer" sur la deadline souhaitée
2. Confirmer la suppression

### 🔄 Réinitialiser le formulaire
- Cliquer sur "🔄 Réinitialiser" pour vider tous les champs

## 📊 Types de deadlines disponibles

- **TP** : Travaux pratiques
- **Examen** : Examens et contrôles
- **Projet** : Projets de cours
- **Rapport** : Rapports et documents
- **PFE** : Projets de fin d'études
- **Information** : Informations générales
- **Autre** : Autres types

## 🎨 Interface utilisateur

### Design responsive
- Interface moderne avec dégradés
- Animations et transitions fluides
- Compatible mobile et desktop

### Notifications
- **Succès** : Messages verts pour les actions réussies
- **Erreur** : Messages rouges pour les erreurs
- **Auto-disparition** : Les messages disparaissent après 5 secondes

## 🔗 API Endpoints

### Endpoints admin
- `GET /admin/deadlines` - Liste toutes les deadlines
- `POST /admin/deadlines` - Créer une nouvelle deadline
- `PUT /admin/deadlines/{id}` - Modifier une deadline
- `DELETE /admin/deadlines/{id}` - Supprimer une deadline
- `GET /admin/deadlines/classes` - Liste des classes disponibles
- `GET /admin/deadlines/filieres` - Liste des filières disponibles
- `GET /admin/deadlines/etudiants` - Liste des étudiants

### Endpoints étudiants
- `GET /api/deadlines/my` - Deadlines de l'étudiant connecté

## 🛠️ Dépannage

### Problèmes courants

1. **Erreur 403 Forbidden**
   - Vérifier que vous êtes connecté avec un compte admin
   - Vérifier que le token JWT est valide

2. **Listes déroulantes vides**
   - Vérifier que des étudiants existent dans la base de données
   - Vérifier que les colonnes `classe` et `filiere` sont remplies

3. **Erreur lors de la création**
   - Vérifier que tous les champs obligatoires sont remplis
   - Vérifier le format de la date (datetime-local)

### Logs de débogage

Activez les logs SQL dans `application.properties` :
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Versions** : Toutes les versions modernes
- **Mobile** : Interface responsive

## 🔒 Sécurité

- **Authentification** : JWT obligatoire
- **Autorisation** : Rôle ADMIN requis
- **Validation** : Validation côté client et serveur
- **CSRF** : Protection activée

## 📈 Évolutions futures

- [ ] Édition en ligne des deadlines
- [ ] Import/export en CSV
- [ ] Notifications par email
- [ ] Calendrier intégré
- [ ] Rappels automatiques
- [ ] Statistiques d'utilisation
