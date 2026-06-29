const db = require('./backend/src/config/database');
async function test() {
  try {
    const meds = await db('medications').where({ user_id: 1, is_active: 1 }).orderBy('created_at', 'desc');
    console.log("Success meds:", meds.length);
  } catch(e) {
    console.log("Error:", e);
  }
  process.exit(0);
}
test();
