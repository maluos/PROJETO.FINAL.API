const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
const SECRET = "MINHA_CHAVE_SUPER_SECRETA";

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });
  try {
    req.userId = jwt.verify(token, SECRET).id;
    next();
  } catch { res.status(401).json({ error: "Token inválido" }); }
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const [id] = await db('users').insert({ username, password: hash });
    res.status(201).json({ id, username });
  } catch { res.status(400).json({ error: "Usuário já existe" }); }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db('users').where({ username }).first();
  if (user && await bcrypt.compare(password, user.password)) {
    return res.json({ token: jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' }) });
  }
  res.status(401).json({ error: "Credenciais inválidas" });
});

app.get('/books', async (req, res) => {
  const { page = 1, limit = 5, genre, sort = 'id' } = req.query;
  const query = db('books');
  if (genre) query.where('genre', 'like', `%${genre}%`);
  const data = await query.clone().limit(limit).offset((page - 1) * limit).orderBy(sort, 'asc');
  const count = await query.clone().count('id as total').first();
  res.json({ total: count.total, page: Number(page), data });
});

app.post('/books', auth, [body('title').isLength({ min: 3 })], async (req, res) => {
  if (!validationResult(req).isEmpty()) return res.status(422).json({ errors: "Título muito curto" });
  const [id] = await db('books').insert({ ...req.body, user_id: req.userId });
  res.status(201).json({ id, ...req.body });
});

app.put('/books/:id', auth, async (req, res) => {
  const row = await db('books').where({ id: req.params.id }).update(req.body);
  row ? res.json({ success: true }) : res.status(404).json({ error: "Não encontrado" });
});

app.delete('/books/:id', auth, async (req, res) => {
  const row = await db('books').where({ id: req.params.id }).del();
  row ? res.status(204).send() : res.status(404).json({ error: "Não encontrado" });
});
// No final do arquivo src/app.js
// No final do src/app.js
if (require.main === module) {
    app.listen(8080, () => console.log("🚀 Rodando em http://localhost:8080"));
  }