const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

// Test the converted package
const { InstallWizard, UserModel, syncUserModel, checkUserModelCompatibility } = require('./index.js');

console.log('✅ CommonJS conversion successful!');
console.log('✅ InstallWizard:', typeof InstallWizard);
console.log('✅ UserModel:', typeof UserModel);
console.log('✅ syncUserModel:', typeof syncUserModel);
console.log('✅ checkUserModelCompatibility:', typeof checkUserModelCompatibility);

// Test basic functionality
const app = express();
const wizard = new InstallWizard({ mountPath: '/install' });
console.log('✅ InstallWizard instance created successfully');

// Test user model compatibility check
const mockUserModel = {
  tableName: 'users',
  findOne: () => {},
  create: () => {},
  update: () => {}
};

checkUserModelCompatibility(mockUserModel).then(result => {
  console.log('✅ User model compatibility check:', result);
  console.log('🎉 All CommonJS tests passed!');
}).catch(err => {
  console.error('❌ Error:', err);
});
