// Board
const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const getBoardValues = () =>
    board.map((row) => row.map((cell) => cell.getValue()));

  const winningLines = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ], // topRow
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ], // midRow
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ], // botRow
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ], // firstCol
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ], // secondCol
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ], // thirdCol
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ], // diag1
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ], // diag2
  ];

  const getWinningLines = () => winningLines;
  const getWinningLinesValues = () =>
    winningLines.map((line) =>
      line.map(([row, col]) => getBoardValues()[row][col]),
    );

  const pointMark = (cell, player) => {
    cell.addMark(player);
  };

  const printBoard = () => {
    console.log(getBoardValues());
  };

  const conditionWin = () => {
    const winningLinesValues = getWinningLinesValues();

    const isWinningLineTrue = winningLinesValues.some(
      (line) => line[0] === line[1] && line[1] === line[2] && line[0] !== 0,
    );

    if (isWinningLineTrue) {
      console.log("Win Condition met!");
      return true;
    } else {
      console.log("Win Condition not met.");
      return false;
    }
  };

  const conditionDraw = () => {
    const boardValues = getBoardValues();
    const flatValues = boardValues.flat();

    const isBoardFull = flatValues.every((value) => value !== 0);

    if (isBoardFull) {
      return true;
    } else {
      console.log("Draw Condition not met.");
      return false;
    }
  };

  const resetBoard = () => {
    board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
    console.log("Board reset.");
  };

  return {
    getBoard,
    pointMark,
    printBoard,
    conditionWin,
    conditionDraw,
    resetBoard,
  };
})();

// Cell
function Cell() {
  let value = 0;

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

// Controller
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const players = [
    {
      name: playerOneName,
      mark: "X",
    },
    {
      name: playerTwoName,
      mark: "O",
    },
  ];

  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (cellRow, cellCol) => {
    const chosenCell = Gameboard.getBoard()[cellRow][cellCol];

    if (chosenCell.getValue() !== 0) {
      return console.log("Cell already marked. Choose another cell.");
    } else {
      console.log(
        `Adding ${getActivePlayer().name}'s mark at Cell Row: ${cellRow} and Cell Column: ${cellCol}...`,
      );
      Gameboard.pointMark(chosenCell, getActivePlayer().mark);

      if (Gameboard.conditionWin() === true) {
        console.log(`${getActivePlayer().name} wins!`);
        Gameboard.printBoard();
        Gameboard.resetBoard();
        console.log("Starting a new game...");
        return printNewRound();
      }

      if (Gameboard.conditionDraw() === true) {
        console.log("It's a draw!");
        Gameboard.printBoard();
        Gameboard.resetBoard();
        console.log("Starting a new game...");
        return printNewRound();
      }

      switchTurn();
      printNewRound();
    }
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.createElement("div");
  playerTurnDiv.id = "turn";
  document.body.appendChild(playerTurnDiv);

  const boardDiv = document.createElement("div");
  boardDiv.id = "board";
  document.body.appendChild(boardDiv);

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = Gameboard.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;

    board.forEach((row, cellRow) => {
      row.forEach((cell, cellCol) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = cellRow;
        cellButton.dataset.col = cellCol;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.col;

    if (!selectedRow || !selectedCol) return;

    game.playRound(selectedRow, selectedCol);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

function startGame() {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", ScreenController);
}

startGame();

// //Kertas coretan
//   //first try
// const conditionWin = Gameboard.getBoard().filter(
//       (row) => row[0].getValue() === players.mark,
//     );

//     if (conditionWin === true) {
//       console.log("Win Condition met!")
//     };

//   //second try
// const rows = 3;
// const columns = 3;
// let board = [];

// for (let i = 0; i < rows; i++) {
//   board[i] = [];
//   for (let j = 0; j < columns; j++) {
//     board[i].push(0);
//   }
// }
// board[0][0] = "X";
// board[0][1] = "X";
// board[0][2] = "X";

// console.log(board);

// // const conditionWin = board.filter((row) => row[0] === "X");

// // if (conditionWin === true) {
// //   console.log("Win Condition met!");
// // }

// function conditionWin() {
//   board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X" ? console.log("Win Condition met!") : console.log("Not Met");
// }
