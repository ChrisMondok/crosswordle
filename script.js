import {allWords, solution} from './stuff.js';

const crossword = document.querySelector('crossword');
for(const word of solution) {
  for(const letter of word) {
    crossword.appendChild(createLetterCell(letter));
  }
}

const input = document.querySelector('input');

input.addEventListener('input', () => {
  validateInput();
});

document.querySelector('form').addEventListener('submit', (evt) => {
  evt.preventDefault();
  guess(input.value, solution);
  input.value = '';
});

createKeyboard();

async function guess(word, solution) {
  const guessList = document.querySelector('guess-list');
  const allWordsInSolution = [...solution, ...transpose(solution)];
  for(let i = word.length - 1; i >= 0; i--) {
    const letter = word[i];
    const letterCell = createLetterCell(letter);

    allWordsInSolution.forEach((word, rowOrColumn) => {
      if(word[i] === letter) {
        if(rowOrColumn < 5) {
          revealCell(i, rowOrColumn);
        } else {
          revealCell(rowOrColumn - 5, i);
        }
      }
    });

    if(allWordsInSolution.some(word => word[i] === letter)) {
      letterCell.classList.add('in-correct-location');
      document.querySelector(`keyboard letter.${letter}`).classList.add('in-correct-location');
    } else if(solution.some(word => word.indexOf(letter) !== -1)) {
      letterCell.classList.add('in-solution');
      document.querySelector(`keyboard letter.${letter}`).classList.add('in-solution');
    } else {
      letterCell.classList.add('not-in-solution');
      document.querySelector(`keyboard letter.${letter}`).classList.add('not-in-solution');
    }

    guessList.insertBefore(letterCell, guessList.firstChild);
  }

  if(document.querySelectorAll('crossword letter.found').length === 25) {
    alert('you won');
  }
}

const letters = new Set('qwertyuiopasdfghjklzxcvbnm'.split(''))

function revealCell(x, y) {
  const index = 5*y+x;
  document.querySelector(`crossword letter:nth-of-type(${index + 1})`)
    .classList.add('found');
}

function isWordInSolution(word, solution) {
  if(solution.indexOf(word) !== -1) return true;
  if(transpose(solution).indexOf(word) !== -1) return true;
  return false;
}

function transpose(solution) {
  return new Array(solution.length).fill(undefined).map((_, column) => {
    return new Array(solution.length).fill(undefined).map((_, row) => {
      return solution[row][column];
    }).join('');
  });
}

function createKeyboard() {
  const keyboard = document.querySelector('keyboard');

  ['qwertyuiop', 'asdfghjkl','zxcvbnm↵'].forEach((row, index) => {
    const keyboardRow = document.createElement('keyboard-row');
    for(const letter of row) {
      const cell = createLetterCell(letter);
      cell.style.gridRow = index + 1;
      keyboardRow.appendChild(cell);

      cell.addEventListener('click', () => {
        input.value += letter;
        validateInput();
        input.reportValidity();
      });
    }
    keyboard.appendChild(keyboardRow);
  });
}

function createLetterCell(letter) {
  const container = document.createElement('letter');
  container.classList.add(letter);
  container.textContent = letter;
  return container;
}

function validateInput() {
  if(input.validity.patternMismatch) {
    input.setCustomValidity('Letters only please');
  } else if(input.value.length === 5 && !allWords.has(input.value)) {
    input.setCustomValidity(`I don't know that word`);
  } else {
    input.setCustomValidity('');
  }
}
