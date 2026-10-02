import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsTsPath = path.resolve(__dirname, '../src/data/cards.ts');
const content = fs.readFileSync(cardsTsPath, 'utf8');

// INITIAL_CARDS 配列部分を抽出
const match = content.match(/export const INITIAL_CARDS:\s*Card\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
if (!match) {
  console.error('Could not find INITIAL_CARDS in cards.ts');
  process.exit(1);
}

const arrayCode = match[1];
// JSとして評価 (TypeScriptのアノテーションは内部にないはず)
// Function コンストラクタで評価
const cards = new Function(`return ${arrayCode}`)();

console.log(`Extracted ${cards.length} cards.`);

const archivePath = path.resolve(__dirname, '../src/data/archive/v1-original.json');
fs.writeFileSync(archivePath, JSON.stringify(cards, null, 2), 'utf8');
console.log(`Saved v1 cards to ${archivePath}`);

const allHistoryPath = path.resolve(__dirname, '../src/data/archive/all-history.json');
const historyData = {
  version: '1.0',
  description: 'これまでに出題された全カードの質問履歴（重複防止用）',
  updatedAt: new Date().toISOString(),
  questions: cards.map(c => ({
    id: c.id,
    version: 'v1',
    type: c.type,
    level: c.level,
    category: c.category,
    question: c.question,
    actionPrompt: c.actionPrompt || null
  }))
};
fs.writeFileSync(allHistoryPath, JSON.stringify(historyData, null, 2), 'utf8');
console.log(`Saved initial history to ${allHistoryPath}`);
