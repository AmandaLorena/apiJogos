const sqlite3 = require('sqlite3').verbose()

// Conexão com o banco de dados
const db = new sqlite3.Database('./database.db', (error) => {
  if (error) {
    console.error('❌ Erro ao conectar no SQLite:', error)
    process.exit(1)
  } else {
    console.log('✅ SQLite conectado com sucesso')
  }
})

// Criação automática da tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jogos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      nota INTEGER NOT NULL,
      review TEXT NOT NULL
    )
  `, (error) => {
    if (error) {
      console.error('❌ Erro ao criar tabela:', error)
    } else {
      console.log('✅ Tabela de jogos verificada/criada com sucesso')
    }
  })
})

module.exports = db