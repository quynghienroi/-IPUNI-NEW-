const fs = require('fs');

// Check AddMetricModal
const modalCode = fs.readFileSync('C:/Users/lekho/ipuni/frontend/src/components/metrics/AddMetricModal.jsx', 'utf-8');

const hasPostmeal = modalCode.includes('GLUCOSE_POSTMEAL');
const hasRandom = modalCode.includes('GLUCOSE_RANDOM');
const hasFasting = modalCode.includes('GLUCOSE_FASTING');
const hasHbaIc = modalCode.includes('HBAIC');

console.log('✅ Metrics Form Verification:\n');
console.log(`   Post-meal (2h): ${hasPostmeal ? '❌ Found' : '✓ Removed'}`);
console.log(`   Random: ${hasRandom ? '❌ Found' : '✓ Removed'}`);
console.log(`   Fasting: ${hasFasting ? '✓ Present' : '❌ Missing'}`);
console.log(`   HbA1c: ${hasHbaIc ? '✓ Present' : '❌ Missing'}`);

if (!hasPostmeal && !hasRandom && hasFasting && hasHbaIc) {
  console.log('\n✨ Perfect! Only Fasting & HbA1c options remain');
}
