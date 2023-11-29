// db.js
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'erpizza',
  password: 'Azeroth@001',
  port: 5432,
});

client.connect()
  .then(() => console.log('Conectado ao banco de dados PostgreSQL'))
  .catch(err => console.error('Erro ao conectar ao banco de dados', err));

// Exporte o objeto 'client' para que você possa usá-lo em outros módulos
module.exports = client;
