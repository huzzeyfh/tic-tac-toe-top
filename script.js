function Gameboard() {
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

  const pointMark = (cellRow, cellCol, player) => {
    board[cellRow][cellCol].addMark(player);
  };

  const printBoard = () => {
    const boardTTC = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardTTC);
  };

  return { getBoard, pointMark, printBoard };
}

function Cell() {
  let value = 0;

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard();

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
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (cellRow, cellCol) => {
    console.log(
      `Adding ${getActivePlayer().name}'s mark at Cell Row: ${cellRow} and Cell Column: ${cellCol}...`,
    );
    board.pointMark(cellRow, cellCol,  getActivePlayer().mark);

    switchTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
