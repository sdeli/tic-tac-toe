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