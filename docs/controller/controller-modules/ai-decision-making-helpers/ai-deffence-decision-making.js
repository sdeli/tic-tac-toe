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
const GET_SHORTEST_WINCOMBOS = require('./ai-offence-decision-making.js').getShortestWinCombos;
const CHOOSE_NEXT_SQUARE_TO_CLICK =  require('./ai-offence-decision-making.js').chooseNextSquareToClick;
const GET_FREE_WINCOMBOS =  require('./ai-offence-decision-making.js').getfreeWinCombos;

function aiDefenceDecesionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign) {
    console.log('deffe');
    let huFreewinCombosArr = GET_FREE_WINCOMBOS(winCombosArr, currentVirtualBoardArr, aiPlayersSign)
    let husShortestWinCombos = GET_SHORTEST_WINCOMBOS(
        huFreewinCombosArr, 
        currentVirtualBoardArr, 
        huPlayersSign
    )

    let aiFreewinCombosArr = GET_FREE_WINCOMBOS(winCombosArr, currentVirtualBoardArr, huPlayersSign)
    let aisShortestWinCombos = GET_SHORTEST_WINCOMBOS(
        aiFreewinCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign
    );

    let squaresCrossHusWinCombos = getCrossMatchingSquares(aisShortestWinCombos, husShortestWinCombos);

    if (squaresCrossHusWinCombos.length > 0) {
        return CHOOSE_NEXT_SQUARE_TO_CLICK(squaresCrossHusWinCombos)
    } else {
        let squareToCrossHu = concatarrs(...husShortestWinCombos);
        return CHOOSE_NEXT_SQUARE_TO_CLICK(squareToCrossHu)
    }
}

function getCrossMatchingSquares(aisShortestWinCombos, husShortestWinCombos) {
    let aisBestSquares = concatarrs(...aisShortestWinCombos);
    let husBestSquares = concatarrs(...husShortestWinCombos);

    crossMatchingSquares = husBestSquares.reduce((accumulator, husBestSquare, index) => {
       let hasAiSameSquareInCombos = aisBestSquares.indexOf(husBestSquare) > -1;

       if (hasAiSameSquareInCombos) {
        return [...accumulator, husBestSquare];
       }

       return accumulator;
    }, []);

    return crossMatchingSquares;
}

function concatarrs(...winComboArrs) {
    let finalArr = [];
    return finalArr.concat(...arguments)
}

module.exports.aiDefenceDecesionMaking = aiDefenceDecesionMaking;