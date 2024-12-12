#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetDir = path.resolve(process.cwd(), "telegraph-dashboard");
const sourceDir = path.resolve(__dirname, "..");

const excludedFiles = [
  "node_modules",
  "bin",
  "package-lock.json",
  ".git",
  ".gitignore",
];

if (!fs.existsSync(sourceDir)) {
  console.error(`Error: Source directory "${sourceDir}" does not exist.`);
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.error(`Error: Directory "${targetDir}" already exists.`);
  process.exit(1);
}

console.log(`Creating project in ${targetDir}...`);

fs.mkdirSync(targetDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!excludedFiles.includes(path.basename(src))) {
      fs.mkdirSync(dest, { recursive: true });
      for (const file of fs.readdirSync(src)) {
        copyRecursiveSync(path.join(src, file), path.join(dest, file));
      }
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const file of fs.readdirSync(sourceDir)) {
  copyRecursiveSync(path.join(sourceDir, file), path.join(targetDir, file));
}

console.log(`Project created successfully in ${targetDir}`);
console.log("Run the following commands to get started:");
console.log(`  cd telegraph-dashboard`);
console.log(`  npm install`);
console.log(`  npm run dev`);
