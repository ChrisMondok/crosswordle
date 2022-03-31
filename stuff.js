async function fetchSolution() {
  const solutions = await (await fetch('solutions')).text();
  const numPuzzles = solutions.length / 25; 
  const puzzleNumber = Math.floor(Math.random() * numPuzzles);
  console.log(`puzzle ${puzzleNumber} of ${numPuzzles}`);
  const thisPuzzle = solutions
    .substring(puzzleNumber * 25, (puzzleNumber + 1) * 25)
    .match(/.{5}/g);
  return thisPuzzle;
}

async function fetchDictionary() {
  return new Set(await getWordList());
}

async function getWordList() {
  const response = await fetch('words.json');
  return await response.json();
}

export const allWords = await fetchDictionary();
export const solution = await fetchSolution();
