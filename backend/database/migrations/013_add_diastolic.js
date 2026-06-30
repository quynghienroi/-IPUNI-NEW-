exports.up = function(knex) {
  return knex.schema.alterTable('metrics', function(t) {
    t.float('value_diastolic');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('metrics', function(t) {
    t.dropColumn('value_diastolic');
  });
};
