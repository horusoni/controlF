// db/connect.mjs
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

export async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}


// Cria tabela se ainda não existir
export async function initDatabase() {
  const connection = await getConnection();

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
    
      id INT AUTO_INCREMENT COLLATE utf8mb4_unicode_ci PRIMARY KEY,
      nome VARCHAR(20),
      email VARCHAR(40),
      senha VARCHAR(30)
    );
  `;

  await connection.query(createTableQuery);
  console.log('Tabela "usuarios" verificada/criada com sucesso.');
  await connection.end();
}

// Inserir usuário
export async function saveUser(dados) {
  const connection = await getConnection();

  const insertQuery = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  const [result] = await connection.query(insertQuery, [dados.nome, dados.email, dados.passOne]);

  console.log('Usuário inserido com ID:', result.insertId);
  await connection.end();
}

// Buscar usuários
export async function pushUser(email) {
  const connection = await getConnection();

  const [rows] = await connection.query('SELECT * FROM usuarios where email = ? ',[email]);
 // console.log('Usuários do MySQL:');
 // console.table(rows);

  await connection.end();
  return rows;
}

export async function insertLancers(id, dados) {
  const connection = await getConnection();

  const insertQuery = 'INSERT INTO lancamentos (userId, titulo, data, movimento, valor) VALUES (?, ?, ?, ?, ?)';
  const [result] = await connection.query(insertQuery, [id, dados.titulo, dados.data, dados.movimento, dados.valor]);

  console.log('Lancamentos inseridos ID:', result.insertId);
  await connection.end();
}

export async function pushDados(userId) {
  const connection = await getConnection();

  const [rows] = await connection.query('SELECT * FROM lancamentos where userId = ? ',[userId]);

  await connection.end();
  return rows;
}

export async function deleteDados(id){
  const connection = await getConnection();

  const [rows] = await connection.query('DELETE FROM lancamentos WHERE id = ? ',[id]);

  await connection.end();
  return rows;
}

export async function listName(id) {
  const connection = await getConnection();

  const [rows] = await connection.query('SELECT nome FROM usuarios where id = ? ',[id]);

  await connection.end();
  return rows;
}