const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));

// Create build directories  
if (!fs.existsSync('build')) fs.mkdirSync('build');
if (!fs.existsSync('build/android')) fs.mkdirSync('build/android', { recursive: true });
if (!fs.existsSync('build/ios')) fs.mkdirSync('build/ios', { recursive: true });
if (!fs.existsSync('build/flutter')) fs.mkdirSync('build/flutter', { recursive: true });

console.log('📖 Reading token file from tokens/tokens.json...');
console.log('🔍 Token structure:', JSON.stringify(tokens, null, 2));

// Generate Android colors.xml
let androidXml = '<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n';

// Handle the simple structure (primary: "#3182ce", secondary: "#805ad5", etc.)
Object.entries(tokens).forEach(([name, value]) => {
  if (typeof value === 'string' && value.startsWith('#')) {
    androidXml += `  <color name="${name}">${value}</color>\n`;
  }
});

androidXml += '</resources>';

// Generate iOS Swift  
let iosSwift = 'import UIKit\n\npublic class AppColors {\n';
Object.entries(tokens).forEach(([name, value]) => {
  if (typeof value === 'string' && value.startsWith('#')) {
    const hex = value.replace('#', '');
    iosSwift += `  public static let ${name} = UIColor(red: 0x${hex.slice(0,2)}/255.0, green: 0x${hex.slice(2,4)}/255.0, blue: 0x${hex.slice(4,6)}/255.0, alpha: 1.0)\n`;
  }
});
iosSwift += '}';

// Generate Flutter Dart
let flutterDart = 'import \'dart:ui\';\n\nclass AppColors {\n';
Object.entries(tokens).forEach(([name, value]) => {
  if (typeof value === 'string' && value.startsWith('#')) {
    const hex = value.replace('#', '').toUpperCase();
    flutterDart += `  static const Color ${name} = Color(0xFF${hex});\n`;
  }
});
flutterDart += '}';

// Write files
fs.writeFileSync('build/android/colors.xml', androidXml);
fs.writeFileSync('build/ios/Colors.swift', iosSwift);  
fs.writeFileSync('build/flutter/app_colors.dart', flutterDart);

console.log('✅ Generated all platform files!');
console.log('📁 Files created in build/ folder');
