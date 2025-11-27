const gameBoard = ((player1, player2) => {
  const players = { player1, player2 }
  const boardData = {
    player1: [],
    player2: []
  };
  
  const getPlayers = () => ({...players});
  
  const getBoardData = () => ({...boardData});
  const setBoardData = (player, blockNumber) => {
    boardData[player] = [...boardData[player], blockNumber];
  }
  const validateBoardData = (blockNumber) => {
    if([...boardData.player1, ...boardData.player2].includes(blockNumber)) {
      return false;
    };
    return true;
  }

  return {getPlayers, getBoardData, setBoardData, validateBoardData};
})('player1', 'player2');

const gameState = (() => {
  const {setBoardData, validateBoardData} = gameBoard;
  let playerTurn = 'player1';

  const togglePlayer = () => {
    playerTurn = playerTurn === 'player1' ? 'player2' : 'player1';
  }

  const playerInput = (blockNumber) => {
    if(validateBoardData(blockNumber)) {
      setBoardData(playerTurn, blockNumber);
      togglePlayer();
      displayController();
    }
  }

  return {playerInput}
})();

const displayController = (() => {
  const playerSymbols = {
    player1: 'X',
    player2: 'O'
  }

  const displaySymbol = function (boardPosition, player) {
    const gameBlockNode = document.querySelector(`.game-block[data-position='${boardPosition}']`);
    gameBlockNode.textContent = playerSymbols[player];
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
    gameState.playerInput(e.currentTarget.dataset['position']);
  })
})