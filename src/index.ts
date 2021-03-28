import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const matchExample = /> \[([0-9a-z\-\/\.]+(\:\(([0-9a-zA-Z\-]+)\))?)\]\(([0-9a-zA-Z\-\/\.\:\#]+)\)\n\n\`\`\`([0-9a-z\-]+)\n(((?!\`\`\`).|\n)*\`\`\`)/gm;

const countLines = (str: string): number => (str.match(/\n/gm) ?? []).length;

const removeAnchorHash = (str: string): string => str.replace(/\#.*$/, '');

const extractSection = (section: string, content: string): { hash: string; content: string } => {
  const escapedSection = section.replace('-', '\\-');
  const result = content.match(
    new RegExp(`(?:\/\/|#) << ${escapedSection}\n+(.*)\n+([ ]*)(?:\/\/|#) ${escapedSection}`, 'msi'),
  );

  if (!result) {
    throw new Error(`Section ${section} does not exist.`);
  }
  const [match, indentedContent, indent] = result;
  const prefixContent = content.substr(0, result.index) + 1;

  const linesStart = countLines(prefixContent) + 1;
  const linesEnd = linesStart + countLines(match);

  return {
    hash: `#L${linesStart}-L${linesEnd}`,
    content: indentedContent
      .split('\n')
      .map((line) => line.substr(indent.length))
      .filter((row) => !row.match(/\/\/ (<< )?[0-9a-zA-Z\-]+/))
      .join('\n')
      .trim(),
  };
};

/**
 * Convert readme text by filling in and updating examples
 *
 * @param readmePath full path to the readme file
 * @param text contents of the readme file
 * @param url url of the package, used if the example urls are absolute
 */
export const buildReadme = (
  readmePath: string,
  text: string,
  dir: string,
  url?: string,
): { content: string; replacements: { name: string; filename: string }[] } => {
  const replacements: { name: string; filename: string }[] = [];

  const content = text.replace(matchExample, (match, name, _, section, filename, language) => {
    replacements.push({ name, filename });

    const resolvedFilename = removeAnchorHash(
      url && filename.includes(url) ? filename.replace(url, dir) : join(dirname(join(dir, readmePath)), filename),
    );

    if (!existsSync(resolvedFilename)) {
      throw new Error(`File ${resolvedFilename} does not exist in ${dir}`);
    }
    const content = readFileSync(resolvedFilename, 'utf-8');

    if (section) {
      const extract = extractSection(section, content);
      const sectionFilename = `${removeAnchorHash(filename)}${extract.hash}`;
      return `> [${name}](${sectionFilename})\n\n\`\`\`${language}\n${extract.content}\n\`\`\``;
    } else {
      return `> [${name}](${filename})\n\n\`\`\`${language}\n${content}\`\`\``;
    }
  });

  return { content, replacements };
};
