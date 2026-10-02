import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 引数チェックまたはデフォルトパス
const targetArg = process.argv[2] || 'src/data/archive/v2-3months-romantic.json';
const targetPath = path.resolve(__dirname, '..', targetArg);
const historyPath = path.resolve(__dirname, '../src/data/archive/all-history.json');

console.log(`\n========================================`);
console.log(`🔍 Sekirara Nights カード検証 & 重複チェック`);
console.log(`========================================`);
console.log(`対象ファイル: ${targetPath}`);

if (!fs.existsSync(targetPath)) {
  console.error(`❌ エラー: 対象ファイルが見つかりません: ${targetPath}`);
  process.exit(1);
}

// カードの読み込み
let cards = [];
if (targetPath.endsWith('.json')) {
  cards = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
} else if (targetPath.endsWith('.ts')) {
  const content = fs.readFileSync(targetPath, 'utf8');
  const match = content.match(/export const INITIAL_CARDS:\s*Card\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.error('❌ エラー: cards.ts 内に INITIAL_CARDS が見つかりませんでした。');
    process.exit(1);
  }
  cards = new Function(`return ${match[1]}`)();
} else {
  console.error('❌ エラー: サポートされていないファイル形式です (.json または .ts)');
  process.exit(1);
}

// 過去履歴の読み込み
let history = { questions: [] };
if (fs.existsSync(historyPath)) {
  history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  console.log(`📚 過去履歴ファイル: ${history.questions.length} 件の過去質問をロード`);
} else {
  console.log(`⚠️ 過去履歴ファイルが見つかりません（初回実行）。新規作成されます。`);
}

// 正規化関数（句読点、空白、記号を除去）
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[？?！!。、・\s　「」『』()（）…ー〜-]/g, '');
}

// Bi-gram Jaccard類似度計算
function getBigrams(str) {
  const s = normalizeText(str);
  const bigrams = new Set();
  for (let i = 0; i < s.length - 1; i++) {
    bigrams.add(s.substring(i, i + 2));
  }
  return bigrams;
}

function calculateSimilarity(str1, str2) {
  const bg1 = getBigrams(str1);
  const bg2 = getBigrams(str2);
  if (bg1.size === 0 || bg2.size === 0) return 0;
  
  let intersection = 0;
  for (const item of bg1) {
    if (bg2.has(item)) intersection++;
  }
  const union = bg1.size + bg2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

let hasError = false;
const idSet = new Map();
const currentQuestions = [];
const errors = [];
const warnings = [];

// 1. 基本バリデーション & 対象内重複チェック
cards.forEach((card, index) => {
  const num = index + 1;
  // 必須フィールド
  if (!card.id) errors.push(`[#${num}] id が存在しません。`);
  if (!card.type || !['question', 'action'].includes(card.type)) errors.push(`[#${num} ${card.id}] 不正な type: ${card.type}`);
  if (!card.level || ![1, 2, 3].includes(card.level)) errors.push(`[#${num} ${card.id}] 不正な level: ${card.level}`);
  if (!card.category) errors.push(`[#${num} ${card.id}] category がありません。`);
  if (!card.question) errors.push(`[#${num} ${card.id}] question が空です。`);

  // ID重複チェック
  if (idSet.has(card.id)) {
    errors.push(`[#${num}] ID '${card.id}' が重複しています（先行: #${idSet.get(card.id)}）`);
  } else {
    idSet.set(card.id, num);
  }

  // 同一セット内での質問文重複
  const normQ = normalizeText(card.question);
  for (const prev of currentQuestions) {
    if (normQ === prev.norm) {
      errors.push(`[#${num} ${card.id}] 質問文が重複しています（#${prev.num} ${prev.id}「${prev.question}」）`);
    } else {
      const sim = calculateSimilarity(card.question, prev.question);
      if (sim >= 0.75) {
        warnings.push(`[類似度 ${Math.round(sim * 100)}%] #${num} ${card.id} と #${prev.num} ${prev.id} の質問が酷似しています。\n   A: ${card.question}\n   B: ${prev.question}`);
      }
    }
  }

  currentQuestions.push({ num, id: card.id, question: card.question, norm: normQ });
});

// 2. 過去履歴（all-history.json）との重複チェック
let pastExactMatches = 0;
let pastSimilarMatches = 0;

cards.forEach((card, index) => {
  const num = index + 1;
  const normQ = normalizeText(card.question);

  for (const past of history.questions) {
    // 自身が既に過去履歴に同一IDかつ同一バージョンとして登録されている場合は除外
    if (past.id === card.id && past.question === card.question) continue;

    const normPast = normalizeText(past.question);
    if (normQ === normPast) {
      errors.push(`[過去質問と重複] #${num} ${card.id}: 「${card.question}」は過去の出題（${past.version || 'v1'} ID:${past.id}）と完全に一致しています！`);
      pastExactMatches++;
    } else {
      const sim = calculateSimilarity(card.question, past.question);
      if (sim >= 0.72) {
        warnings.push(`[過去質問と類似 ${Math.round(sim * 100)}%] #${num} ${card.id}「${card.question}」は過去の質問（${past.version || 'v1'}: 「${past.question}」）と類似しています。`);
        pastSimilarMatches++;
      }
    }
  }
});

// 3. レポート出力
console.log(`\n--- 集計サマリー ---`);
console.log(`総カード枚数: ${cards.length} 枚`);

const byType = { question: 0, action: 0 };
const byLevel = { 1: 0, 2: 0, 3: 0 };
const questionByLevel = { 1: 0, 2: 0, 3: 0 };
const actionByLevel = { 1: 0, 2: 0, 3: 0 };

cards.forEach(c => {
  if (byType[c.type] !== undefined) byType[c.type]++;
  if (byLevel[c.level] !== undefined) byLevel[c.level]++;
  if (c.type === 'question') questionByLevel[c.level]++;
  if (c.type === 'action') actionByLevel[c.level]++;
});

console.log(`・質問カード: ${byType.question} 問 (Level 1: ${questionByLevel[1]}, Level 2: ${questionByLevel[2]}, Level 3: ${questionByLevel[3]})`);
console.log(`・アクションカード: ${byType.action} 枚 (Level 1: ${actionByLevel[1]}, Level 2: ${actionByLevel[2]}, Level 3: ${actionByLevel[3]})`);

if (warnings.length > 0) {
  console.log(`\n⚠️  警告 (${warnings.length} 件):`);
  warnings.forEach(w => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.log(`\n❌ エラー (${errors.length} 件):`);
  errors.forEach(e => console.log(`  - ${e}`));
  console.log(`\n❌ 重複またはバリデーションエラーが検出されたため、チェックに失敗しました。`);
  process.exit(1);
} else {
  console.log(`\n✅ 重複チェック合格！過去の出題および同一セット内での重複はありませんでした。`);
  process.exit(0);
}
