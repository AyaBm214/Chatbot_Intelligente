-- Database update script to add missing columns to deadline table
-- Run this script to update the database schema

-- Add missing columns to deadline table
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS titre VARCHAR(255);
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS type VARCHAR(100);
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS cible VARCHAR(100);
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS valeur_cible VARCHAR(255);

-- Update existing records with default values
UPDATE deadline SET 
    titre = 'Deadline ' || id,
    type = 'Information',
    cible = NULL,
    valeur_cible = NULL
WHERE titre IS NULL;

-- Insert test data with all fields
INSERT INTO deadline (titre, description, date_limite, type, cible, valeur_cible) VALUES
('Rendu TP Java', 'Rendre le TP sur les collections Java en format PDF', '2024-01-15 23:59:00', 'TP', 'classe', 'L3'),
('Examen Base de données', 'Examen final sur les bases de données relationnelles', '2024-01-20 14:00:00', 'Examen', 'promo', 'Informatique'),
('Projet PFE', 'Dépôt du projet de fin d''études', '2024-02-15 23:59:00', 'PFE', 'promo', 'Informatique'),
('Rapport de stage', 'Rapport de stage obligatoire', '2024-01-30 23:59:00', 'Rapport', 'classe', 'M1'),
('Deadline générale', 'Information importante pour tous les étudiants', '2024-02-01 23:59:00', 'Information', NULL, NULL),
('Rendu personnel - Jean Dupont', 'Rendu spécifique pour Jean Dupont', '2024-01-25 23:59:00', 'Projet', 'etudiant', 'Jean Dupont')
ON CONFLICT DO NOTHING;

-- Add explicit classe and filiere columns to deadline table
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS classe VARCHAR(100);
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS filiere VARCHAR(100);

-- Backfill classe/filiere from legacy cible/valeur_cible
UPDATE deadline SET classe = valeur_cible
WHERE classe IS NULL AND cible = 'classe' AND valeur_cible IS NOT NULL;

UPDATE deadline SET filiere = valeur_cible
WHERE filiere IS NULL AND cible = 'promo' AND valeur_cible IS NOT NULL;

-- Add student-specific column replacing legacy cible='etudiant'
ALTER TABLE deadline ADD COLUMN IF NOT EXISTS etudiant VARCHAR(255);
UPDATE deadline SET etudiant = valeur_cible
WHERE etudiant IS NULL AND cible = 'etudiant' AND valeur_cible IS NOT NULL;

-- Drop legacy targeting columns after backfill
ALTER TABLE deadline DROP COLUMN IF EXISTS cible;
ALTER TABLE deadline DROP COLUMN IF EXISTS valeur_cible;
