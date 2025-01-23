const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');

// Middleware pour parser le JSON
app.use(express.json());

// Route exemple
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Démarrer le serveur

app.use((req, res, next) => {
    res.status(404).send('Page non trouvée');
});

// Appeler initDb avant de démarrer le serveur
db.initDb()
  .then(() => {
    console.log('Base de données initialisée avec succès');
    
    // Démarrage du serveur après l'initialisation de la base de données
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1); // Quitter en cas d'erreur critique d'initialisation
  });