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

  const playerInput = (blockNumber, btnNode) => {
    const {getPlayerTurn, togglePlayer, checkWinner} = gameState;
    
    if(validateBoardData(blockNumber)) {
      setBoardData(getPlayerTurn(), blockNumber);
      btnNode.classList.add(getPlayerTurn());
      togglePlayer();
      displayController();

      const playerWinner = checkWinner();
      if(playerWinner) {
        const playagainOverlayNode = document.querySelector('.playagain-overlay');
        const txtWinnerNode = document.getElementById('txt-winner');
        txtWinnerNode.textContent = playerWinner;
        playagainOverlayNode.style.display = 'flex';
      }
    }
  }

  const resetBoard = () => {
    boardData.length = 0;
    const gameCellNode = document.querySelectorAll('button.game-cell');

    gameCellNode.forEach(cellNode => {
      cellNode.textContent = '';
      cellNode.classList.remove('player1');
      cellNode.classList.remove('player2');
    })
  }

  return {getBoardData, playerInput, resetBoard};
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
          gameWinner = `${gamePlayers[player].name} wins!`;
        }
      }
    })

    const boardDataCount = boardData.filter(v => v !== undefined).length;
    if(!gameWinner && boardDataCount === 9) {
      gameWinner = `It's a tie!`;
    }

    return gameWinner;
  }

  const resetState = () => {
    playerTurn = 'player1';
    gameWinner = null;
  }

  return {getPlayerTurn, togglePlayer, checkWinner, resetState}
})();

const displayController = (() => {
  const displaySymbol = function (player, index) {
    const gameBlockNode = document.querySelector(`.game-cell[data-position='${index}']`);
    gameBlockNode.textContent = gamePlayers[player].symbol;
  }

  const displayBoard = () => {
    const boardData = gameBoard.getBoardData();
    boardData.forEach((boardPosition, index) => {
      if(boardPosition) {
        displaySymbol(boardPosition, index)
      }
    })
  }

  return displayBoard;
})();

const gameCellNode = document.querySelectorAll('button.game-cell');
gameCellNode.forEach(cellNode => {
  cellNode.addEventListener('click', (e) => {
    gameBoard.playerInput(e.currentTarget.dataset['position'], e.currentTarget);
  })
})

const btnPlayNode = document.querySelector('.btn-play');
btnPlayNode.addEventListener('click', () => {
  const playagainOverlayNode = document.querySelector('.playagain-overlay');
  playagainOverlayNode.style.display = 'none';
  gameBoard.resetBoard();
  gameState.resetState();
})