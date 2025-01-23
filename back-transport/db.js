const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();
const moment = require('moment');

const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: { 
    rejectUnauthorized: false 
  }
});

async function genererSemainesAnnuelles(annee) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO semaine (
        date_debut, 
        date_fin, 
        numero_semaine, 
        annee, 
        mois, 
        unique_identifier
      )
      SELECT 
        date_trunc('week', datum) AS date_debut,
        date_trunc('week', datum) + INTERVAL '6 days' AS date_fin,
        DENSE_RANK() OVER (PARTITION BY EXTRACT(YEAR FROM datum), EXTRACT(MONTH FROM datum) ORDER BY date_trunc('week', datum)) AS numero_semaine,
        EXTRACT(YEAR FROM datum) AS annee,
        EXTRACT(MONTH FROM datum) AS mois,
        CONCAT(
          EXTRACT(YEAR FROM datum), 
          '-', 
          LPAD(EXTRACT(MONTH FROM datum)::text, 2, '0'), 
          '-', 
          DENSE_RANK() OVER (PARTITION BY EXTRACT(YEAR FROM datum), EXTRACT(MONTH FROM datum) ORDER BY date_trunc('week', datum))
        ) AS unique_identifier
      FROM generate_series(
        date '${annee}-01-01', 
        date '${annee}-12-31', 
        '1 week'::interval
      ) AS datum
      ON CONFLICT (unique_identifier) DO NOTHING;
    `;
    
    await client.query(query);
    console.log(`Semaines générées pour ${annee}`);
  } finally {
    client.release();
  }
}

async function initDb() {
  const client = await pool.connect();
  try {
    const sqlScript = fs.readFileSync(path.join(__dirname, 'script.sql'), 'utf8');
    console.log('Chemin du script SQL:', path.join(__dirname, 'script.sql'));
    console.log('Initialisation de la base de données avec le script SQL.');
    await client.query(sqlScript);

    const annee = new Date().getFullYear();
    const { rows } = await pool.query(
      'SELECT COUNT(*) as count FROM semaine WHERE annee = $1', 
      [annee]
    );

    // Générer les semaines uniquement si elles n'existent pas
    if (parseInt(rows[0].count) === 0) {
      await genererSemainesAnnuelles(annee);
    }

  } catch (err) {
    console.error('Erreur lors de l\'exécution du script SQL:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb: initDb
};
