CREATE TABLE IF NOT EXISTS utilisateur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  contact VARCHAR(255) UNIQUE NOT NULL,
  mail VARCHAR(255) NOT NULL,
  mdp VARCHAR(255),
  adresse VARCHAR(255) NOT NULL,
  quartier VARCHAR(255) NOT NULL,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semaine (
  id SERIAL PRIMARY KEY,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  numero_semaine INT NOT NULL,
  mois INT NOT NULL,
  annee INT NOT NULL,
  unique_identifier VARCHAR(50) UNIQUE,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS planning (
  id SERIAL PRIMARY KEY,
  semaine_id INT NOT NULL,
  utilisateur_id INT NOT NULL,
  jour VARCHAR(255) NOT NULL, -- lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche
  ramassage_heure TIME,
  depot_heure TIME,
  ramassage_status BOOLEAN DEFAULT false, -- off (true) ou non (false)
  depot_status BOOLEAN DEFAULT false -- off (true) ou non (false)
);

