import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonArg = process.argv[2] || 'src/data/archive/v2-3months-romantic.json';
const jsonPath = path.resolve(__dirname, '..', jsonArg);
const cardsTsPath = path.resolve(__dirname, '../src/data/cards.ts');
const historyPath = path.resolve(__dirname, '../src/data/archive/all-history.json');

console.log(`\n========================================`);
console.log(`🚀 Sekirara Nights カード反映＆履歴更新`);
console.log(`========================================`);
console.log(`読み込み元: ${jsonPath}`);

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ エラー: ${jsonPath} が見つかりません。`);
  process.exit(1);
}

// 1. 重複チェック実行
console.log(`\nStep 1: 重複＆整合性チェック実行中...`);
try {
  execSync(`node "${path.resolve(__dirname, 'check-duplicates.mjs')}" "${jsonArg}"`, { stdio: 'inherit' });
} catch (e) {
  console.error(`❌ エラー: 重複チェックに失敗したため、適用を中断しました。`);
  process.exit(1);
}

// 2. cards.ts の書き出し
console.log(`\nStep 2: src/data/cards.ts を生成中...`);
const cards = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Level別に分割してコード生成
const level1Questions = cards.filter(c => c.type === 'question' && c.level === 1);
const level2Questions = cards.filter(c => c.type === 'question' && c.level === 2);
const level3Questions = cards.filter(c => c.type === 'question' && c.level === 3);
const actionCards = cards.filter(c => c.type === 'action');

let tsOutput = `import type { Card } from '../types';\n\nexport const INITIAL_CARDS: Card[] = [\n`;

function formatCard(c) {
  let res = `  {\n    id: '${c.id}',\n    type: '${c.type}',\n    level: ${c.level},\n    category: '${c.category}',\n    question: '${c.question.replace(/'/g, "\\'")}'`;
  if (c.subText) {
    res += `,\n    subText: '${c.subText.replace(/'/g, "\\'")}'`;
  }
  if (c.actionPrompt) {
    res += `,\n    actionPrompt: '${c.actionPrompt.replace(/'/g, "\\'")}'`;
  }
  res += `\n  }`;
  return res;
}

tsOutput += `  // ==========================================\n`;
tsOutput += `  // LEVEL 1: Icebreak & Romance (出会い・第一印象・惹かれた瞬間) - ${level1Questions.length}問\n`;
tsOutput += `  // ==========================================\n`;
tsOutput += level1Questions.map(formatCard).join(',\n') + ',\n\n';

tsOutput += `  // ==========================================\n`;
tsOutput += `  // LEVEL 2: Intimacy & Touch (親密さ・スキンシップ・フェチ・本音) - ${level2Questions.length}問\n`;
tsOutput += `  // ==========================================\n`;
tsOutput += level2Questions.map(formatCard).join(',\n') + ',\n\n';

tsOutput += `  // ==========================================\n`;
tsOutput += `  // LEVEL 3: Passion & Deep Desire (大人のセキララ・夜の本音・秘密の願望) - ${level3Questions.length}問\n`;
tsOutput += `  // ==========================================\n`;
tsOutput += level3Questions.map(formatCard).join(',\n') + ',\n\n';

tsOutput += `  // ==========================================\n`;
tsOutput += `  // SPECIAL: Action Cards (スキンシップ・情熱のアクションミッション) - ${actionCards.length}枚\n`;
tsOutput += `  // ==========================================\n`;
tsOutput += actionCards.map(formatCard).join(',\n') + '\n];\n';

fs.writeFileSync(cardsTsPath, tsOutput, 'utf8');
console.log(`✅ ${cardsTsPath} を正常に更新しました！`);

// 3. all-history.json の更新
console.log(`\nStep 3: 過去出題履歴（all-history.json）を同期中...`);
let history = { version: '2.0', description: 'これまでに出題された全カードの質問履歴（重複防止用）', updatedAt: new Date().toISOString(), questions: [] };
if (fs.existsSync(historyPath)) {
  history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

const existingIds = new Set(history.questions.map(q => q.id));
let addedCount = 0;

const versionTag = path.basename(jsonArg, path.extname(jsonArg));

cards.forEach(c => {
  if (!existingIds.has(c.id)) {
    history.questions.push({
      id: c.id,
      version: versionTag,
      type: c.type,
      level: c.level,
      category: c.category,
      question: c.question,
      actionPrompt: c.actionPrompt || null
    });
    existingIds.add(c.id);
    addedCount++;
  }
});

history.updatedAt = new Date().toISOString();
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
console.log(`✅ 過去履歴に ${addedCount} 件の新規カードを記録しました（総履歴数: ${history.questions.length} 件）`);

console.log(`\n🎉 反映完了！`);
