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
const AI_OFFENCE_DECISION_MAKING = require('./ai-decision-making-helpers/ai-offence-decision-making.js').aiOffenceDecisionMaking;
const AI_DEFENCE_DECESION_MAKING = require('./ai-decision-making-helpers/ai-deffence-decision-making.js').aiDefenceDecesionMaking;
const GET_SHORTEST_WINCOMBOS = require('./ai-decision-making-helpers/ai-offence-decision-making.js').getShortestWinCombos;
const GET_FREE_WINCOMBOS =  require('./ai-decision-making-helpers/ai-offence-decision-making.js').getfreeWinCombos;



function aiDecisionMaking(winCombosArr, currentVirtualBoardArr, aiPlayersSign, huPlayersSign) {

    console.log('aiDecisionMaking ******************************************** ');
    console.log('aiDecisionMaking ******************************************** ');
    console.log('aiDecisionMaking ******************************************** ');

    let aiFreeWinCombosArr = GET_FREE_WINCOMBOS(winCombosArr, currentVirtualBoardArr, aiPlayersSign);
    let husShortestWinCombo = GET_SHORTEST_WINCOMBOS(
        aiFreeWinCombosArr, 
        currentVirtualBoardArr, 
        huPlayersSign
    );

    let husShortestWinComboLenght = getArrLength(husShortestWinCombo);
    console.log('husShortestWinComboLenght:');
    console.log(husShortestWinComboLenght);

    let huFreeWinCombosArr = GET_FREE_WINCOMBOS(winCombosArr, currentVirtualBoardArr, huPlayersSign);
    let aisShortestWinCombo = GET_SHORTEST_WINCOMBOS(
        huFreeWinCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign
    );

    let aisShortestWinComboLenght = getArrLength(aisShortestWinCombo);
    
    console.log('husShortestWinComboLenght:');
    console.log(husShortestWinComboLenght);
    console.log('aisShortestWinComboLenght:');
    console.log(aisShortestWinComboLenght);
    console.log('husShortestWinComboLenght > aisShortestWinComboLenght:');
    console.log(husShortestWinComboLenght > aisShortestWinComboLenght);
    
    let paramtersArr = [
        winCombosArr, 
        currentVirtualBoardArr, 
        aiPlayersSign, 
        huPlayersSign
    ]

    if (husShortestWinComboLenght < aisShortestWinComboLenght) {
        return AI_DEFENCE_DECESION_MAKING(...paramtersArr)
    } else {
        return AI_OFFENCE_DECISION_MAKING(...paramtersArr)
    }
}

function getArrLength(arr){
    if (arr.length > 0) {
        return arr[0].length
    } else {
        return 0;
    }
}   

module.exports.aiDecisionMaking = aiDecisionMaking;
