exports.up = function(knex) {
  return knex.schema.createTable('scan_usages', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE');
    t.dateTime('scanned_at').notNullable().defaultTo(knex.fn.now());
    t.string('result').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('scan_usages');
};
