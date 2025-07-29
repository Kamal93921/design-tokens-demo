const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

// Create Android XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n';
Object.entries(tokens).forEach(([name, value]) => {
  if (value.startsWith('#')) {
    xml += `  <color name="${name}">${value}</color>\n`;
  }
});
xml += '</resources>';

fs.writeFileSync('colors.xml', xml);
console.log('✅ Generated colors.xml');
console.log(xml);
