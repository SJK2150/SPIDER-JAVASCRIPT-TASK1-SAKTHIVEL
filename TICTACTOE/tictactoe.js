document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game');
    const statusDisplay = document.getElementById('status');
    const startGameButton = document.getElementById('startGame');
    const timerDisplay = document.getElementById('timer');
    const gridSizeInput = document.getElementById('gridSize');

    let currentPlayer = 'X';
    let gridSize = parseInt(gridSizeInput.value);
    let moves = 0;
    let gameEnded = false;
    let timer;
    let timeout = 10;

    const initializeGame = () => {
        gameBoard.innerHTML = '';
        gameEnded = false;
        moves = 0;
        clearInterval(timer);
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        timerDisplay.textContent = `Time left: ${timeout}s`;

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            gameBoard.appendChild(cell);
        }

        gameBoard.addEventListener('click', handleCellClick);
        startTimer();
    };

    const handleCellClick = (event) => {
        const cell = event.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (cell.textContent === '' && !gameEnded) {
            cell.textContent = currentPlayer;
            moves++;

            if (checkWin(currentPlayer)) {
                statusDisplay.textContent = `Player ${currentPlayer} wins!`;
                gameEnded = true;
            } else if (moves === gridSize * gridSize) {
                statusDisplay.textContent = "It's a draw!";
                gameEnded = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
                resetTimer();
                startTimer();
            }
        }
    };

    const startTimer = () => {
        let timeLeft = timeout;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft}s`;

            if (timeLeft === 0) {
                clearInterval(timer);
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                statusDisplay.textContent = `Player ${currentPlayer} ran out of time!`;
                setTimeout(() => {
                    if (!gameEnded) {
                        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
                        resetTimer();
                        startTimer();
                    }
                }, 2000);
            }
        }, 1000);
    };

    const resetTimer = () => {
        clearInterval(timer);
    };

    const checkWin = (player) => {
        const cells = document.querySelectorAll('.cell');
        const winningCombos = generateWinningCombos(gridSize);

        return winningCombos.some(combination => {
            return combination.every(index => {
                return cells[index].textContent === player;
            });
        });
    };

    const generateWinningCombos = (gridSize) => {
        const combos = [];

        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                row.push(i * gridSize + j);
            }
            combos.push(row);
        }

        for (let i = 0; i < gridSize; i++) {
            const col = [];
            for (let j = 0; j < gridSize; j++) {
                col.push(j * gridSize + i);
            }
            combos.push(col);
        }

        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < gridSize; i++) {
            diagonal1.push(i * gridSize + i);
            diagonal2.push((i + 1) * gridSize - (i + 1));
        }
        combos.push(diagonal1, diagonal2);

        return combos;
    };

    startGameButton.addEventListener('click', () => {
        gridSize = parseInt(gridSizeInput.value);
        initializeGame();
    });

    initializeGame();
});
