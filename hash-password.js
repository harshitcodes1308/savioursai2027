const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Please provide a password');
  console.log('Usage: node hash-password.js YourPassword123');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\n✅ Password hashed successfully!\n');
  console.log('Hash:', hash);
  console.log('\nUse this in your SQL UPDATE command:');
  console.log(`UPDATE "User" SET password = '${hash}' WHERE email = 'your@email.com';`);
  console.log('');
});
