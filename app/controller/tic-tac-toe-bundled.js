(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./ai-offence-decision-making.js":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./ai-decision-making-helpers/ai-deffence-decision-making.js":1,"./ai-decision-making-helpers/ai-offence-decision-making.js":2}],4:[function(require,module,exports){
// CURRENT_VIRTUAL_BOARD conatins the X and 0 values, which have been placed by the player and AI
let CURRENT_VIRTUAL_BOARD;
const HU_PLAYERS_SIGN = 'O';
const AI_PLAYERS_SIGN = 'X';
const END_GAME_MODAL = document.querySelectorAll('.endgame')[0];
const WIN_COMBOS_ARR = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
const CELLS = document.querySelectorAll('.cell');
const REPLAY_BTN = document.querySelectorAll('#replay')[0];
const WINNER_COLOR = 'lightgreen';
const LOOSER_COLOR = 'red';
const TIE_COLOR = '#fdfdac';
let AI_DECISION_MAKING = require('./controller-modules/ai-decision-making.js').aiDecisionMaking;

startGame();
REPLAY_BTN.addEventListener('click', startGame);

function startGame(){
	hideEndGameModal();
	wipeBoardFromPrevGame();

	function hideEndGameModal() {
		END_GAME_MODAL.style.display = 'none';
	}

	//mit csinalnad az event listenerrel mert az nem ehhez a feladatkorhoz tartozik
	function wipeBoardFromPrevGame() {
		CURRENT_VIRTUAL_BOARD = [...Array(9)].map((item, index) => index);
		CELLS.forEach((cell, index) => {
			cell.innerText = '';
			cell.style.removeProperty('background-color');
			cell.addEventListener('click', turnClick, false);
		});
	}
}

// hogy csinalnad itt a routingot / hogy strukturalnad az ifekete es hogy torned a sorokat
function turnClick(squareEvObj) {
	if (!isSquareClicked(squareEvObj.target)) {

		turn(squareEvObj.target.id, HU_PLAYERS_SIGN);
		let hasHumanWon = IfWon(CURRENT_VIRTUAL_BOARD, HU_PLAYERS_SIGN);

		if (hasHumanWon) {
			gameOver(hasHumanWon);
		}

		if (!ifTie() && !hasHumanWon) {
			turn(bestSquareId(), AI_PLAYERS_SIGN);
			let hasAiWon = IfWon(CURRENT_VIRTUAL_BOARD, AI_PLAYERS_SIGN);
			if (hasAiWon) gameOver(hasAiWon);
		}	
	}
}

// hova tenned ezt a halom kis seged funkciot amiket tobb fukcio is hasznal
function turn(squareId, playersSign){
	CURRENT_VIRTUAL_BOARD[squareId] = playersSign;
	document.getElementById(squareId).innerText = playersSign;
}

function emptySquares() {
	let unclickedSquareIds = CURRENT_VIRTUAL_BOARD.reduce((accumulator, currSquareId, index) => {
		if (typeof currSquareId ===  'number') {
			return [...accumulator, index];
		} 
		return accumulator;
	},[]);
	
	return unclickedSquareIds;
}

function bestSquareId() {
	return  AI_DECISION_MAKING(
		WIN_COMBOS_ARR,
	 	CURRENT_VIRTUAL_BOARD, 
	 	AI_PLAYERS_SIGN,
	 	HU_PLAYERS_SIGN
	 );
}

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

// hova tenned ennek a nagyon funkcionak a sajat alfukcioit amiket csak o hasznal
function gameOver(gameWonObj) {

	if (gameWonObj === 'tie') {
		higlightAllFields();
		disableClickOnFields();
		declaireWinner('tie');
	} else {
		highlightWinningHits();
		disableClickOnFields();
		declaireWinner(gameWonObj.player);
	}

	function higlightAllFields(){
		allSquaresIds = CURRENT_VIRTUAL_BOARD;
	
		for ([idOfSquare, currValue] of allSquaresIds.entries()) {
			currSquare = document.getElementById(idOfSquare);
			currSquare.style.backgroundColor = TIE_COLOR;
		}
	}

	function highlightWinningHits() {
		winningSquaresIds = WIN_COMBOS_ARR[gameWonObj.index];
		highlightColor = (gameWonObj.player === HU_PLAYERS_SIGN) ? WINNER_COLOR : LOOSER_COLOR;

		winningSquaresIds.forEach(currentId => {
			currentWinningSquare = document.getElementById(currentId);
			currentWinningSquare.style.backgroundColor = highlightColor;
		});
	}

	function disableClickOnFields() {
		CELLS.forEach(cell => {
			cell.removeEventListener('click', turnClick, false)
		})
	}

	function declaireWinner(player){
		if (player === 'tie') {
			declaireWinnerOnModal('ITS A TIE GAME', 'blue')
		} else if (player === HU_PLAYERS_SIGN) {
			declaireWinnerOnModal('YOU WON', 'lightgreen')
		} else if (player === AI_PLAYERS_SIGN) {
			declaireWinnerOnModal('AI WON', 'red')
		}

		function declaireWinnerOnModal(message, textColor){
			END_GAME_MODAL.style.display = 'block';
			END_GAME_MODAL.style.color = textColor;
			END_GAME_MODAL.innerHTML = `<p>${message}</p>`;
		}
	}

}
},{"./controller-modules/ai-decision-making.js":3}]},{},[4]);
