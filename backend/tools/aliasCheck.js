// tools/aliasCheck.js
require('module-alias/register');

try {
  const test = require('@controllers/lender/LenderTermsExporter');
  console.log('✅ SUCCESS: Alias worked — LenderTermsExporter loaded.');
} catch (err) {
  console.error('❌ ERROR: Alias failed to resolve.');
  console.error(err.message);
}
