# API Deadlines

## Endpoint `/api/deadlines/my`

### Description
Cet endpoint retourne toutes les deadlines pertinentes pour l'étudiant connecté, en fonction de sa classe, filière et nom.

### Méthode
`GET`

### URL
```
/api/deadlines/my
```

### Authentification
- **Requis** : Token JWT valide
- **Rôle** : ETUDIANT uniquement

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Réponse

#### Succès (200 OK)
```json
[
  {
    "id": 1,
    "titre": "Rendu TP Java",
    "description": "Rendre le TP sur les collections Java",
    "dateLimite": "2024-01-15T23:59:00",
    "type": "TP",
    "cible": "classe",
    "valeurCible": "L3"
  },
  {
    "id": 2,
    "titre": "Examen Base de données",
    "description": "Examen final sur les bases de données",
    "dateLimite": "2024-01-20T14:00:00",
    "type": "Examen",
    "cible": "promo",
    "valeurCible": "Informatique"
  },
  {
    "id": 3,
    "titre": "Rendu personnel",
    "description": "Rendu du projet personnel",
    "dateLimite": "2024-01-25T23:59:00",
    "type": "Projet",
    "cible": "etudiant",
    "valeurCible": "Jean Dupont"
  },
  {
    "id": 4,
    "titre": "Deadline générale",
    "description": "Deadline pour tous les étudiants",
    "dateLimite": "2024-02-01T23:59:00",
    "type": "Information",
    "cible": null,
    "valeurCible": null
  }
]
```

#### Erreur (400 Bad Request)
```json
{
  "error": "Erreur lors de la récupération des deadlines"
}
```

#### Erreur (401 Unauthorized)
```json
{
  "error": "Token d'authentification invalide"
}
```

#### Erreur (403 Forbidden)
```json
{
  "error": "Accès refusé - rôle insuffisant"
}
```

### Logique de filtrage

L'endpoint retourne les deadlines suivantes pour l'étudiant connecté :

1. **Deadlines générales** : Deadlines sans cible spécifique (pour tous les étudiants)
2. **Deadlines de classe** : Deadlines ciblant la classe de l'étudiant
3. **Deadlines de filière** : Deadlines ciblant la filière de l'étudiant
4. **Deadlines personnelles** : Deadlines ciblant spécifiquement l'étudiant par son nom

### Structure des données

#### Table User
- `id` : Identifiant unique
- `username` : Nom d'utilisateur (unique)
- `password` : Mot de passe hashé
- `role` : Rôle (admin/etudiant)
- `nom` : Nom complet de l'utilisateur
- `classe` : Classe de l'étudiant (ex: L3, M1)
- `filiere` : Filière de l'étudiant (ex: Informatique, Mathématiques)

#### Table Deadline
- `id` : Identifiant unique
- `titre` : Titre de la deadline
- `description` : Description détaillée
- `dateLimite` : Date et heure limite
- `type` : Type de deadline (TP, Examen, Projet, etc.)
- `cible` : Type de cible (classe/etudiant/promo)
- `valeurCible` : Valeur spécifique de la cible

### Exemple d'utilisation avec cURL

```bash
curl -X GET \
  http://localhost:8080/api/deadlines/my \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

### Exemple d'utilisation avec JavaScript

```javascript
fetch('/api/deadlines/my', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(deadlines => {
  console.log('Mes deadlines:', deadlines);
})
.catch(error => {
  console.error('Erreur:', error);
});
```
