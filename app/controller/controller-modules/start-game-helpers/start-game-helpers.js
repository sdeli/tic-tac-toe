function hideEndGameModal(endGameModal) {
    endGameModal.style.display = 'none';
}

//mit csinalnad az event listenerrel mert az nem ehhez a feladatkorhoz tartozik
function wipeBoardFromPrevGame(cells, turnClickFn) {
    cells.forEach((cell, index) => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClickFn, false);
    });
}

module.exports.hideEndGameModal = hideEndGameModal();
module.exports.wipeBoardFromPrevGame = wipeBoardFromPrevGame();