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
  
  content = content.replace(/bg-slate-dark/g, 'bg-gray-50');
  content = content.replace(/bg-slate-card/g, 'bg-white');
  content = content.replace(/bg-slate-800/g, 'bg-white');
  content = content.replace(/bg-slate-900/g, 'bg-gray-100');
  
  content = content.replace(/border-slate-700\/50/g, 'border-gray-200');
  content = content.replace(/border-slate-700/g, 'border-gray-200');
  content = content.replace(/border-slate-600/g, 'border-gray-300');
  content = content.replace(/border-slate-800/g, 'border-gray-100');
  
  content = content.replace(/text-slate-400/g, 'text-gray-500');
  content = content.replace(/text-slate-300/g, 'text-gray-600');
  content = content.replace(/text-slate-200/g, 'text-gray-700');
  content = content.replace(/text-slate-100/g, 'text-gray-800');
  
  content = content.replace(/text-electric-blue/g, 'text-[#00c875]');
  content = content.replace(/bg-electric-blue/g, 'bg-[#00c875]');
  content = content.replace(/ring-electric-blue/g, 'ring-[#00c875]');
  content = content.replace(/hover:bg-blue-600/g, 'hover:bg-[#00a862]');
  
  // Text white to gray-900 everywhere first
  content = content.replace(/text-white/g, 'text-gray-900');
  
  // Re-adjust for buttons and dark elements
  // We look for classNames containing bg-[#00c875] or bg-red or bg-green and change text-gray-900 back to text-white
  content = content.replace(/className=\"([^\"]*)\"/g, (match, classes) => {
    if (classes.includes('bg-[#00c875]') || classes.includes('bg-red-500') || classes.includes('bg-red-600') || classes.includes('bg-[#00a862]')) {
      return `className="${classes.replace('text-gray-900', 'text-white')}"`;
    }
    // sidebar links active background is usually the brand color or gray. Let's let them be.
    return match;
  });

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Modifications applied successfully');
