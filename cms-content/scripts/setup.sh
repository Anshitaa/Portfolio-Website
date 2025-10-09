#!/bin/bash

# Setup script for Anshita's Portfolio CMS
echo "🚀 Setting up Anshita Bhardwaj's Portfolio CMS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Preparing data for import..."
node scripts/import-data.js

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Sanity project at https://sanity.io"
echo "2. Copy your Project ID and Dataset name"
echo "3. Copy env.example to .env and add your Sanity credentials"
echo "4. Run 'npm run dev' to start the Sanity Studio"
echo "5. Import the generated sanity-import.json file into your dataset"
echo ""
echo "🎉 Your CMS is ready to use!"
