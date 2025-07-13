// File: pathFixScript.js
// Path: backend/tests/pathFixScript.js
// Purpose: Update relative paths to @aliases using path_fix_report.json
// 👑 Cod1 Crown Certified

const fs = require('fs');
const path = require('path');

const fixReportPath = path.join(__dirname, 'path_fix_report.json');
const rootDir = path.resolve(__dirname, '../../');

const replacements = [
  { pattern: /\.\.\/\.\.\/controllers\//g, replacement: '@controllers/' },
  { pattern: /\.\.\/\.\.\/middleware\//g, replacement: '@middleware/' },
  { pattern: /\.\.\/\.\.\/utils\//g, replacement: '@utils/' },
  { pattern: /\.\.\/\.\.\/models\//g, replacement: '@models/' },
  { pattern: /\.\.\/\.\.\/routes\//g, replacement: '@routes/' },
  { pattern: /\.\.\/components\//g, replacement: '@components/' },
  { pattern: /\.\.\/__mocks_\//g, replacement: '@__mocks_/' }
];

if (!fs.existsSync(fixReportPath)) {
  console.error('❌ path_fix_report.json not found.');
  process.exit(1);
}

const fileList = JSON.parse(fs.readFileSync(fixReportPath, 'utf8'));

fileList.forEach(({ name, path: relativePath }) => {
  try {
    const filePath = path.join(rootDir, relativePath);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${name} with @ aliases`);
    } else {
      console.log(`➖ No changes needed for ${name}`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${name}:`, err);
  }
});

// File: pathFixValidator.js
// Path: backend/tests/pathFixValidator.js
// Purpose: Scan files for remaining relative paths post-alias fix
// 👑 Cod1 Crown Certified

const validationReport = [];

fileList.forEach(({ name, path: relativePath }) => {
  const filePath = path.join(rootDir, relativePath);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasRelPath = /\.\.\//.test(content) && !/@(components|controllers|models|routes|utils|middleware|__mocks_)/.test(content);

    if (hasRelPath) {
      validationReport.push({ file: name, issue: 'Contains remaining relative imports (../)' });
    }
  } catch (err) {
    validationReport.push({ file: name, issue: `Error reading file: ${err.message}` });
  }
});

fs.writeFileSync(
  path.join(__dirname, 'path_fix_validation.json'),
  JSON.stringify(validationReport, null, 2),
  'utf8'
);

console.log('✅ Validation complete. Report saved to path_fix_validation.json');


