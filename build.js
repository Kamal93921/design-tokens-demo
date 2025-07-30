const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));

console.log('📖 Full token structure:');
console.log(JSON.stringify(tokens, null, 2));

// Create build directories  
if (!fs.existsSync('build')) fs.mkdirSync('build');
if (!fs.existsSync('build/android')) fs.mkdirSync('build/android', { recursive: true });
if (!fs.existsSync('build/ios')) fs.mkdirSync('build/ios', { recursive: true });
if (!fs.existsSync('build/flutter')) fs.mkdirSync('build/flutter', { recursive: true });

// Function to extract tokens from nested structure
function extractTokens(obj, path = []) {
  let colors = {};
  let spacing = {};
  
  function traverse(current, currentPath) {
    if (current && typeof current === 'object') {
      // Check if this is a token with $value
      if (current.$type && current.$value) {
        const name = currentPath[currentPath.length - 1];
        if (current.$type === 'color') {
          colors[name] = current.$value;
          console.log(`Found color: ${name} = ${current.$value}`);
        } else if (current.$type === 'spacing') {
          spacing[name] = current.$value;
          console.log(`Found spacing: ${name} = ${current.$value}`);
        }
      } else {
        // Continue traversing
        Object.entries(current).forEach(([key, value]) => {
          traverse(value, [...currentPath, key]);
        });
      }
    }
  }
  
  traverse(obj, path);
  return { colors, spacing };
}

const { colors, spacing } = extractTokens(tokens);

console.log('\n🎨 Extracted colors:', colors);
console.log('📏 Extracted spacing:', spacing);

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
