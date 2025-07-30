const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));

console.log('📖 Reading tokens...');

// Create build directories  
if (!fs.existsSync('build')) fs.mkdirSync('build');
if (!fs.existsSync('build/android')) fs.mkdirSync('build/android', { recursive: true });
if (!fs.existsSync('build/ios')) fs.mkdirSync('build/ios', { recursive: true });
if (!fs.existsSync('build/flutter')) fs.mkdirSync('build/flutter', { recursive: true });

let colors = {};
let spacing = {};

// Function to extract tokens - handle both $value and value
function extractToken(token) {
  return token.$value || token.value;
}

function extractType(token) {
  return token.$type || token.type;
}

// Check root level tokens (under "")
if (tokens[""] && tokens[""].colors) {
  Object.entries(tokens[""].colors).forEach(([name, token]) => {
    const value = extractToken(token);
    const type = extractType(token);
    if (value && type === 'color') {
      colors[name] = value;
      console.log(`Found root color: ${name} = ${value}`);
    }
  });
}

if (tokens[""] && tokens[""].spacing) {
  Object.entries(tokens[""].spacing).forEach(([name, token]) => {
    const value = extractToken(token);
    const type = extractType(token);
    if (value && type === 'spacing') {
      spacing[name] = value;
      console.log(`Found root spacing: ${name} = ${value}`);
    }
  });
}

// Check core level tokens
if (tokens.core && tokens.core.colors) {
  Object.entries(tokens.core.colors).forEach(([name, token]) => {
    const value = extractToken(token);
    const type = extractType(token);
    if (value && type === 'color') {
      colors[name] = value;
      console.log(`Found core color: ${name} = ${value}`);
    }
  });
}

if (tokens.core && tokens.core.spacing) {
  Object.entries(tokens.core.spacing).forEach(([name, token]) => {
    const value = extractToken(token);
    const type = extractType(token);
    if (value && type === 'spacing') {
      spacing[name] = value;
      console.log(`Found core spacing: ${name} = ${value}`);
    }
  });
}

console.log('\n🎨 All colors found:', colors);
console.log('📏 All spacing found:', spacing);

// Generate Android colors.xml
let androidXml = '<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n';
Object.entries(colors).forEach(([name, value]) => {
  androidXml += `  <color name="${name}">${value}</color>\n`;
});
androidXml += '</resources>';

// Generate Android dimens.xml  
let androidDimens = '<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n';
Object.entries(spacing).forEach(([name, value]) => {
  androidDimens += `  <dimen name="spacing_${name}">${value}dp</dimen>\n`;
});
androidDimens += '</resources>';

// Generate iOS Swift
let iosSwift = 'import UIKit\n\npublic class AppColors {\n';
Object.entries(colors).forEach(([name, value]) => {
  const hex = value.replace('#', '');
  iosSwift += `  public static let ${name} = UIColor(red: 0x${hex.slice(0,2)}/255.0, green: 0x${hex.slice(2,4)}/255.0, blue: 0x${hex.slice(4,6)}/255.0, alpha: 1.0)\n`;
});
iosSwift += '}';

// Generate Flutter Dart
let flutterDart = 'import \'dart:ui\';\n\nclass AppColors {\n';
Object.entries(colors).forEach(([name, value]) => {
  const hex = value.replace('#', '').toUpperCase();
  flutterDart += `  static const Color ${name} = Color(0xFF${hex});\n`;
});
flutterDart += '}';

// Write files
fs.writeFileSync('build/android/colors.xml', androidXml);
fs.writeFileSync('build/android/dimens.xml', androidDimens);
fs.writeFileSync('build/ios/Colors.swift', iosSwift);  
fs.writeFileSync('build/flutter/app_colors.dart', flutterDart);

console.log(`\n📊 Generated files with ${Object.keys(colors).length} colors and ${Object.keys(spacing).length} spacing tokens`);
console.log('✅ All platform files created successfully!');
