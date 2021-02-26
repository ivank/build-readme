import { buildReadme } from '.';
import { readFileSync, writeFileSync } from 'fs';
import { cwd } from 'process';
import { isAbsolute, join } from 'path';

const readmePath = isAbsolute(process.argv[2]) ? process.argv[2] : join(cwd(), process.argv[2]);
const url = process.argv[3];
const text = readFileSync(readmePath, 'utf8');

const { content, replacements } = buildReadme(readmePath, text, url);

writeFileSync(readmePath, content, 'utf8');

if (replacements.length) {
  console.log(`Updating ${readmePath}`);
  for (const { name, filename } of replacements) {
    console.log(`Updated [${name}](${filename})`);
  }
} else {
  console.log(`No examples found in ${readmePath}`);
}
