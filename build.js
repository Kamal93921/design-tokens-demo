const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8')); // Changed this line

// Create build directories
if (!fs.existsSync('build')) fs.mkdirSync('build');
if (!fs.existsSync('build/android')) fs.mkdirSync('build/android', { recursive: true });
if (!fs.existsSync('build/ios')) fs.mkdirSync('build/ios', { recursive: true });
if (!fs.existsSync('build/flutter')) fs.mkdirSync('build/flutter', { recursive: true });

// Looking at your token structure, we need to extract from the nested format
const colors = tokens[""]?.colors || {}; // Based on your screenshot showing nested structure

// Generate Android colors.xml
let androidXml = '<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n';
Object.entries(colors).forEach(([name, token]) => {
  if (token.$value && token.$value.startsWith('#')) {
    androidXml += `  <color name="${name}">${token.$value}</color>\n`;
  }
});
androidXml += '</resources>';

// Generate iOS Swift
let iosSwift = 'import UIKit\n\npublic class AppColors {\n';
Object.entries(colors).forEach(([name, token]) => {
  if (token.$value && token.$value.startsWith('#')) {
    const hex = token.$value.replace('#', '');
    iosSwift += `  public static let ${name} = UIColor(red: 0x${hex.slice(0,2)}/255.0, green: 0x${hex.slice(2,4)}/255.0, blue: 0x${hex.slice(4,6)}/255.0, alpha: 1.0)\n`;
  }
});
iosSwift += '}';

// Generate Flutter Dart
let flutterDart = 'import \'dart:ui\';\n\nclass AppColors {\n';
Object.entries(colors).forEach(([name, token]) => {
  if (token.$value && token.$value.startsWith('#')) {
    const hex = token.$value.replace('#', '').toUpperCase();
    flutterDart += `  static const Color ${name} = Color(0xFF${hex});\n`;
  }
});
flutterDart += '}';

// Write files
fs.writeFileSync('build/android/colors.xml', androidXml);
fs.writeFileSync('build/ios/Colors.swift', iosSwift);
fs.writeFileSync('build/flutter/app_colors.dart', flutterDart);

console.log('✅ Generated all platform files!');
console.log('📁 Android XML:');
console.log(androidXml);
console.log('\n📱 iOS Swift:');
console.log(iosSwift);
console.log('\n🎯 Flutter Dart:');
console.log(flutterDart);
