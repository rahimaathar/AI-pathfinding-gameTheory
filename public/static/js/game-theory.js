// Game Theory - Tic-Tac-Toe AI
class TicTacToeGame {
    constructor() {
        this.board = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
        this.currentPlayer = 'X'; // Player is X, AI is O
        this.gameOver = false;
        this.playerWins = 0;
        this.aiWins = 0;
        this.draws = 0;

        this.loadStats();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Game cell clicks
        document.querySelectorAll('.game-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.makeMove(index);
            });
        });

        // Control buttons
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('resetStatsBtn').addEventListener('click', () => this.resetStats());
    }

    async makeMove(index) {
        if (this.gameOver || this.board[index] !== '-') {
            return;
        }

        // Player's move
        this.board[index] = 'X';
        this.updateDisplay();

        // Check if player won
        if (this.checkWinner(this.board) === 'X') {
            this.endGame('X');
            return;
        }

        // Check if it's a draw
        if (!this.board.includes('-')) {
            this.endGame('tie');
            return;
        }

        // AI's turn
        this.updateGameStatus('AI is thinking...', 'warning');
        await this.sleep(500); // Small delay for better UX

        try {
            const response = await fetch('/api/tictactoe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    board: this.board,
                    player_move: null
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.board = data.board;
            this.updateDisplay();

            if (data.game_over) {
                this.endGame(data.winner);
            } else {
                this.updateGameStatus('Your turn!', 'info');
            }

        } catch (error) {
            console.error('Error:', error);
            this.updateGameStatus('Error: ' + error.message, 'danger');
        }
    }

    checkWinner(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes('-')) {
            return 'tie';
        }

        return null;
    }

    endGame(winner) {
        this.gameOver = true;

        if (winner === 'X') {
            this.playerWins++;
            this.updateGameStatus('You win! 🎉', 'success');
            this.highlightWinningCells();
        } else if (winner === 'O') {
            this.aiWins++;
            this.updateGameStatus('AI wins! 🤖', 'danger');
            this.highlightWinningCells();
        } else {
            this.draws++;
            this.updateGameStatus('It\'s a draw! 🤝', 'warning');
        }

        this.saveStats();
        this.updateStats();
    }

    highlightWinningCells() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                line.forEach(index => {
                    const cell = document.querySelector(`[data-index="${index}"]`);
                    cell.style.animation = 'pulse 1s infinite';
                });
                break;
            }
        }
    }

    newGame() {
        this.board = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.updateDisplay();
        this.updateGameStatus('Your turn! You are X, AI is O', 'info');

        // Remove animations
        document.querySelectorAll('.game-cell').forEach(cell => {
            cell.style.animation = '';
        });
    }

    resetStats() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            this.playerWins = 0;
            this.aiWins = 0;
            this.draws = 0;
            this.saveStats();
            this.updateStats();
        }
    }

    updateDisplay() {
        document.querySelectorAll('.game-cell').forEach((cell, index) => {
            const value = this.board[index];
            cell.textContent = value === '-' ? '' : value;
            cell.className = `game-cell ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`;
        });
    }

    updateGameStatus(message, type) {
        const statusDiv = document.getElementById('gameStatus');
        statusDiv.className = `alert alert-${type}`;
        statusDiv.innerHTML = message;
    }

    updateStats() {
        document.getElementById('playerWins').textContent = this.playerWins;
        document.getElementById('aiWins').textContent = this.aiWins;
        document.getElementById('draws').textContent = this.draws;
    }

    saveStats() {
        localStorage.setItem('tictactoe_stats', JSON.stringify({
            playerWins: this.playerWins,
            aiWins: this.aiWins,
            draws: this.draws
        }));
    }

    loadStats() {
        const stats = localStorage.getItem('tictactoe_stats');
        if (stats) {
            const data = JSON.parse(stats);
            this.playerWins = data.playerWins || 0;
            this.aiWins = data.aiWins || 0;
            this.draws = data.draws || 0;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS animation for winning cells
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .game-cell.x {
        color: #dc3545;
        font-weight: bold;
    }
    
    .game-cell.o {
        color: #007bff;
        font-weight: bold;
    }
    
    .game-cell:hover {
        background: #f8f9fa;
        border-color: #007bff;
        cursor: pointer;
    }
    
    .game-cell {
        aspect-ratio: 1;
        border: 2px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        transition: all 0.3s ease;
        margin: 2px;
        border-radius: 8px;
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
});
