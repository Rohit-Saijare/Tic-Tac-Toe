const board = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const gameContainer = document.getElementById("gameContainer");
const resultScreen = document.getElementById("resultScreen");
const resultMessage = document.getElementById("resultMessage");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let gameState = Array(9).fill("");
let xWins = 0;
let oWins = 0;
let draws = 0;
let gameMode = "pvp"; // default mode

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

board.forEach(cell => {
  cell.addEventListener("click", () => handleCellClick(cell));
});

modeSelect.addEventListener("change", () => {
  gameMode = modeSelect.value;
  restartGame();
});

function handleCellClick(cell) {
  const index = cell.dataset.index;
  if (gameState[index] !== "" || resultScreen.style.display === "flex") return;

  makeMove(index, currentPlayer);

  if (checkWin()) {
    updateScore(currentPlayer);
    showResultScreen(`Player ${currentPlayer} wins!`);
  } else if (isDraw()) {
    updateScore("draw");
    showResultScreen("It's a draw!");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    // If AI mode and it's AI's turn
    if (gameMode === "ai" && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  board[index].textContent = player;
  board[index].style.pointerEvents = "none";
}

function aiMove() {
  const emptyIndices = gameState
    .map((val, idx) => val === "" ? idx : null)
    .filter(val => val !== null);

  if (emptyIndices.length === 0) return;

  const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(aiChoice, "O");

  if (checkWin()) {
    updateScore("O");
    showResultScreen("AI wins!");
  } else if (isDraw()) {
    updateScore("draw");
    showResultScreen("It's a draw!");
  } else {
    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  return winningCombos.some(combo =>
    combo.every(i => gameState[i] === currentPlayer)
  );
}

function isDraw() {
  return gameState.every(cell => cell !== "");
}

function updateScore(winner) {
  if (winner === "X") {
    xWins++;
    scoreX.textContent = xWins;
  } else if (winner === "O") {
    oWins++;
    scoreO.textContent = oWins;
  } else {
    draws++;
    scoreDraw.textContent = draws;
  }
}

function restartGame() {
  gameState.fill("");
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  board.forEach(cell => {
    cell.textContent = "";
    cell.style.pointerEvents = "auto";
  });
  resultScreen.style.display = "none";
  gameContainer.style.display = "flex";
}

function showResultScreen(message) {
  resultMessage.textContent = message;
  gameContainer.style.display = "none";
  resultScreen.style.display = "flex";
}

function startNewGame() {
  restartGame();
}
