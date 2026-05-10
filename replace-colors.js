const fs = require('fs');
const path = require('path');

const replacements = {
  '#09090b': 'var(--bg-root)',
  '#111113': 'var(--bg-sidebar)',
  '#18181b': 'var(--bg-card)',
  '#1e1e22': 'var(--bg-hover)',
  '#27272a': 'var(--border-subtle)',
  '#3f3f46': 'var(--border-active)',
  '#e4e4e7': 'var(--text-primary)',
  '#d4d4d8': 'var(--text-secondary)',
  '#a1a1aa': 'var(--text-muted)',
  '#71717a': 'var(--text-muted)',
  '#52525b': 'var(--text-dim)',
  '#6366f1': 'var(--accent-primary)',
  '#4f46e5': 'var(--accent-primary-hover)',
  '#818cf8': 'var(--accent-secondary)',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [hex, cssVar] of Object.entries(replacements)) {
    // case insensitive replacement of hex codes
    const regex = new RegExp(hex, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, cssVar);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src/components'));
walkDir(path.join(__dirname, 'src/app'));
console.log('Done!');
