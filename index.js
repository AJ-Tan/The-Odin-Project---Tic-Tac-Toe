const gamePlayers = (() => {
  const players = {
    player1: {
      name: 'Player 1',
      symbol: 'X'
    },
    player2: {
      name: 'Player 2',
      symbol: 'O'
    }
  }

  return players;
})();

const gameBoard = (() => {
  const boardData = {
    player1: [],
    player2: []
  };
  const winConditions = [
    [1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],
    [3,5,7]
  ];
  
  const getBoardData = () => ({...boardData});
  const setBoardData = (player, blockNumber) => {
    boardData[player] = [...boardData[player], +blockNumber];
    boardData[player].sort((a, b) => a - b);
  }
  const validateBoardData = (blockNumber) => {
    if([...boardData.player1, ...boardData.player2].includes(+blockNumber)) {
      return false;
    };
    return true;
  }

  const playerInput = (blockNumber) => {
    const {getPlayerTurn, togglePlayer} = gameState;

    if(validateBoardData(blockNumber)) {
      setBoardData(getPlayerTurn(), blockNumber);
      togglePlayer();
      displayController();
    }
  }

  return {getBoardData, playerInput};
})();

const gameState = (() => {
  let playerTurn = 'player1';

  const getPlayerTurn = () => playerTurn;
  const togglePlayer = () => {
    playerTurn = playerTurn === 'player1' ? 'player2' : 'player1';
  }

  return {getPlayerTurn, togglePlayer}
})();

const displayController = (() => {
  const displaySymbol = function (boardPosition, player) {
    const gameBlockNode = document.querySelector(`.game-block[data-position='${boardPosition}']`);
    gameBlockNode.textContent = gamePlayers[player].symbol;
  }

  const displayBoard = () => {
    const boardData = gameBoard.getBoardData();
    for(const player in boardData) {
      boardData[player].forEach(boardPosition => 
      displaySymbol(boardPosition, player));
    }
  }

  return displayBoard;
})();

const gameBlockNode = document.querySelectorAll('button.game-block');
gameBlockNode.forEach(node => {
  node.addEventListener('click', (e) => {
    gameBoard.playerInput(e.currentTarget.dataset['position']);
    console.log(gameBoard.getBoardData());
  })
})