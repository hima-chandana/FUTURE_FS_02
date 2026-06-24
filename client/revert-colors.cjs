const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/bg-gray-50/g, 'bg-slate-dark');
  content = content.replace(/bg-white/g, 'bg-slate-card');
  content = content.replace(/bg-gray-100/g, 'bg-slate-900');
  
  content = content.replace(/border-gray-200\/30/g, 'border-slate-700/50');
  content = content.replace(/border-gray-200/g, 'border-slate-700');
  content = content.replace(/border-gray-300/g, 'border-slate-600');
  
  content = content.replace(/text-gray-500/g, 'text-slate-400');
  content = content.replace(/text-gray-600/g, 'text-slate-300');
  content = content.replace(/text-gray-700/g, 'text-slate-200');
  content = content.replace(/text-gray-800/g, 'text-slate-100');
  
  content = content.replace(/text-\[\#00c875\]/g, 'text-electric-blue');
  content = content.replace(/bg-\[\#00c875\]/g, 'bg-electric-blue');
  content = content.replace(/ring-\[\#00c875\]/g, 'ring-electric-blue');
  content = content.replace(/hover:bg-\[\#00a862\]/g, 'hover:bg-blue-600');
  
  content = content.replace(/text-gray-900/g, 'text-white');
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Revert modifications applied successfully');
