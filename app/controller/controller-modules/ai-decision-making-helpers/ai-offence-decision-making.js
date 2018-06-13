/*
 * Title: ai-decision-making
 * Description: creating the logic for the ai player
 * Author: Sandor Deli
 * Date: 
 *
 */



function aiOffenceDecisionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign){
    console.log('offe');
    let freeWinCombosArr = getfreeWinCombos(winCombosArr, currentVirtualBoardArr, huPlayersSign);
    // wincombos which ahve matches with Ai hits but thse indexes abstracted
    // so we can chose the next square to click
    let shortestToWinCombosArr = getShortestWinCombos(freeWinCombosArr, currentVirtualBoardArr, aiPlayersSign);    
    
    if (shortestToWinCombosArr.length > 0) {
        let bestSquareToClick = chooseNextsquareFromCombos(shortestToWinCombosArr, 0);
        console.log('offe bestSquareToClick:');
        console.log(bestSquareToClick);
        return bestSquareToClick;

    } else if(shortestToWinCombosArr.length === 0 && freeWinCombosArr.length > 0) {
        let goodSquareToClick = chooseNextsquareFromCombos(freeWinCombosArr);
        console.log('offe goodSquareToClick:');
        console.log(goodSquareToClick);
        return goodSquareToClick;

    } else {
        console.log('offe else');
       let emptySquares = getEmptySquares(currentVirtualBoardArr);
       console.log('emptySquares:');
       console.log(emptySquares);
       let emptySquare = chooseNextSquareToClick(emptySquares);
       console.log('emptySquare:');
       console.log(emptySquare);
       return emptySquare;
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
    console.log(aiPlayersSign + 'hits:');
    console.log(aiHitsArr);
    console.log(aiPlayersSign + ' loop starts -------------------------------');

    let shortestWinCombos = freeWinCombosArr
    .reduce((accumulator, winCombo, index) => {
        console.log('index: ' + index);
            let aiHitsMatchWinComboArr = getWinComboAbstractedAiHitMatches(aiHitsArr, winCombo, index)
            console.log(index+'. accumulator:');
            console.log(accumulator);
            if (aiHitsMatchWinComboArr) {
                return [...accumulator, aiHitsMatchWinComboArr]; 
            }

            return accumulator;
    },[]);
    console.log('loop ends -----------------------------------');
    console.log('shortestWinCombos:');
    console.log(shortestWinCombos);
    sortWinCombosDescending(shortestWinCombos);
    console.log('sortWinCombosDescending:');
    console.log(shortestWinCombos);
    shortestWinCombos = trimmWincombos(shortestWinCombos);
    console.log('trimmWincombos:');
    console.log(shortestWinCombos);
    return shortestWinCombos;
}


function getWinComboAbstractedAiHitMatches(aiHitsArr, winCombo) {
    let aiHitsMatchArr = winCombo.slice();
    console.log('winCombo:');
    console.log(winCombo);
    for(let i = 0; i < winCombo.length; i++){
        console.log('for '+ i +' -------------------------------');
        let  hasWinComboItemInAiHits = (aiHitsArr.indexOf(winCombo[i])) > -1;
        console.log('hasWinComboItemInAiHits:');
        console.log(hasWinComboItemInAiHits);
            // Abstracting the current matching ai hit
        if (hasWinComboItemInAiHits) {
            let indexToAbstract = aiHitsMatchArr.indexOf(winCombo[i]);
            aiHitsMatchArr.splice(indexToAbstract,1);
            console.log('aiHitsMatchArr:');
            console.log(aiHitsMatchArr);
        } // if
      } // for

    let haveBeenMatches = aiHitsMatchArr.length < winCombo.length;
    console.log('haveBeenMatches:');
    console.log(haveBeenMatches);
    return aiHitsMatchArr;
}

function sortWinCombosDescending(wincombosArr) {
    wincombosArr.sort((winComboCurr, winComboNext) => 
        winComboCurr.length - winComboNext.length
    );
}


function trimmWincombos(wincombosArr) {
    if (wincombosArr.length < 1) return wincombosArr;

    let firstComboLength = wincombosArr[0].length;

    let trimmedArr = wincombosArr.filter(currCombo => {
        return currCombo.length <= firstComboLength
    });
    
    return trimmedArr;
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
    console.log('squaresArr:');
    console.log(squaresArr);
    let arrLength = squaresArr.length;
    let nextSuqaresIndex = randomIndexForArr(arrLength);
    console.log('nextSuqaresIndex:');
    console.log(nextSuqaresIndex);
    console.log('squaresArr[nextSuqaresIndex]:');
    console.log(squaresArr[nextSuqaresIndex]);
    return squaresArr[nextSuqaresIndex];
}

function randomIndexForArr(arrLength) {
    return Math.floor(Math.random() * arrLength);
}

module.exports.aiOffenceDecisionMaking = aiOffenceDecisionMaking;
module.exports.getShortestWinCombos = getShortestWinCombos;
module.exports.randomIndexForArr = randomIndexForArr;
module.exports.chooseNextSquareToClick = chooseNextSquareToClick;
module.exports.getfreeWinCombos = getfreeWinCombos;
