#!/bin/bash

echo "🔮 Setting up CODEX Crystal Archive Next.js Website..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create missing directories
echo "📁 Creating directories..."
mkdir -p public/images
mkdir -p types
mkdir -p hooks

# Create .env.local
echo "⚙️ Creating environment file..."
cat > .env.local << EOF
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF

# Create .gitignore additions
echo "📝 Updating .gitignore..."
cat >> .gitignore << EOF

# Next.js
.next/
out/
build/

# Environment variables
.env*.local

# Dependencies
node_modules/

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
echo "📚 See README-NEXTJS.md for full documentation"
