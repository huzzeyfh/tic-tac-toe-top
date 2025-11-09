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
    const b = Gameboard.getBoard();

    b.forEach((cell, idx) => {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.dataset.index = idx;
      cellEl.textContent = cell ? cell : ""; // show marker or empty
      boardEl.appendChild(cellEl);
    });
  }

  return { render };
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
    document.querySelector(".board").addEventListener("click", handleBoardClick);
  }

  function handleBoardClick(e) {
    const idx = Number(e.target.dataset.index);
    if (Number.isInteger(idx)) {
      const success = Gameboard.setCell(idx, players[current].marker);
      if (!success) return; // cell taken or invalid

      DisplayController.render();
      // TODO: check for win/draw here (later)
      // switch turn
      current = 1 - current;
      turnEl.textContent = `${players[current].name}'s Turn (${players[current].marker})`;
    }
  }

  return { init };
})();


GameController.init();