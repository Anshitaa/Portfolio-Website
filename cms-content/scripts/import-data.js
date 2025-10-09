#!/usr/bin/env node

/**
 * Script to import initial data into Sanity CMS
 * Run with: node scripts/import-data.js
 */

const fs = require('fs');
const path = require('path');

// Import data files
const personalInfo = require('../data/personalInfo.json');
const projects = require('../data/projects.json');
const experience = require('../data/experience.json');
const education = require('../data/education.json');
const skills = require('../data/skills.json');
const publications = require('../data/publications.json');

// Combine all data
const allData = [
  personalInfo,
  ...projects,
  ...experience,
  ...education,
  ...skills,
  ...publications
];

// Generate Sanity import format
const importData = {
  documents: allData
};

// Write to file
const outputPath = path.join(__dirname, '../sanity-import.json');
fs.writeFileSync(outputPath, JSON.stringify(importData, null, 2));

console.log('✅ Data prepared for Sanity import!');
console.log(`📄 Import file created: ${outputPath}`);
console.log('\n📋 Next steps:');
console.log('1. Set up your Sanity project and get the Project ID');
console.log('2. Install Sanity CLI: npm install -g @sanity/cli');
console.log('3. Login to Sanity: sanity login');
console.log('4. Import data: sanity dataset import sanity-import.json production --replace');
console.log('\n🔗 Or use the Sanity Studio interface to manually import the data.');
