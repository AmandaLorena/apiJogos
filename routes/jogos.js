const express = require('express')
const router = express.Router()
const db = require('../database')

// ===== GET /jogos =====
// Retorna lista completa de jogos
router.get('/', (req, res) => {
  db.all('SELECT * FROM jogos ORDER BY id', [], (error, rows) => {
    if (error) {
      console.error('Erro ao buscar jogos:', error)
      return res.status(500).json({
        erro: 'Erro ao buscar jogos'
      })
    }

    // Retorna array vazio se não houver dados
    return res.status(200).json(rows || [])
  })
})

// ===== GET /jogos/:id =====
// Busca um jogo específico pelo ID
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  // Valida se ID é um número válido
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      erro: 'ID inválido'
    })
  }

  db.get('SELECT * FROM jogos WHERE id = ?', [id], (error, row) => {
    if (error) {
      console.error('Erro ao buscar jogo:', error)
      return res.status(500).json({
        erro: 'Erro ao buscar jogo'
      })
    }

    // Jogo não encontrado
    if (!row) {
      return res.status(404).json({
        erro: 'Jogo não encontrado'
      })
    }

    return res.status(200).json(row)
  })
})

// ===== POST /jogos =====
// Cadastra um novo jogo com validações completas
router.post('/', (req, res) => {
  const { nome, tipo, nota, review } = req.body

  // Validação 1: Todos os campos obrigatórios
  if (!nome || !tipo || nota === undefined || !review) {
    return res.status(400).json({
      erro: 'Todos os campos são obrigatórios'
    })
  }

  // Validação 2: Tipo de dados
  if (typeof nome !== 'string' || typeof tipo !== 'string' || typeof review !== 'string') {
    return res.status(400).json({
      erro: 'Tipos de dados inválidos'
    })
  }

  // Validação 3: Nota é número inteiro e está entre 0 e 10
  if (typeof nota !== 'number' || nota % 1 !== 0 || nota < 0 || nota > 10) {
    return res.status(400).json({
      erro: 'Nota deve ser um número inteiro entre 0 e 10'
    })
  }

  // Validação 4: Strings não vazias
  if (nome.trim() === '' || tipo.trim() === '' || review.trim() === '') {
    return res.status(400).json({
      erro: 'Campos de texto não podem ser vazios'
    })
  }

  db.run(
    `INSERT INTO jogos (nome, tipo, nota, review)
     VALUES (?, ?, ?, ?)`,
    [nome.trim(), tipo.trim(), nota, review.trim()],
    function (error) {
      if (error) {
        console.error('Erro ao cadastrar jogo:', error)
        return res.status(500).json({
          erro: 'Erro ao cadastrar jogo'
        })
      }

      return res.status(201).json({
        id: this.lastID,
        nome: nome.trim(),
        tipo: tipo.trim(),
        nota,
        review: review.trim()
      })
    }
  )
})

// ===== PUT /jogos/:id =====
// Atualiza um jogo existente com validações completas
router.put('/:id', (req, res) => {
  const id = Number(req.params.id)

  // Validação 1: ID válido
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      erro: 'ID inválido'
    })
  }

  const { nome, tipo, nota, review } = req.body

  // Validação 2: Todos os campos obrigatórios
  if (!nome || !tipo || nota === undefined || !review) {
    return res.status(400).json({
      erro: 'Todos os campos são obrigatórios'
    })
  }

  // Validação 3: Tipo de dados
  if (typeof nome !== 'string' || typeof tipo !== 'string' || typeof review !== 'string') {
    return res.status(400).json({
      erro: 'Tipos de dados inválidos'
    })
  }

  // Validação 4: Nota é número inteiro e está entre 0 e 10
  if (typeof nota !== 'number' || nota < 0 || nota > 10) {
  return res.status(400).json({
    erro: 'Nota deve ser um número entre 0 e 10'
  })
}

  // Validação 5: Strings não vazias
  if (nome.trim() === '' || tipo.trim() === '' || review.trim() === '') {
    return res.status(400).json({
      erro: 'Campos de texto não podem ser vazios'
    })
  }

  // Verifica se jogo existe antes de atualizar
  db.get('SELECT * FROM jogos WHERE id = ?', [id], (error, row) => {
    if (error) {
      console.error('Erro ao verificar jogo:', error)
      return res.status(500).json({
        erro: 'Erro ao atualizar jogo'
      })
    }

    if (!row) {
      return res.status(404).json({
        erro: 'Jogo não encontrado'
      })
    }

    // Executa a atualização
    db.run(
      `UPDATE jogos
       SET nome = ?, tipo = ?, nota = ?, review = ?
       WHERE id = ?`,
      [nome.trim(), tipo.trim(), nota, review.trim(), id],
      (updateError) => {
        if (updateError) {
          console.error('Erro ao atualizar jogo:', updateError)
          return res.status(500).json({
            erro: 'Erro ao atualizar jogo'
          })
        }

        return res.status(200).json({
          id,
          nome: nome.trim(),
          tipo: tipo.trim(),
          nota,
          review: review.trim()
        })
      }
    )
  })
})

// ===== DELETE /jogos/:id =====
// Deleta um jogo
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)

  // Validação: ID válido
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      erro: 'ID inválido'
    })
  }

  // Verifica se jogo existe antes de deletar
  db.get('SELECT * FROM jogos WHERE id = ?', [id], (error, row) => {
    if (error) {
      console.error('Erro ao verificar jogo:', error)
      return res.status(500).json({
        erro: 'Erro ao deletar jogo'
      })
    }

    if (!row) {
      return res.status(404).json({
        erro: 'Jogo não encontrado'
      })
    }

    // Executa a deleção
    db.run('DELETE FROM jogos WHERE id = ?', [id], (deleteError) => {
      if (deleteError) {
        console.error('Erro ao deletar jogo:', deleteError)
        return res.status(500).json({
          erro: 'Erro ao deletar jogo'
        })
      }

      return res.sendStatus(204)
    })
  })
})

module.exports = router