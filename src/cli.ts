import { buildReadme } from '.';
import { readFileSync, writeFileSync } from 'fs';
import { cwd } from 'process';

const readmePath = process.argv[2];
const url = process.argv[3];
const text = readFileSync(readmePath, 'utf8');

try {
  const { content, replacements } = buildReadme(readmePath, text, cwd(), url);

  writeFileSync(readmePath, content, 'utf8');

  if (replacements.length) {
    console.log(`Updating ${readmePath}`);
    for (const { name, filename } of replacements) {
      console.log(`Updated [${name}](${filename})`);
    }
  } else {
    console.error(`No examples found in ${readmePath}`);
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
