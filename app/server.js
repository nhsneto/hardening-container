const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function preparaBanco() {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
  )
`);

  await pool.execute(
    "INSERT IGNORE INTO alunos (nome, curso, email) VALUES (?, ?, ?)",
    ["Nelson Neto", "DevOps", "nelson@email.com"],
  );
}

async function getAluno(email) {
  const [rows] = await pool.execute("SELECT * FROM alunos WHERE email = ?", [
    email,
  ]);
  return rows;
}

app.get("/", async (req, res) => {
  const email = "nelson@email.com";
  const rows = await getAluno(email);
  res.json(rows[0]);
});

app.listen(PORT, () => {
  preparaBanco();
  console.log(`App escutando na porta ${PORT}`);
});
