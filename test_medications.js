const db = require('./backend/src/config/database');
async function test() {
  console.log('Testing...');
  const meds = await db('medications').where({ user_id: 1, is_active: 1 }).orderBy('created_at', 'desc');
  console.log('Meds:', meds.length);
  process.exit(0);
}
test();
