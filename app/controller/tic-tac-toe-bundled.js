(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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
},{}],2:[function(require,module,exports){
// VIRTUAL_BOARD conatins the X and 0 values, which have been placed by the player and AI
let VIRTUAL_BOARD;
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
let AI_DECISION_MAKING = require('./controller-modules/ai-decision-making.js');

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
		VIRTUAL_BOARD = [...Array(9)].map((item, index) => index);
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
		let hasHumanWon = IfWon(VIRTUAL_BOARD, HU_PLAYERS_SIGN);

		if (hasHumanWon) {
			gameOver(hasHumanWon);
		}

		if (!ifTie() && !hasHumanWon) {
			turn(bestSquareId(), AI_PLAYERS_SIGN);
			let hasAiWon = IfWon(VIRTUAL_BOARD, AI_PLAYERS_SIGN);
			if (hasAiWon) gameOver(hasAiWon);
		}	
	}
}

// hova tenned ezt a halom kis seged funkciot amiket tobb fukcio is hasznal
function turn(squareId, playersSign){
	VIRTUAL_BOARD[squareId] = playersSign;
	document.getElementById(squareId).innerText = playersSign;
}

function emptySquares() {
	let unclickedSquareIds = VIRTUAL_BOARD.reduce((accumulator, currSquareId, index) => {
		if (typeof currSquareId ===  'number') {
			return [...accumulator, index];
		} 
		return accumulator;
	},[]);
	
	return unclickedSquareIds;
}

function bestSquareId() {
	console.log('82:');
	console.log(AI_DECISION_MAKING(WIN_COMBOS_ARR, VIRTUAL_BOARD, AI_PLAYERS_SIGN));
	return emptySquares()[0];
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
		allSquaresIds = VIRTUAL_BOARD;
	
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
},{"./controller-modules/ai-decision-making.js":1}]},{},[2]);
