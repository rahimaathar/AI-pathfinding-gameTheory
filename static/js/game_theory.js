class GameTheoryDemo {
    constructor() {
        this.board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.gameOver = false;
        this.playerWins = 0;
        this.aiWins = 0;
        this.ties = 0;

        this.initializeEventListeners();
        this.updateDisplay();
        this.loadStats();
    }

    initializeEventListeners() {
        // Game cell clicks
        document.querySelectorAll('.game-cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.makeMove(parseInt(e.target.dataset.index)));
        });

        // Control buttons
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('resetStatsBtn').addEventListener('click', () => this.resetStats());
    }

    async makeMove(index) {
        if (this.gameOver || this.board[index] !== "-") {
            return;
        }

        // Player's move
        this.board[index] = "X";
        this.updateDisplay();

        // Check if player won
        if (this.checkWinner() === "X") {
            this.gameOver = true;
            this.playerWins++;
            this.updateGameStatus("Congratulations! You won!", "success");
            this.saveStats();
            return;
        }

        // Check for tie
        if (this.checkWinner() === "tie") {
            this.gameOver = true;
            this.ties++;
            this.updateGameStatus("It's a tie!", "warning");
            this.saveStats();
            return;
        }

        // AI's turn
        this.updateGameStatus("AI is thinking...", "info");
        await this.sleep(500);

        try {
            const response = await fetch('/api/play_tictactoe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    board: this.board,
                    player_move: null
                })
            });

            const data = await response.json();
            this.board = data.board;
            this.gameOver = data.game_over;

            this.updateDisplay();

            if (this.gameOver) {
                if (data.winner === "O") {
                    this.aiWins++;
                    this.updateGameStatus("AI wins! Try again!", "danger");
                } else if (data.winner === "tie") {
                    this.ties++;
                    this.updateGameStatus("It's a tie!", "warning");
                }
                this.saveStats();
            } else {
                this.updateGameStatus("Your turn! You are X, AI is O", "info");
            }

        } catch (error) {
            console.error('Error making AI move:', error);
            this.updateGameStatus("Error making AI move", "danger");
        }
    }

    updateDisplay() {
        // Update board display
        this.board.forEach((cell, index) => {
            const cellElement = document.querySelector(`[data-index="${index}"]`);
            cellElement.textContent = cell === "-" ? "" : cell;
            cellElement.className = `game-cell ${cell.toLowerCase()}`;
        });

        // Update statistics
        document.getElementById('playerWins').textContent = this.playerWins;
        document.getElementById('aiWins').textContent = this.aiWins;
        document.getElementById('ties').textContent = this.ties;
    }

    updateGameStatus(message, type) {
        const statusElement = document.getElementById('gameStatus');
        statusElement.className = `alert alert-${type}`;
        statusElement.textContent = message;
    }

    checkWinner() {
        // Check rows
        for (let i = 0; i < 9; i += 3) {
            if (this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2] && this.board[i] !== "-") {
                return this.board[i];
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (this.board[i] === this.board[i + 3] && this.board[i + 3] === this.board[i + 6] && this.board[i] !== "-") {
                return this.board[i];
            }
        }

        // Check diagonals
        if (this.board[0] === this.board[4] && this.board[4] === this.board[8] && this.board[0] !== "-") {
            return this.board[0];
        }
        if (this.board[2] === this.board[4] && this.board[4] === this.board[6] && this.board[2] !== "-") {
            return this.board[2];
        }

        // Check for tie
        if (!this.board.includes("-")) {
            return "tie";
        }

        return null;
    }

    newGame() {
        this.board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.gameOver = false;
        this.updateDisplay();
        this.updateGameStatus("Your turn! You are X, AI is O", "info");
    }

    resetStats() {
        this.playerWins = 0;
        this.aiWins = 0;
        this.ties = 0;
        this.updateDisplay();
        this.saveStats();
        this.updateGameStatus("Statistics reset!", "info");
    }

    loadStats() {
        const stats = localStorage.getItem('tictactoe_stats');
        if (stats) {
            const parsed = JSON.parse(stats);
            this.playerWins = parsed.playerWins || 0;
            this.aiWins = parsed.aiWins || 0;
            this.ties = parsed.ties || 0;
            this.updateDisplay();
        }
    }

    saveStats() {
        const stats = {
            playerWins: this.playerWins,
            aiWins: this.aiWins,
            ties: this.ties
        };
        localStorage.setItem('tictactoe_stats', JSON.stringify(stats));
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameTheoryDemo();
}); 