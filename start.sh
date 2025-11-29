#!/bin/bash

# An Immigrant's Story - Development Launcher
# This script helps you quickly open the project

echo "=================================="
echo "An Immigrant's Story"
echo "by Dick Griola"
echo "=================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📁 Project location: $SCRIPT_DIR"
echo ""
echo "Choose an option:"
echo ""
echo "1) Open in VS Code"
echo "2) Open index.html in browser"
echo "3) Open reader.html in browser"
echo "4) Open admin.html in browser"
echo "5) Show project info"
echo "6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
  1)
    echo "Opening in VS Code..."
    code "$SCRIPT_DIR"
    ;;
  2)
    echo "Opening landing page in browser..."
    open "$SCRIPT_DIR/index.html"
    ;;
  3)
    echo "Opening reader in browser..."
    open "$SCRIPT_DIR/reader.html"
    ;;
  4)
    echo "Opening admin dashboard in browser..."
    open "$SCRIPT_DIR/admin.html"
    echo "Admin code: 8123"
    ;;
  5)
    echo ""
    echo "📊 Project Statistics:"
    echo "-----------------------------------"
    echo "Total chapters: $(ls -1 "$SCRIPT_DIR/chapters" | wc -l)"
    echo "JavaScript modules: $(ls -1 "$SCRIPT_DIR/src/js"/*.js | wc -l)"
    echo "CSS files: $(ls -1 "$SCRIPT_DIR/src/css"/*.css | wc -l)"
    echo ""
    echo "📝 Quick Tips:"
    echo "- Use Live Server in VS Code (port 5500)"
    echo "- Admin code: 8123"
    echo "- See QUICK_START.md for help"
    ;;
  6)
    echo "Goodbye!"
    exit 0
    ;;
  *)
    echo "Invalid choice. Please run again."
    exit 1
    ;;
esac

echo ""
echo "✅ Done!"
