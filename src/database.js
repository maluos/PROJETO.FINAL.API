const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: "./database.sqlite" },
    useNullAsDefault: true
  });
  
  async function setup() {
    await knex.schema.dropTableIfExists('books');
    await knex.schema.dropTableIfExists('users');
  
    await knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
    });
  
    await knex.schema.createTable('books', table => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('author').notNullable();
      table.integer('year');
      table.string('genre');
      table.integer('user_id').references('id').inTable('users');
    });
  
    const books = Array.from({ length: 20 }).map((_, i) => ({
      title: `Livro ${i + 1}`,
      author: `Autor ${i + 1}`,
      year: 2000 + i,
      genre: i % 2 === 0 ? 'Ficção' : 'Não-Ficção'
    }));
    
    await knex('books').insert(books);
    console.log("✅ Banco de dados inicializado com 20 registros!");
  }
  
  if (require.main === module) setup();
  module.exports = knex;