const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const newGameButton = document.getElementById('new-game');
const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAiButton = document.getElementById('player-vs-ai');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isGameActive = true;
let isVsAI = false;

// Winning combinations
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Start game in selected mode
function startGame(mode) {
  isVsAI = mode === 'ai';
  modeSelection.style.display = 'none';
  gameContainer.style.display = 'block';
  statusText.textContent = `Player X's turn`;
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = cell.getAttribute('data-index');

  if (gameState[cellIndex] || !isGameActive) return;

  gameState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    isGameActive = false;
    return;
  } else if (gameState.every((cell) => cell)) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (isVsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 500); // Add a slight delay for AI
  }
}

// Check for a winner
function checkWinner() {
  return winConditions.some((combination) => {
    return combination.every((index) => {
      return gameState[index] === currentPlayer;
    });
  });
}

// AI move logic
function aiMove() {
  if (!isGameActive) return;

  const availableCells = gameState
    .map((value, index) => (value === null ? index : null))
    .filter((index) => index !== null);

  if (availableCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const cellIndex = availableCells[randomIndex];

  gameState[cellIndex] = 'O';
  cells[cellIndex].textContent = 'O';
  cells[cellIndex].classList.add('taken');

  if (checkWinner()) {
    statusText.textContent = 'Player O (AI) wins!';
    isGameActive = false;
    return;
  } else if (gameState.every((cell) => cell)) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Reset the game
function resetGame() {
  currentPlayer = 'X';
  gameState.fill(null);
  isGameActive = true;
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  statusText.textContent = `Player X's turn`;
}

// Return to mode selection
function newGame() {
  currentPlayer = 'X';
  gameState.fill(null);
  isGameActive = true;
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  gameContainer.style.display = 'none';
  modeSelection.style.display = 'block';
}

// Add event listeners
cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', newGame);
playerVsPlayerButton.addEventListener('click', () => startGame('pvp'));
playerVsAiButton.addEventListener('click', () => startGame('ai'));
