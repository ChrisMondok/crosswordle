async function fetchSolution() {
  const response = await fetch('/solutions');
  const lines = (await response.text()).split('\n').filter(x => x);
  const numPuzzles = lines.length / lines[0].length;
  const puzzleNumber = Math.floor(Math.random() * numPuzzles);
  return lines.slice(5 * puzzleNumber, 5 * (puzzleNumber + 1));
}

async function fetchDictionary() {
  return new Set(await getWordList());
}

async function getWordList() {
  const response = await fetch('/words.json');
  return await response.json();
}

export const allWords = await fetchDictionary();
export const solution = await fetchSolution();
