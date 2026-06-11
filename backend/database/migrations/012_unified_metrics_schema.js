// Migration: Unified metrics table for glucose & HbA1c
// Date: 2026-06-11

exports.up = function(knex) {
  return knex.schema
    // Step 1: Create new unified metrics table
    .createTable('metrics_new', (t) => {
      t.increments('id').primary();
      t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');

      // Type identification (polymorphic)
      t.text('measurement_type').notNullable();
      t.text('measurement_category').notNullable();

      // Value & unit
      t.float('value').notNullable();
      t.text('unit').notNullable();

      // Timestamps
      t.dateTime('measured_at').notNullable();
      t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
      t.dateTime('updated_at');

      // Metadata
      t.text('note');

      // Calculated fields
      t.text('status');
      t.float('estimated_hba1c');

      // Indexes
      t.index(['user_id', 'measured_at']);
      t.index(['user_id', 'measurement_type']);
      t.index(['user_id', 'measurement_category']);
      t.index(['user_id', 'status']);
    })

    // Step 2: Migrate data from old metrics table
    .then(() => {
      return knex.raw(`
        INSERT INTO metrics_new (
          id, user_id, measurement_type, measurement_category,
          value, unit, measured_at, created_at, note, status
        )
        SELECT
          id,
          user_id,
          CASE
            WHEN type = 'fasting' THEN 'glucose_fasting'
            WHEN type = 'post_meal_2h' THEN 'glucose_postmeal'
            WHEN type = 'pre_meal' THEN 'glucose_random'
            WHEN type = 'pre_sleep' THEN 'glucose_random'
            ELSE 'glucose_random'
          END as measurement_type,
          'glucose' as measurement_category,
          value,
          'mmol/L' as unit,
          measured_at,
          created_at,
          note,
          NULL as status
        FROM metrics
      `);
    })

    // Step 3: Drop old table
    .then(() => knex.schema.dropTable('metrics'))

    // Step 4: Rename new table
    .then(() => knex.schema.renameTable('metrics_new', 'metrics'));
};

exports.down = function(knex) {
  // Rollback: recreate old table
  return knex.schema.createTable('metrics', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users');
    t.string('type').notNullable();
    t.float('value').notNullable();
    t.dateTime('measured_at').notNullable();
    t.text('note');
    t.dateTime('created_at').defaultTo(knex.fn.now());
  });
};
