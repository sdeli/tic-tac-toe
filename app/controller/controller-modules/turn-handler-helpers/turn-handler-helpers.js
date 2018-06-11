

function isSquareClicked(square){
  return (square.innerText === "") ? false : true;
}

function ifTie() {
  if (emptySquares().length === 0) {
    gameOver('tie');
    return true;
  } else {
    return false;
  }
}


function IfWon(currentBoard, player) {
  let playersHitsOnBoard = currentBoard.reduce((accumuator, currValue, index) => {
    if (currValue === player) {
      return [...accumuator, index];
    } else {
      return accumuator;
    }
  }, []);

  let hasPlayerWon = false;

  for (const [indexOfCombination, winCombo] of WIN_COMBOS_ARR.entries()) {
    var HasWinningCombination = winCombo.every(currValue => {
      return playersHitsOnBoard.indexOf(currValue) > -1
    });

    if (HasWinningCombination) {
      hasPlayerWon = {index : indexOfCombination, player : player}
      break;
    }
  };

  return hasPlayerWon;
}