//Board module
const Gameboard = (function () {
  //private data
  const board = Array(9).fill(null);

  //public methods
  function getBoard() {
    return board.slice(); // return a copy so external code can't mutate externally
  }

  function setCell(index, marker) {
    if (index < 0 || index > 8) return false;
    if (board[index] !== null) return false; // taken
    board[index] = marker;
    return true;
  }

  function reset() {
    for (let i = 0; i < board.length; i++) board[i] = null;
  }

  return { getBoard, setCell, reset };
})();

// Player factory
function createPlayer(name, marker) {
  // marker: 'X' or 'O'
  return {
    name,
    marker,
  };
}

// DisplayRenderer to separating concerns between data and UI
const DisplayController = (function () {
  const boardEl = document.querySelector(".board");

  function render() {
    boardEl.innerHTML = ""; // clear previous render
    const board = Gameboard.getBoard();

    board.forEach((cell, idx) => {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.dataset.index = idx;
      cellEl.textContent = cell ? cell : ""; // show marker or empty
      boardEl.appendChild(cellEl);
    });
  }

  return { render };
})();

// WinnerChecker
const GameChecker = (function () {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function check() {
    const board = Gameboard.getBoard();

    // for..of
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // return 'X' or 'O'
      }
    }

    // If no winner and no empty cells left, then it's a draw
    if (board.every((cell) => cell !== null)) {
      return "draw";
    }

    // Otherwise, game still ongoing
    return null;
  }

  return { check };
})();

//Game controller module (flow control)
const GameController = (function () {
  const newGameBtn = document.querySelector("#new-game");
  const resetBtn = document.querySelector("#reset");
  const turnEl = document.querySelector(".turn");
  const players = [createPlayer("User", "X"), createPlayer("Computer", "O")];
  let current = 0; // index of current player

  function init() {
    newGameBtn.addEventListener("click", start);
    resetBtn.addEventListener("click", reset);
  }

  function start() {
    newGameBtn.style.display = "none";
    resetBtn.style.display = "block";
    turnEl.style.display = "block";
    Gameboard.reset();
    DisplayController.render();
    turnEl.textContent = `${players[current].name}'s Turn (${players[current].marker})`;
    attachBoardListeners();
  }

  function reset() {
    current = 0;
    Gameboard.reset();
    DisplayController.render();
    turnEl.textContent = `${players[current].name}'s Turn (${players[current].marker})`;
  }

  function attachBoardListeners() {
    document
      .querySelector(".board")
      .addEventListener("click", handleBoardClick);
  }

  function handleBoardClick(e) {
    const idx = Number(e.target.dataset.index);
    if (Number.isInteger(idx)) {
      const success = Gameboard.setCell(idx, players[current].marker);
      if (!success) return; // cell taken or invalid

      DisplayController.render();
      const result = GameChecker.check();
      if (result) {
        if (result === "draw") {
          turnEl.textContent = "It's a draw, mate!";
        } else {
          turnEl.textContent = `${players[current].name} wins!`;
        }
        return;
      }

      current = 1 - current; // switch turn
      turnEl.textContent = `${players[current].name}'s Turn (${players[current].marker})`;
    }
  }

  return { init };
})();

GameController.init();
