(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// origBoard conatins the X and 0 values, which have been placed by the player and AI
var origBoard;
const huPlayersSign = 'O';
const aiPlayersSign = 'X';
const endGameModal = document.querySelectorAll('.endgame')[0];
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
const cells = document.querySelectorAll('.cell');
const replayBtn = document.querySelectorAll('#replay')[0];
const winnerColor = 'lightgreen';
const looserColor = 'red';

startGame();
replayBtn.addEventListener('click', startGame);

function startGame(){
	hideEndGameModal();
	wipeBoardFromPrevGame();

	function hideEndGameModal() {
		endGameModal.style.display = 'none';
	}

	//mit csinalnad az event listenerrel mert az nem ehhez a feladatkorhoz tartozik
	function wipeBoardFromPrevGame() {
		origBoard = [...Array(9)].map((item, index) => index);
		cells.forEach((cell, index) => {
			cell.innerText = '';
			cell.style.removeProperty('background-color');
			cell.addEventListener('click', turnClick, false);
		});
	}
}

// hogy csinalnad itt a routingot / hogy strukturalnad az ifekete es hogy torned a sorokat
function turnClick(squareEvObj) {
	if (!isSquareClicked(squareEvObj.target)) {
		turn(squareEvObj.target.id, huPlayersSign);
		let hasHumanWon = IfWon(origBoard, huPlayersSign);

		if (hasHumanWon) {
			gameOver(hasHumanWon);
			return;	
		}

		if (!ifTie() && !hasHumanWon) {
			turn(bestSquareId(), aiPlayersSign);
			let hasAiWon = IfWon(origBoard, aiPlayersSign);
			if (hasAiWon) gameOver(hasAiWon);
		}	
	}
}

// hova tenned ezt a halom kis seged funkciot amiket tobb fukcio is hasznal
function turn(squareId, playersSign){
	origBoard[squareId] = playersSign;
	document.getElementById(squareId).innerText = playersSign;
}

function emptySquares() {
	let unclickedSquareIds = origBoard.reduce((accumulator, currSquareId, index) => {
		if (typeof currSquareId ===  'number') {
			return [...accumulator, index];
		} 
		return accumulator;
	},[]);
	
	return unclickedSquareIds;
}

function bestSquareId() {
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

	for (const [indexOfCombination, winCombo] of winCombos.entries()) {
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
	console.log('over:');
	console.log(gameWonObj);
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
		allSquaresIds = origBoard;
	
		for ([idOfSquare, currValue] of allSquaresIds.entries()) {
			currSquare = document.getElementById(idOfSquare);
			currSquare.style.backgroundColor = looserColor;
		}
	}

	function highlightWinningHits() {
		winningSquaresIds = winCombos[gameWonObj.index];
		highlightColor = (gameWonObj.player === huPlayersSign) ? winnerColor : looserColor;

		winningSquaresIds.forEach(currentId => {
			currentWinningSquare = document.getElementById(currentId);
			currentWinningSquare.style.backgroundColor = highlightColor;
		});
	}

	function disableClickOnFields() {
		cells.forEach(cell => {
			cell.removeEventListener('click', turnClick, false)
		})
	}

	function declaireWinner(player){
		if (player === 'tie') {
			declaireWinnerOnModal('ITS A TIE GAME', 'blue')
		} else if (player === huPlayersSign) {
			declaireWinnerOnModal('YOU WON', 'lightgreen')
		} else if (player === aiPlayersSign) {
			declaireWinnerOnModal('AI WON', 'red')
		}

		function declaireWinnerOnModal(message, textColor){
			endGameModal.style.display = 'block';
			endGameModal.style.color = textColor;
			endGameModal.innerHTML = `<p>${message}</p>`;
		}
	}

}
},{}]},{},[1]);
