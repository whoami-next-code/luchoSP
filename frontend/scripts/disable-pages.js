const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcPages = path.join(root, 'src', 'pages');
const indexPath = path.join(srcPages, 'index.tsx');
const disabledPath = path.join(srcPages, 'index.disabled.tsx');

try {
  if (fs.existsSync(indexPath)) {
    if (fs.existsSync(disabledPath)) {
      console.log('Already disabled: src/pages/index.disabled.tsx exists');
    } else {
      fs.renameSync(indexPath, disabledPath);
      console.log('Renamed src/pages/index.tsx -> src/pages/index.disabled.tsx');
    }
  } else {
    console.log('No src/pages/index.tsx found');
  }
} catch (err) {
  console.error('Failed to disable pages index:', err);
  process.exit(1);
}
