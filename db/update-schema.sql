-- Ajouter le champ de mot de passe à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Ajouter les champs pour la réinitialisation de mot de passe
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP WITH TIME ZONE;

-- Créer un index pour la recherche par token de réinitialisation
CREATE INDEX IF NOT EXISTS users_reset_token_idx ON users(reset_token);
