#!/usr/bin/env node

/**
 * Script untuk generate placeholder .patt files
 * Untuk production, replace dengan pattern files yang di-generate dari marker images asli
 *
 * Usage: node generate-patterns.js
 */

const fs = require("fs");
const path = require("path");

// Placeholder pattern (simplified - untuk testing saja)
// Pattern ini HARUS diganti dengan pattern asli dari AR.js Marker Generator
const PLACEHOLDER_PATTERN = `
  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0
  0 255 255 255 255 255 255 255 255 255 255 255 255 255 255   0
  0 255   0   0   0   0   0   0   0   0   0   0   0   0 255   0
  0 255   0 255 255 255 255 255 255 255 255 255 255   0 255   0
  0 255   0 255   0   0   0   0   0   0   0   0 255   0 255   0
  0 255   0 255   0 255 255 255 255 255 255   0 255   0 255   0
  0 255   0 255   0 255   0   0   0   0 255   0 255   0 255   0
  0 255   0 255   0 255   0 255 255   0 255   0 255   0 255   0
  0 255   0 255   0 255   0 255 255   0 255   0 255   0 255   0
  0 255   0 255   0 255   0   0   0   0 255   0 255   0 255   0
  0 255   0 255   0 255 255 255 255 255 255   0 255   0 255   0
  0 255   0 255   0   0   0   0   0   0   0   0 255   0 255   0
  0 255   0 255 255 255 255 255 255 255 255 255 255   0 255   0
  0 255   0   0   0   0   0   0   0   0   0   0   0   0 255   0
  0 255 255 255 255 255 255 255 255 255 255 255 255 255 255   0
  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0
`.trim();

const markers = [
  "pattern-burger",
  "pattern-fries",
  "pattern-soda",
  "pattern-chicken",
  "pattern-pizza",
];

const markersDir = path.join(__dirname, "assets", "markers");

// Buat folder jika belum ada
if (!fs.existsSync(markersDir)) {
  fs.mkdirSync(markersDir, { recursive: true });
}

console.log("🔨 Generating placeholder .patt files...\n");

markers.forEach((marker) => {
  const filePath = path.join(markersDir, `${marker}.patt`);

  // Write placeholder pattern
  fs.writeFileSync(filePath, PLACEHOLDER_PATTERN);

  console.log(`✅ Created: ${marker}.patt`);
});

console.log("\n⚠️  IMPORTANT:");
console.log("These are placeholder patterns for development only.");
console.log("For production, generate real patterns at:");
console.log(
  "https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html\n"
);

console.log("📚 See MARKER_GUIDE.md for complete instructions.");
