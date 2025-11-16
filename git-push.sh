#!/bin/bash
# Helper script to push to GitHub using token from .env

set -e

# Load token from .env
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Create .env with: GITHUB_TOKEN=your_token_here"
    exit 1
fi

source .env

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN not set in .env"
    exit 1
fi

# Push using token
echo "🚀 Pushing to GitHub..."
git push https://${GITHUB_TOKEN}@github.com/astoeffer/moodle-plugin-marketplace.git master

echo "✅ Successfully pushed to GitHub"
