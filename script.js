const nameInputArea = document.getElementById('nameInputArea');
const gameArea = document.getElementById('gameArea');
const gameBoard = document.getElementById('gameBoard');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const winnerScreen = document.getElementById('winnerScreen');
const winnerText = document.getElementById('winnerText');
const playAgainBtn = document.getElementById('playAgainBtn');
const startBtn = document.getElementById('startBtn');

const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let player1Name = '';
let player2Name = '';
let gameOver = false;
let moveMade = false;

// Start Game
startBtn.addEventListener('click', () => {
  player1Name = document.getElementById('player1').value || 'Player 1';
  player2Name = document.getElementById('player2').value || 'Player 2';
  nameInputArea.style.display = 'none';
  gameArea.style.display = 'block';
  createBoard();
  message.textContent = `${player1Name}'s Turn`;
});

// Create Board
function createBoard() {
  gameBoard.innerHTML = '';
  board = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleClick);
      cell.addEventListener('mouseenter', handleHover);
      cell.addEventListener('mouseleave', handleLeave);
      gameBoard.appendChild(cell);
      row.push('');
    }
    board.push(row);
  }
}

// Handle Cell Click
function handleClick(e) {
  if (gameOver) return;

  const col = parseInt(e.target.dataset.col);

  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === '') {
      board[row][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add(currentPlayer);

      if (!moveMade) {
        restartBtn.style.display = 'inline-block';
        moveMade = true;
      }

      if (checkWin(row, col)) {
        showWinner();
      } else if (isDraw()) {
        showDraw();
      } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        message.textContent = `${currentPlayer === 'red' ? player1Name : player2Name}'s Turn`;
      }
      break;
    }
  }
}

// Hover effects
function handleHover(e) {
  if (gameOver) return;
  const col = parseInt(e.target.dataset.col);
  for (let row = ROWS - 1; row >= 0; row--) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell && board[row][col] === '') {
      cell.style.background = currentPlayer === 'red' ? '#ff4b5c' : '#ffe347';
      break;
    }
  }
}

function handleLeave(e) {
  const col = parseInt(e.target.dataset.col);
  for (let row = ROWS - 1; row >= 0; row--) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell && board[row][col] === '') {
      cell.style.background = '#d9d9d9';
      break;
    }
  }
}

// Check for a Win
function checkWin(row, col) {
  return checkDirection(row, col, -1, 0) + checkDirection(row, col, 1, 0) > 2 ||
         checkDirection(row, col, 0, -1) + checkDirection(row, col, 0, 1) > 2 ||
         checkDirection(row, col, -1, -1) + checkDirection(row, col, 1, 1) > 2 ||
         checkDirection(row, col, -1, 1) + checkDirection(row, col, 1, -1) > 2;
}

function checkDirection(row, col, rowDir, colDir) {
  let count = 0;
  let r = row + rowDir;
  let c = col + colDir;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
    count++;
    r += rowDir;
    c += colDir;
  }
  return count;
}

// Check for Draw
function isDraw() {
  return board.flat().every(cell => cell !== '');
}

// Show Winner
function showWinner() {
  gameOver = true;
  gameArea.style.display = 'none';
  winnerScreen.style.display = 'flex';
  winnerText.textContent = `${currentPlayer === 'red' ? player1Name : player2Name} Wins! 🎉`;
}

// Show Draw
function showDraw() {
  gameOver = true;
  message.textContent = "It's a Draw!";
}

// Restart button (only resets board mid-game)
restartBtn.addEventListener('click', () => {
  createBoard();
  message.textContent = `${currentPlayer === 'red' ? player1Name : player2Name}'s Turn`;
  gameOver = false;
  moveMade = false;
  restartBtn.style.display = 'none';
});

// ✅ Play Again button - FULL reset
playAgainBtn.addEventListener('click', () => {
  // Hide Winner screen
  winnerScreen.style.display = 'none';

  // Show Name Input page again
  nameInputArea.style.display = 'flex';

  // Hide game area and restart button
  gameArea.style.display = 'none';
  restartBtn.style.display = 'none';

  // Clear input boxes
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';

  // Clear message
  message.textContent = '';

  // Reset the board
  gameBoard.innerHTML = '';

  // Reset variables
  board = [];
  currentPlayer = 'red';
  player1Name = '';
  player2Name = '';
  gameOver = false;
  moveMade = false;
});
