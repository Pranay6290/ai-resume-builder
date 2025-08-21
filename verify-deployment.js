#!/usr/bin/env node

/**
 * Deployment Verification Script for AI Resume Builder
 * Checks if the project is ready for Render deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 AI Resume Builder - Deployment Verification');
console.log('===============================================\n');

let errors = 0;
let warnings = 0;

// Helper functions
const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} - Missing: ${filePath}`);
    errors++;
    return false;
  }
};

const checkFileContent = (filePath, searchText, description) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`⚠️  ${description} - Content issue in: ${filePath}`);
      warnings++;
      return false;
    }
  } else {
    console.log(`❌ ${description} - File missing: ${filePath}`);
    errors++;
    return false;
  }
};

const checkEnvSecurity = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasRealSecrets = content.includes('hexa123') || 
                          content.includes('fukrainsaan0707') || 
                          content.includes('resume123') ||
                          content.includes('AIzaSy');
    
    if (hasRealSecrets) {
      console.log(`🚨 ${description} - SECURITY RISK: Contains real secrets!`);
      errors++;
      return false;
    } else {
      console.log(`✅ ${description} - Safe (no real secrets)`);
      return true;
    }
  } else {
    console.log(`⚠️  ${description} - File missing: ${filePath}`);
    warnings++;
    return false;
  }
};

console.log('📋 Checking Required Files...');
console.log('==============================');

// Check essential files
checkFile('package.json', 'Root package.json');
checkFile('render.yaml', 'Render deployment config');
checkFile('backend/package.json', 'Backend package.json');
checkFile('frontend/package.json', 'Frontend package.json');
checkFile('backend/server.js', 'Backend entry point');
checkFile('frontend/src/main.jsx', 'Frontend entry point');

console.log('\n🔒 Checking Security...');
console.log('========================');

// Check .gitignore files
checkFileContent('.gitignore', '.env', 'Root .gitignore includes .env');
checkFileContent('backend/.gitignore', '.env', 'Backend .gitignore includes .env');
checkFileContent('frontend/.gitignore', '.env', 'Frontend .gitignore includes .env');

// Check .env.example files don't contain real secrets
checkEnvSecurity('backend/.env.example', 'Backend .env.example');
checkEnvSecurity('frontend/.env.example', 'Frontend .env.example');

// Check if .env files are properly ignored
if (fs.existsSync('backend/.env')) {
  console.log('⚠️  Backend .env file exists - Make sure it\'s in .gitignore');
  warnings++;
} else {
  console.log('✅ Backend .env file not in repository (good)');
}

if (fs.existsSync('frontend/.env')) {
  console.log('⚠️  Frontend .env file exists - Make sure it\'s in .gitignore');
  warnings++;
} else {
  console.log('✅ Frontend .env file not in repository (good)');
}

console.log('\n⚙️  Checking Configuration...');
console.log('==============================');

// Check render.yaml configuration
checkFileContent('render.yaml', 'ai-resume-builder-backend', 'Render config has backend service');
checkFileContent('render.yaml', 'ai-resume-builder-frontend', 'Render config has frontend service');
checkFileContent('render.yaml', 'healthCheckPath: /health', 'Render config has health check');

// Check package.json scripts
checkFileContent('package.json', '"start":', 'Root package.json has start script');
checkFileContent('backend/package.json', '"start": "node server.js"', 'Backend has correct start script');
checkFileContent('frontend/package.json', '"build": "vite build"', 'Frontend has build script');

console.log('\n🏗️  Checking Build Requirements...');
console.log('===================================');

// Check Node.js version requirements
checkFileContent('backend/package.json', '"node": ">=18.0.0"', 'Backend specifies Node.js version');
checkFileContent('frontend/package.json', '"node": ">=18.0.0"', 'Frontend specifies Node.js version');

// Check essential dependencies
checkFileContent('backend/package.json', '"express":', 'Backend has Express.js');
checkFileContent('backend/package.json', '"mongoose":', 'Backend has Mongoose');
checkFileContent('frontend/package.json', '"react":', 'Frontend has React');
checkFileContent('frontend/package.json', '"vite":', 'Frontend has Vite');

console.log('\n📊 Verification Summary');
console.log('=======================');

if (errors === 0 && warnings === 0) {
  console.log('🎉 Perfect! Your project is ready for Render deployment.');
  console.log('\n📝 Next Steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Connect repository to Render');
  console.log('3. Set environment variables in Render dashboard');
  console.log('4. Deploy using render.yaml configuration');
  process.exit(0);
} else if (errors === 0) {
  console.log(`⚠️  Project is mostly ready with ${warnings} warning(s).`);
  console.log('Consider addressing the warnings above before deployment.');
  console.log('\n📝 You can proceed with deployment, but monitor for issues.');
  process.exit(0);
} else {
  console.log(`❌ Found ${errors} error(s) and ${warnings} warning(s).`);
  console.log('Please fix the errors above before deploying.');
  console.log('\n🔧 Common fixes:');
  console.log('- Run: npm install');
  console.log('- Check file paths and names');
  console.log('- Ensure .env files are in .gitignore');
  console.log('- Remove real secrets from .env.example files');
  process.exit(1);
}
