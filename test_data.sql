-- Script pour ajouter des données de test pour le formulaire admin

-- Insérer des étudiants de test avec différentes classes et filières
INSERT INTO users (username, password, role, nom, classe, filiere) VALUES
('etudiant1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Jean Dupont', 'L3', 'Informatique'),
('etudiant2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Marie Martin', 'L3', 'Informatique'),
('etudiant3', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Pierre Durand', 'M1', 'Informatique'),
('etudiant4', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Sophie Bernard', 'M1', 'Informatique'),
('etudiant5', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Lucas Petit', 'L3', 'Mathématiques'),
('etudiant6', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Emma Roux', 'M1', 'Mathématiques'),
('etudiant7', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Thomas Moreau', 'L3', 'Physique'),
('etudiant8', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'etudiant', 'Julie Leroy', 'M1', 'Physique');

-- Insérer un admin de test
INSERT INTO users (username, password, role, nom, classe, filiere) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrateur', NULL, NULL);

-- Insérer quelques deadlines de test
INSERT INTO deadline (titre, description, date_limite, type, cible, valeur_cible) VALUES
('Rendu TP Java', 'Rendre le TP sur les collections Java en format PDF', '2024-01-15 23:59:00', 'TP', 'classe', 'L3'),
('Examen Base de données', 'Examen final sur les bases de données relationnelles', '2024-01-20 14:00:00', 'Examen', 'promo', 'Informatique'),
('Projet PFE', 'Dépôt du projet de fin d''études', '2024-02-15 23:59:00', 'PFE', 'promo', 'Informatique'),
('Rapport de stage', 'Rapport de stage obligatoire', '2024-01-30 23:59:00', 'Rapport', 'classe', 'M1'),
('Deadline générale', 'Information importante pour tous les étudiants', '2024-02-01 23:59:00', 'Information', NULL, NULL),
('Rendu personnel - Jean Dupont', 'Rendu spécifique pour Jean Dupont', '2024-01-25 23:59:00', 'Projet', 'etudiant', 'Jean Dupont');
