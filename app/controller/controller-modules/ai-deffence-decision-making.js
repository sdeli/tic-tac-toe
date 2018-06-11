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

/*returns wincombos as arr of arrs. Wincombos are in ascedning order by how many hits of player matches
in combo */
const GET_WINCOMBOS_ASCENDING = require('ai-offence-decision-making.js').getShortestWinCombos;

function aiDecisionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign) {
    // first array will be the shortest                  
    let husShortestWinComboLenght = getBestWinCombosLength(
        winCombosArr, 
        currentVirtualBoardArr, 
        huPlayersSign
    );

    let aisShortestWinComboLenght = getBestWinCombosLength(
        winCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign
    );

    // first array will be the shortest
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
    /*Ai should click the squares which are crossing hu-s best combos and the same time
    on ai-s best combos*/
}


/*
in defence (huplayerShortestCombos)
    huplayersBestSquaresToWin
    aiBestsquaresToWin
        if matching square => click that
        if not => click hu player best squareToWin
*/

function aiDefenceDecesionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign) {
    let husShortWinCombos = GET_WINCOMBOS_ASCENDING(
        winCombosArr, 
        currentVirtualBoardArr, 
        playersSign
    )

    let husShortestWinCombos = getShortestWincombos(husShortWinCombos);

    let aisShortWinCombo = GET_WINCOMBOS_ASCENDING(
        winCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign
    );

    let aisShortestWinCombos = getShortestWincombos(aisShortWinCombo);

    let squaresCrossHusWinCombos = getCrossMatchingSquares(aisShortestWinCombos, husShortestWinCombos);
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