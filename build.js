const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));

console.log('📖 Full token structure:');
console.log(JSON.stringify(tokens, null, 2));

console.log('\n🔍 Looking for colors...');
console.log('Direct tokens:', Object.keys(tokens));

// Let's also check if they're nested
if (tokens.core && tokens.core.colors) {
  console.log('Found nested colors in core.colors:', Object.keys(tokens.core.colors));
}

// Create build directories  
if (!fs.existsSync('build')) fs.mkdirSync('build');
if (!fs.existsSync('build/android')) fs.mkdirSync('build/android', { recursive: true });
if (!fs.existsSync('build/ios')) fs.mkdirSync('build/ios', { recursive: true });
if (!fs.existsSync('build/flutter')) fs.mkdirSync('build/flutter', { recursive: true });

// Generate files (will be empty for now until we see the structure)
let androidXml = '<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n';
let iosSwift = 'import UIKit\n\npublic class AppColors {\n';
let flutterDart = 'import \'dart:ui\';\n\nclass AppColors {\n';

// Process tokens based on structure
let colorCount = 0;
Object.entries(tokens).forEach(([name, value]) => {
  console.log(`Processing: ${name} = ${JSON.stringify(value)}`);
  if (typeof value === 'string' && value.startsWith('#')) {
    colorCount++;
    androidXml += `  <color name="${name}">${value}</color>\n`;
    const hex = value.replace('#', '');
    iosSwift += `  public static let ${name} = UIColor(red: 0x${hex.slice(0,2)}/255.0, green: 0x${hex.slice(2,4)}/255.0, blue: 0x${hex.slice(4,6)}/255.0, alpha: 1.0)\n`;
    flutterDart += `  static const Color ${name} = Color(0xFF${hex.toUpperCase()});\n`;
  }
});

androidXml += '</resources>';
iosSwift += '}';
flutterDart += '}';

console.log(`\n📊 Found ${colorCount} colors to process`);

// Write files
fs.writeFileSync('build/android/colors.xml', androidXml);
fs.writeFileSync('build/ios/Colors.swift', iosSwift);  
fs.writeFileSync('build/flutter/app_colors.dart', flutterDart);

console.log('✅ Generated all platform files!');
