import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { buildReadme } from '../src';

const readmes: Array<[name: string, content: string]> = readdirSync(join(__dirname, 'readmes'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => [file, readFileSync(join(__dirname, 'readmes', file), 'utf-8')]);

const urlMap: { [key: string]: string } = {
  'laminar.md': 'https://github.com/ovotech/laminar/tree/main/packages/laminar',
};

describe('Document', () => {
  it.each(readmes)('Should parse readme %s', (name, content) => {
    expect(buildReadme(name, content, join(__dirname, 'readmes'), urlMap[name])).toMatchSnapshot(name);
  });

  it.each(readmes)('Should be able to parse inner folders for %s', (name, content) => {
    expect(buildReadme(join('readmes', name), content, __dirname, urlMap[name])).toMatchSnapshot(name);
  });
});
