const express = require('express')
const cors = require('cors')

const jogosRoutes = require('./routes/jogos')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// ===== POST /login =====
// Autenticação com token UUID
app.post('/login', (req, res) => {
  const { email, password } = req.body

  // Validação: Campos obrigatórios
  if (!email || !password) {
    return res.status(400).json({
      erro: 'Email e password são obrigatórios'
    })
  }

  // Credenciais corretas conforme especificação
  if (email === 'usuario@esoft.com' && password === 'Abc123') {
    return res.status(200).json({ 
      token: '550e8400-e29b-41d4-a716-446655440000' 
    })
  }

  return res.status(401).json({ erro: 'Credenciais inválidas' })
})

// ===== Rotas de Jogos =====
app.use('/jogos', jogosRoutes)

// ===== Erro 404 =====
// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada'
  })
})

// ===== Iniciar Servidor =======
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('')
  console.log('=====================================')
  console.log('🎮 API BIBLIOTECA DE JOGOS BY LOBO(A) DE WALL STREET')
  console.log('=====================================')
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`)
  console.log(`📚 Base URL: http://localhost:${PORT}`)
  console.log('=====================================')
  console.log('')
  
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n📴 Encerrando servidor...')
  process.exit(0)
})
