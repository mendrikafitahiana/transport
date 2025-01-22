@echo off
REM Créer le dossier principal
mkdir back-transport
cd back-transport

REM Initialiser le projet Node.js
call npm init -y

REM Installer Express
call npm install express

REM Créer les dossiers
mkdir routes
mkdir controllers
mkdir models
mkdir public
mkdir views

REM Créer les fichiers principaux
type nul > app.js
type nul > routes\index.js

REM Afficher la structure du projet
echo Structure du projet créée avec succès :
tree /F