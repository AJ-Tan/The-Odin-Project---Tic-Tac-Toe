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
  const boardData = [];
  
  const getBoardData = () => ([...boardData]);

  const setBoardData = (player, blockNumber) => {
    boardData[blockNumber] = player;
  }
  
  const validateBoardData = (blockNumber) => {
    if(boardData[blockNumber]) {
      return false;
    };
    return true;
  }

  const playerInput = (blockNumber) => {
    const {getPlayerTurn, togglePlayer, checkWinner} = gameState;
    
    if(validateBoardData(blockNumber)) {
      setBoardData(getPlayerTurn(), blockNumber);
      togglePlayer();
      displayController();
      checkWinner();
    }
  }

  return {getBoardData, playerInput};
})();

const gameState = (() => {
  let playerTurn = 'player1';
  let gameWinner = null;

  const getPlayerTurn = () => playerTurn;
  const togglePlayer = () => {
    playerTurn = playerTurn === 'player1' ? 'player2' : 'player1';
  }

  const checkWinner = () => {
    const boardData = gameBoard.getBoardData();
    const winConditions = [
      [0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],
      [2,4,6], [3,4,5], [6,7,8]
    ];

    winConditions.forEach(([a,b,c]) => {
      for(const player in gamePlayers) {
        if(boardData[a] === player && 
        boardData[b] === player &&
        boardData[c] === player) {
          gameWinner = player;
          return gameWinner;
        }
      }
    })

    return null;
  }

  return {getPlayerTurn, togglePlayer, checkWinner}
})();

const displayController = (() => {
  const displaySymbol = function (player, index) {
    const gameBlockNode = document.querySelector(`.game-block[data-position='${index}']`);
    gameBlockNode.textContent = gamePlayers[player].symbol;
  }

  const displayBoard = () => {
    const boardData = gameBoard.getBoardData();

    for(const player in gamePlayers) {
      boardData.forEach((boardPosition, index) => {
        if(boardPosition === player) {
          displaySymbol(player, index)
        }
      })
    }
  }

  return displayBoard;
})();

const gameBlockNode = document.querySelectorAll('button.game-block');
gameBlockNode.forEach(node => {
  node.addEventListener('click', (e) => {
    gameBoard.playerInput(e.currentTarget.dataset['position']);
  })
})