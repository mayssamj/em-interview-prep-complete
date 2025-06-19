#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const engine = process.env.DB_ENGINE || 'mysql';
const schemaDir = path.join(__dirname, '..', 'prisma');
const target = path.join(schemaDir, 'schema.prisma');
const source = path.join(schemaDir, `schema.${engine}.prisma`);

if (!fs.existsSync(source)) {
  console.error(`Unknown DB engine "${engine}".`);
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`Prisma schema switched to ${engine}.`);
