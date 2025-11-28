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
  };

  const setPlayers = (player1Name, player2Name) => {
    players.player1.name = player1Name;
    players.player2.name = player2Name;
  }

  return {players, setPlayers};
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
      displayController.displayBoard();
      displayController.displayPlayerTurn();

      const playerWinner = checkWinner();
      if(playerWinner) {
        const playagainOverlayNode = document.querySelector('.playagain-overlay');
        const txtWinnerNode = document.getElementById('txt-winner');
        txtWinnerNode.textContent = playerWinner;
        playagainOverlayNode.style.display = 'flex';
        displayController.hidePlayerTurn();
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
      for(const player in gamePlayers.players) {
        if(boardData[a] === player && 
        boardData[b] === player &&
        boardData[c] === player) {
          gameWinner = `${gamePlayers.players[player].name} wins!`;
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
    displayController.displayPlayerTurn();
  }

  return {getPlayerTurn, togglePlayer, checkWinner, resetState}
})();

const displayController = (() => {
  const displaySymbol = function (player, index) {
    const gameBlockNode = document.querySelector(`.game-cell[data-position='${index}']`);
    gameBlockNode.textContent = gamePlayers.players[player].symbol;
  }

  const displayBoard = () => {
    const boardData = gameBoard.getBoardData();
    boardData.forEach((boardPosition, index) => {
      if(boardPosition) {
        displaySymbol(boardPosition, index)
      }
    })
  }

  const displayPlayerTurn = () => {
    const playerturnNode = document.querySelector('.player-turn');
    const playerName = gamePlayers.players[gameState.getPlayerTurn()].name;
    playerturnNode.style.visibility = 'visible';
    playerturnNode.textContent = `${playerName}'s turn...`;
  }

  const hidePlayerTurn = () => {
    const playerturnNode = document.querySelector('.player-turn');
    playerturnNode.style.visibility = 'hidden';
  }

  return {displayBoard, displayPlayerTurn, hidePlayerTurn};
})();

const gameCellNode = document.querySelectorAll('button.game-cell');
gameCellNode.forEach(cellNode => {
  cellNode.addEventListener('click', (e) => {
    gameBoard.playerInput(e.currentTarget.dataset['position'], e.currentTarget);
  })
})

const btnPlayNode = document.getElementById('play-again');
btnPlayNode.addEventListener('click', () => {
  const playagainOverlayNode = document.querySelector('.playagain-overlay');
  playagainOverlayNode.style.display = 'none';
  gameBoard.resetBoard();
  gameState.resetState();
})

const formPlayersNode = document.querySelector('.form-players');
formPlayersNode.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formPlayersNode);
  const playstartOverlay = document.querySelector('.playstart-overlay');
  let {player1, player2} = Object.fromEntries(formData.entries());
  player1 = player1 ? player1 : 'Player 1';
  player2 = player2 ? player2 : 'Player 2';
  gamePlayers.setPlayers(player1, player2);
  playstartOverlay.style.display = 'none';
  displayController.displayPlayerTurn();
})