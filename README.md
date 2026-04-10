# API de Livros Pro

API com CRUD completo, Autenticação JWT e Banco de Dados SQLite.

## Como instalar
1. `npm install`
2. `npm run setup-db`
3. `npm start`

## Rotas
- `GET /books`: Listagem com paginação e filtros.
- `POST /register`: Criar novo usuário.
- `POST /login`: Obter token JWT.
- `POST /books`: Criar livro (Requer Token).