const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3001/api/v1/auth/demo');
    const token = loginRes.data.data.token;
    console.log("Got token.");
    
    console.time("fetchMedications");
    const medsRes = await axios.get('http://localhost:3001/api/v1/medications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.timeEnd("fetchMedications");
    
    console.log("Success:", medsRes.data.data.length);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
