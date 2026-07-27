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

  const pointMark = (cell, player) => {
    cell.addMark(player);
  };

  const printBoard = () => {
    const boardTTC = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardTTC);
  };

  return { getBoard, pointMark, printBoard };
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

  const board = Gameboard.getBoard();

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const conditionWin = () => {
    board[0][0].getValue() === "X" &&
    board[0][1].getValue() === "X" &&
    board[0][2].getValue() === "X"
      ? console.log("Win Condition met!")
      : console.log("Not Met");
  };

  const playRound = (cellRow, cellCol) => {
    const chosenCell = board[cellRow][cellCol];
    console.log(
      `Adding ${getActivePlayer().name}'s mark at Cell Row: ${cellRow} and Cell Column: ${cellCol}...`,
    );
    Gameboard.pointMark(chosenCell, getActivePlayer().mark);

    conditionWin();
    switchTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();

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
