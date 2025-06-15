#!/bin/bash
set -e

echo "Importing database data..."

# Check if dump directory exists
if [ ! -d "dump" ]; then
    echo "Error: dump directory not found"
    exit 1
fi

# Import using the seed script (which contains all the data)
echo "Running seed script to populate database..."
node seed-simple.js

echo "Data import completed!"
echo "Imported:"
echo "- 15 companies"
echo "- 334+ questions"
echo "- Sample user accounts"
echo "- 21 sample stories"
