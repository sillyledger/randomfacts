// Fails the build if any fact breaks the mechanical rules in STYLE.md: dashes and banned words.
// The banned list is read from STYLE.md itself, so the guide stays the single source.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type FactText = { id: string; title: string; explain: string; story?: string };

const root = join(__dirname, '..');
const fields = ['title', 'explain', 'story'] as const;

function bannedFromStyleGuide(): string[] {
  const guide = readFileSync(join(root, 'STYLE.md'), 'utf8');
  const section = guide.split(/^## /m).find((part) => part.startsWith('Banned words'));
  if (!section) throw new Error('STYLE.md has no "## Banned words" section');
  const banned = section
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
  if (banned.length === 0) throw new Error('STYLE.md lists no banned words');
  return banned;
}

// Case-insensitive, whole words only, and a straight or curly apostrophe both count.
function wordPattern(phrase: string): RegExp {
  const escaped = phrase
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/['’]/g, "['’]")
    .replace(/\s+/g, '\\s+');
  return new RegExp(`(?<![\\w'’])${escaped}(?![\\w'’])`, 'i');
}

const banned = bannedFromStyleGuide().map((phrase) => ({ phrase, pattern: wordPattern(phrase) }));
const facts: FactText[] = JSON.parse(readFileSync(join(root, 'data/facts.json'), 'utf8'));
const problems: string[] = [];

for (const fact of facts) {
  for (const field of fields) {
    const text = fact[field];
    if (!text) continue;
    if (text.includes('—')) problems.push(`${fact.id}  ${field}  em dash (—)`);
    if (text.includes('–')) problems.push(`${fact.id}  ${field}  en dash (–)`);
    for (const { phrase, pattern } of banned) {
      if (pattern.test(text)) problems.push(`${fact.id}  ${field}  banned word "${phrase}"`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Style check failed: ${problems.length} problem${problems.length === 1 ? '' : 's'} in data/facts.json (see STYLE.md)\n`);
  console.error(problems.map((problem) => `  ${problem}`).join('\n'));
  process.exit(1);
}

console.log(`Style check passed: ${facts.length} facts, ${banned.length} banned words.`);
