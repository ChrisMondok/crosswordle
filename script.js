import {allWords, solution} from './stuff.js';

const crossword = document.querySelector('crossword');
for(const word of solution) {
  for(const letter of word) {
    crossword.appendChild(createLetterCell(letter));
  }
}

let numGuesses = 0;

const input = document.querySelector('input');

createKeyboard();

function typeLetter(letter) {
  const key = document.querySelector(`keyboard .${letter}`);
  if(key) animateKey(key);

  if(letter === '↵') {
    guess() 
  } else if(letter === '⌫') {
    input.value = input.value.substring(0, input.value.length - 1);
  } else if(input.value.length >= 5) {
    return;
  } else {
    input.value += letter;
  }
}

async function guess() {
  const word = input.value;
  if(word.length === 0) {
    showMessage('type any five letter word');
  }
  if(word.length < 5) {
    showMessage('too short');
    return;
  } else if(word.length > 5) {
    showMessage('too long');
    return;
  } else if (!allWords.has(word)) {
    showMessage(`I don't know that word`);
    return;
  }

  numGuesses++;
  input.value = '';

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
      document.querySelector(`keyboard .${letter}`).classList.add('in-correct-location');
    } else if(solution.some(word => word.indexOf(letter) !== -1)) {
      letterCell.classList.add('in-solution');
      document.querySelector(`keyboard .${letter}`).classList.add('in-solution');
    } else {
      letterCell.classList.add('not-in-solution');
      document.querySelector(`keyboard .${letter}`).classList.add('not-in-solution');
    }

    guessList.insertBefore(letterCell, guessList.firstChild);
  }

  if(document.querySelectorAll('crossword letter.found').length === 25) {
    showMessage(`you won in ${numGuesses} guesses`);
  }
}

const letters = new Set('qwertyuiopasdfghjklzxcvbnm'.split(''))

addEventListener('keydown', evt => {
  let handled = true;
  if(evt.key === 'Backspace') {
    if(evt.ctrlKey || evt.metaKey) {
      input.value = '';
    } else {
      typeLetter('⌫');
    }
  } else if(letters.has(evt.key) && !evt.ctrlKey && !evt.metaKey) {
    typeLetter(evt.key);
  } else if(evt.key === 'Enter') {
    typeLetter('↵');
  } else {
    handled = false;
  }
  if(handled) evt.preventDefault();
});

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

  ['qwertyuiop', 'asdfghjkl','↵zxcvbnm⌫'].forEach((row, index) => {
    const keyboardRow = document.createElement('keyboard-row');
    for(const letter of row) {
      const key = document.createElement('button');
      key.textContent = letter;
      key.className = `key ${letter}`;
      key.style.gridRow = index + 1;
      keyboardRow.appendChild(key);

      key.addEventListener('click', () => {
        typeLetter(letter);
      });
    }
    keyboard.appendChild(keyboardRow);
  });
}

function animateKey(key) {
  key.animate([
    {
      transform: 'translateZ(-30px)'
    },
    {
      transform: 'translateZ(0px)',
    }
  ], {
    duration: 250,
    iterations: 1
  })
}

function createLetterCell(letter) {
  const card = document.createElement('letter');
  card.classList.add(letter);
  card.textContent = letter;
  return card;
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

function showMessage(message) {
  const el = document.querySelector('message');
  el.textContent = message;
  el.animate([
    {
      visibility: 'visible',
      transform: 'scale(0.8)',
    },
    {
      offset: 0.05,
      easing: 'ease-out',
      transform: 'scale(1.2)',
      opacity: 1,
    },
    {
      offset: 0.1,
      easing: 'ease-in',
      transform: 'scale(1.0)',
    },
    {
      offset: 0.9,
      opacity: 1,
      transform: 'scale(1.0)',
    },
    {
      offset: 0.95,
      transform: 'scale(0.8)',
      opacity: 0,
      visibility: 'visible',
    },
    {
      transform: 'scale(0.8)',
    }
  ], {
    duration: 5000,
    iterations: 1
  });
}

window.showMessage = showMessage;
