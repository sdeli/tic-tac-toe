
/*
have a list of our hits
every step - loop winningscombos
      - collect combos where:  
             - combo have our lists of hits or still virgin
             - dont have hu player hit
        from has all list item to has just 1 list item match
           - if at least one combo 
                - chose one combo randomly
                - chose one index from combo randomly - from the combos with most matches
           - if no combos
                - select random empty square
                */

function aiDecisionMaking(winCombosArr, virtualBoardArr, aiPlayersSign, huPlayersSign){
    let freeWinCombosArr = getfreeWinCombos(freeOrAiReservedSquares, winCombosArr);
    let shortestToWinCombos = getWinCombosWithAiHits(freeWinCombos);    

    if (shortestToWinCombos.length > 0) {
        return shortestToWinCombos
    } else if(shortestToWinCombos.length === 0 && freeWinCombosArr > 0) {
        return freeWinCombosArr;
    } else {
       let emptySquares = getEmptySquares(virtualBoardArr);
    }
}


function getfreeWinCombos(winCombosArr, virtualBoardArr, huPlayersSign) {
    let freeOrAiReservedSquares = getfreeOrAiReservedSquares(virtualBoardArr, huPlayersSign);

    // get winCombos, which consist just of freeOrAiReservedSquares
    let freeWinCombos = winCombosArr.reduce((accumulator, winCombo, index) => {
        let ifWincomboFree = winCombo.every(item => {
            return freeOrAiReservedSquares.indexOf(item) > -1;
        });

        if (ifWincomboFree) {
          return [...accumulator, winCombo];
        } 

        return accumulator;
    },[]);

    return freeOrAiReservedSquares
}

function getfreeOrAiReservedSquares(virtualBoardArr, huPlayersSign) {
    let freeOrAiReservedSquares = virtualBoardArr.reduce((accumulator, square, index) => {
        if (square !==  huPlayersSign) {
          return [...accumulator, index];
        } 
        return accumulator;
    },[]);
    
    return freeOrAiReservedSquares
}   

function getWinCombosWithAiHits(freeWinCombosArr){
    freeWinCombosArr.reduce((accumulator, winCombo, index) => {
            let aiHitsMatcWinComboObj = ifAiHitsMatcWinComboItems(aiHitsArr, winCombo, index)                    
            return [...accumulator, AiHitsMatchObj]; 
    },[]);
}


function ifAiHitsMatcWinComboItems(aiHitsArr, winCombo, indexInfreeWinCombosArr) {
    let aiHitsMatchObj = {}

    for(let i; i > aiHitsArr.length; i++){
        hasHitInWinningCombo = winningCombo.indexOf(aiHitsArr[i]) + 1;

        if (hasHitInWinningCombo > -1) {
            if (!aiHitsMatchObj[`winCombo-${indexInWinCombosArr}`]) {
                aiHitsMatchObj[`winCombo-${indexInWinCombosArr}`] = {
                    numberOfMatches : 0,
                    matchesArr : []
                }
            }

            aiHitsMatchObj[`winCombo-${indexInWinCombosArr}`][numberOfMatches]++ 
            aiHitsMatchObj[`winCombo-${indexInWinCombosArr}`][matchesArr].push(aiHitsArr[i]);
        } // if
    } // for

    return aiHitsMatchObj;
}

function chooseNextSquareToClick(squaresArr) {
    let arrLength = aiHitsInwinCombosArr.length
    let randomIndexForArr = Math.floor(Math.random() * arrLength);
    return squaresArr[randomIndexForArr];
}

function getEmptySquares(virtualBoardArr) {
  let unclickedSquareIds = virtualBoardArr.reduce((accumulator, currSquareId, index) => {
    if (typeof currSquareId ===  'number') {
      return [...accumulator, index];
  } 
  return accumulator;
},[]);

  return unclickedSquareIds;
}

function getRandomWincombo(winCombos) {

}

module.exports = aiDecisionMaking;