/*
 * Title: ai-decision-making
 * Description: creating the logic for the ai player
 * Author: Sandor Deli
 * Date: 
 *
 */



function aiOffenceDecisionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign){
    let freeWinCombosArr = getfreeWinCombos(winCombosArr, currentVirtualBoardArr, huPlayersSign);
    // wincombos which ahve matches with Ai hits but thse indexes abstracted
    // so we can chose the next square to click
    let shortestToWinCombosArr = getShortestWinCombos(freeWinCombosArr, currentVirtualBoardArr, aiPlayersSign);    
    
    if (shortestToWinCombosArr.length > 0) {
        let bestSquareToClick = chooseNextsquareFromCombos(shortestToWinCombosArr, 0);
        return bestSquareToClick;

    } else if(shortestToWinCombosArr.length === 0 && freeWinCombosArr.length > 0) {
        let goodSquareToClick = chooseNextsquareFromCombos(freeWinCombosArr);
        return goodSquareToClick;

    } else {
       let emptySquares = chooseNextSquareToClick(currentVirtualBoardArr);
       return emptySquares;
    }
}

function getfreeWinCombos(winCombosArr, currentVirtualBoardArr, huPlayersSign) {
    let  freeOrAiReservedSquares = getfreeOrAiReservedSquares(currentVirtualBoardArr, huPlayersSign);
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
  
    return freeWinCombos;
}

function getfreeOrAiReservedSquares(currentVirtualBoardArr, huPlayersSign) {
    let freeOrAiReservedSquares = currentVirtualBoardArr.reduce((accumulator, square, index) => {
        if (square !==  huPlayersSign) {
          return [...accumulator, index];
        } 
        return accumulator;
    },[]);
    
    return freeOrAiReservedSquares
}   

function getShortestWinCombos(freeWinCombosArr, currentVirtualBoardArr, aiPlayersSign){
    var aiHitsArr = getPlayerHits(currentVirtualBoardArr, aiPlayersSign);

    let shortestWinCombos = freeWinCombosArr
    .reduce((accumulator, winCombo, index) => {
            let aiHitsMatchWinComboObj = getWinComboAbstractedAiHitMatches(aiHitsArr, winCombo, index)

            if (aiHitsMatchWinComboObj) {
                return [...accumulator, aiHitsMatchWinComboObj]; 
            }

            return accumulator;
    },[]);
    
    sortWinCombosDescending(shortestWinCombos);
    return getShortesWincombos(shortestWinCombos);

}


function getWinComboAbstractedAiHitMatches(aiHitsArr, winCombo) {
    let aiHitsMatchObj = winCombo;
    
    for(let i = 0; i < winCombo.length; i++){
        let  hasWinComboItemInAiHits = (aiHitsArr.indexOf(winCombo[i])) > -1;
            // Abstracting the current matching ai hit
        let indexToAbstract = aiHitsMatchObj['matchesArr'].indexOf(winCombo[i]);
        aiHitsMatchObj.splice(indexToAbstract,1);
    } // for
    
    let haveBeenMatches = aiHitsMatchObj.length > winCombo;

    if (haveBeenMatches) {
        return aiHitsMatchObj;
    } else {
        return false;
    }
}

function sortWinCombosDescending(wincombosArr) {
    shortestWinCombos.sort((winComboCurr, winComboNext) => 
        winComboCurr.length - winComboNext.length
    );
}

function getShortesWincombos(wincombosArr) {
    let firstComboLength = wincombosArr[0].length;
    return wincombosArr.fiter(currCombo => currCombo.length >= firstComboLength);
}

function getEmptySquares(currentVirtualBoardArr) {
    let unclickedSquareIds = currentVirtualBoardArr.reduce((accumulator, currSquareId, index) => {
        if (typeof currSquareId ===  'number') {
            return [...accumulator, index];
        } 
    return accumulator;
    },[]);

  return unclickedSquareIds;
}

function getPlayerHits(currentVirtualBoardArr, playerSign) {
    playersHits = currentVirtualBoardArr.reduce((accumulator, currSquareId, index) => {
        if (currSquareId ===  playerSign) {
            return [...accumulator, index];
        } 
    return accumulator;
    },[]);
    
  return playersHits;
}

function chooseNextsquareFromCombos(winCombosArr ,whichIndex) {
    let chosenWincombo;

    if (typeof whichIndex !== 'undefined') {
        chosenWincombo = winCombosArr[whichIndex];
    } else {
        let indexForwinCombosArr =  randomIndexForArr(winCombosArr.length);
        chosenWincombo = winCombosArr[indexForwinCombosArr];
    }

    return chooseNextSquareToClick(chosenWincombo);
}

function chooseNextSquareToClick(squaresArr) {
    let arrLength = squaresArr.length;
    let nextSuqaresIndex = randomIndexForArr(arrLength);
    
    return squaresArr[nextSuqaresIndex];
}

function randomIndexForArr(arrLength) {
    return Math.floor(Math.random() * arrLength);
}

module.exports.aiDecisionMaking = aiDecisionMaking;
module.exports.getShortestWinCombos = getShortestWinCombos;
module.exports.randomIndexForArr = randomIndexForArr;
module.exports.chooseNextSquareToClick = chooseNextSquareToClick;
