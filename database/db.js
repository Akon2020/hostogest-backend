import mysql from 'mysql2/promise';
import { DB_HOST, DB_NAME, DB_PASS, DB_USER, NODE_ENV } from "../config/env.js";

if (!DB_HOST) {
  throw new Error(
    "Veuillez definir le host de la base de donnée dans les variables d'environnement .env.<development/production>.local"
  );
}

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

db.getConnection()
  .then(connection => {
    console.log(`Base de données connectée avec succès en mode ${NODE_ENV}`);
    connection.release();
  })
  .catch(err => {
    console.log(`Erreur de connexion à la base de données: ${err.message}`);
  });


export default db;
