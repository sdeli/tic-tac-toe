/*  
    check wincombos for hu player
    check wincombos for ai player
    if huPlayer has shorter win combos go defence
    if not go offence

     in defence (huplayerShortestCombos)
        huplayersBestSquaresToWin
        aiBestsquaresToWin
            if matching square => click that
            if not => click hu player best squareToWin
*/
const AI_OFFENCE_DECISION_MAKING = require('./controller-modules/ai-offence-decision-making.js').aiOffenceDecisionMaking;
const GET_SHORTEST_WINCOMBOS = require('./controller-modules/ai-offence-decision-making.js').getShortestWinCombos;
const RANDOM_INDEX_FOR_ARR =  require('./controller-modules/ai-offence-decision-making.js').randomIndexForArr;
const CHOOSE_NEXT_SQUARE_TO_CLICK =  require('./controller-modules/ai-offence-decision-making.js').chooseNextSquareToClick;

/*returns wincombos as arr of arrs. Wincombos are in ascedning order by how many hits of player matches
in combo */
const GET_SHORTEST_WINCOMBOS = require('ai-offence-decision-making.js').getShortestWinCombos;

function aiDecisionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign) {
    // first array will be the shortest                  
    let husShortestWinComboLenght = GET_SHORTEST_WINCOMBOS(
        winCombosArr, 
        currentVirtualBoardArr, 
        huPlayersSign
    )[0].length;

    let aisShortestWinComboLenght = GET_SHORTEST_WINCOMBOS(
        winCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign
    )[0].length;

    let paramtersArr = [
        winCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign, 
        huPlayersSign
    ]

    if (husShortestWinComboLenght > aisShortestWinComboLenght) {
        aiDefenceDecesionMaking(...paramtersArr)
    } else {
        AI_OFFENCE_DECISION_MAKING(...paramtersArr)
    }
}


/*
in defence (huplayerShortestCombos)
    huplayersBestSquaresToWin
    aiBestsquaresToWin
        if matching square => click that
        if not => click hu player best squareToWin
*/

function aiDefenceDecesionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign) {
    let husShortestWinCombos = GET_SHORTEST_WINCOMBOS(
        winCombosArr, 
        currentVirtualBoardArr, 
        playersSign
    )

    let aisShortestWinCombo = GET_SHORTEST_WINCOMBOS(
        winCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign
    );

    let aisShortestWinCombos = getShortestWincombos(aisShortWinCombo);

    let squaresCrossHusWinCombos = getCrossMatchingSquares(aisShortestWinCombos, husShortestWinCombos);

    if (squaresCrossHusWinCombos.length > 0) {
        return CHOOSE_NEXT_SQUARE_TO_CLICK(squaresCrossHusWinCombos)
    } else {
        let aisBestSquares = concatarrs(...aisShortestWinCombos);
        return CHOOSE_NEXT_SQUARE_TO_CLICK(aisBestSquares)
    }
}

function getShortestWincombos(winCombosArr) {
    let shortestWincombos = [winCombosArr[0]];
    let firstArrLength = winCombosArr[0].length;

    for(let i = 1; i < winCombosArr.length; i++){
        if (firstArrLength <= winCombosArr[i]) {
            shortestWincombos.push(winCombosArr[i]);
        } else {
            break;
        }       
    }

    return shortestWincombos;
}

function getCrossMatchingSquares(aisShortestWinCombos, husShortestWinCombos) {
    let aisBestSquares = concatarrs(...aisShortestWinCombos);
    let husBestSquares = concatarrs(...husShortestWinCombos);

    crossMatchingSquares = husBestSquares.reduce((accumulator, husCurrSquare, index) => {
       let hasAiSameSquareInCombos = aisBestSquares.indexOf(husCurrSquare) > -1;

       if (hasAiSameSquareInCombos) {
        return [...accumulator, index];
       }

       return accumulator;
    });

    return crossMatchingSquares;
}

function concatarrs(...winComboArrs) {
    let finalArr = [];
    return finalArr.concat(...arguments)
}

function getBestWinCombosLength(winCombosArr, currentVirtualBoardArr, PlayersSign){
    // this function hsould be refactored for general use  
    let playersShortestWinCombosArr = GET_WINCOMBOS_ASCENDING(
        winCombosArr, 
        currentVirtualBoardArr, 
        playersSign
    );

    return playersShortestWinCombosArr[0].length;
}