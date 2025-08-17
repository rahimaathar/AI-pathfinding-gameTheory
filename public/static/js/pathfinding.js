// Pathfinding Algorithm Visualization
class PathfindingVisualizer {
    constructor() {
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.mazeSize = 20;
        this.cellSize = this.canvas.width / this.mazeSize;
        this.start = [20, 20];
        this.goal = [1, 1];
        this.mazeData = null;
        this.isRunning = false;
        this.animationSpeed = 5;

        this.initializeEventListeners();
        this.drawMaze();
    }

    initializeEventListeners() {
        document.getElementById('runBtn').addEventListener('click', () => this.runAlgorithm());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('compareBtn').addEventListener('click', () => this.compareAll());
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = e.target.value;
        });
    }

    async runAlgorithm() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.reset();
        this.updateButtonStates(true);

        const algorithm = document.getElementById('algorithmSelect').value;

        try {
            const response = await fetch('/api/pathfinding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    algorithm: algorithm,
                    start: this.start,
                    goal: this.goal
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            await this.visualizeAlgorithm(data);
            this.showResults(data);

        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        } finally {
            this.isRunning = false;
            this.updateButtonStates(false);
        }
    }

    async visualizeAlgorithm(data) {
        const delay = (11 - this.animationSpeed) * 50; // Convert speed to delay

        // Visualize exploration
        for (let i = 0; i < data.explored.length; i++) {
            const pos = data.explored[i];
            this.drawCell(pos[0], pos[1], '#2196F3', 0.7);
            await this.sleep(delay);
        }

        // Visualize path
        await this.sleep(500);
        for (let i = 0; i < data.path.length; i++) {
            const pos = data.path[i];
            this.drawCell(pos[0], pos[1], '#FF9800', 1);
            await this.sleep(delay * 2);
        }
    }

    async compareAll() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateButtonStates(true);

        const algorithms = ['dfs', 'bfs', 'astar'];
        const results = {};

        try {
            for (const algorithm of algorithms) {
                const response = await fetch('/api/pathfinding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        algorithm: algorithm,
                        start: this.start,
                        goal: this.goal
                    })
                });

                const data = await response.json();
                results[algorithm] = data;
            }

            this.showComparison(results);

        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        } finally {
            this.isRunning = false;
            this.updateButtonStates(false);
        }
    }

    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let i = 0; i <= this.mazeSize; i++) {
            this.ctx.strokeStyle = '#ddd';
            this.ctx.lineWidth = 1;

            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();

            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }

        // Draw start and goal
        this.drawCell(this.start[0], this.start[1], '#4CAF50', 1);
        this.drawCell(this.goal[0], this.goal[1], '#f44336', 1);

        // Add labels
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('START', (this.start[1] - 0.5) * this.cellSize, (this.start[0] - 0.3) * this.cellSize);
        this.ctx.fillText('GOAL', (this.goal[1] - 0.5) * this.cellSize, (this.goal[0] - 0.3) * this.cellSize);
    }

    drawCell(row, col, color, opacity) {
        const x = (col - 1) * this.cellSize;
        const y = (row - 1) * this.cellSize;

        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
        this.ctx.globalAlpha = 1;
    }

    reset() {
        this.drawMaze();
        document.getElementById('results').innerHTML = '<p class="text-muted">Run an algorithm to see results...</p>';
        document.getElementById('comparisonResults').innerHTML = '<p class="text-muted">Click "Compare All" to see performance metrics...</p>';
    }

    showResults(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="row">
                <div class="col-6">
                    <div class="stat-box">
                        <h4>${data.explored_count}</h4>
                        <small>Cells Explored</small>
                    </div>
                </div>
                <div class="col-6">
                    <div class="stat-box">
                        <h4>${data.path_length}</h4>
                        <small>Path Length</small>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <h6>Algorithm Details:</h6>
                <ul class="list-unstyled">
                    <li><strong>Algorithm:</strong> ${data.algorithm.toUpperCase()}</li>
                    <li><strong>Optimal:</strong> ${data.algorithm === 'bfs' || data.algorithm === 'astar' ? 'Yes' : 'No'}</li>
                    <li><strong>Start:</strong> (${data.path[0] ? data.path[0][0] : this.start[0]}, ${data.path[0] ? data.path[0][1] : this.start[1]})</li>
                    <li><strong>Goal:</strong> (${data.path[data.path.length - 1] ? data.path[data.path.length - 1][0] : this.goal[0]}, ${data.path[data.path.length - 1] ? data.path[data.path.length - 1][1] : this.goal[1]})</li>
                </ul>
            </div>
        `;
    }

    showComparison(results) {
        const comparisonDiv = document.getElementById('comparisonResults');

        let html = '<div class="row">';

        for (const [algorithm, data] of Object.entries(results)) {
            const isOptimal = algorithm === 'bfs' || algorithm === 'astar';
            html += `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${algorithm.toUpperCase()}</h6>
                        </div>
                        <div class="card-body">
                            <div class="row text-center">
                                <div class="col-6">
                                    <div class="stat-box">
                                        <h5>${data.explored_count}</h5>
                                        <small>Explored</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="stat-box">
                                        <h5>${data.path_length}</h5>
                                        <small>Path</small>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2">
                                <span class="badge ${isOptimal ? 'bg-success' : 'bg-warning'}">${isOptimal ? 'Optimal' : 'Non-optimal'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';

        // Add analysis
        html += `
            <div class="mt-3">
                <h6>Analysis:</h6>
                <ul>
                    <li><strong>Most Efficient:</strong> ${this.getMostEfficient(results)}</li>
                    <li><strong>Shortest Path:</strong> ${this.getShortestPath(results)}</li>
                    <li><strong>Least Explored:</strong> ${this.getLeastExplored(results)}</li>
                </ul>
            </div>
        `;

        comparisonDiv.innerHTML = html;
    }

    getMostEfficient(results) {
        const efficiency = Object.entries(results).map(([alg, data]) => ({
            algorithm: alg,
            efficiency: data.path_length / data.explored_count
        }));
        efficiency.sort((a, b) => a.efficiency - b.efficiency);
        return efficiency[0].algorithm.toUpperCase();
    }

    getShortestPath(results) {
        const paths = Object.entries(results).map(([alg, data]) => ({
            algorithm: alg,
            pathLength: data.path_length
        }));
        paths.sort((a, b) => a.pathLength - b.pathLength);
        return `${paths[0].algorithm.toUpperCase()} (${paths[0].pathLength} steps)`;
    }

    getLeastExplored(results) {
        const explored = Object.entries(results).map(([alg, data]) => ({
            algorithm: alg,
            explored: data.explored_count
        }));
        explored.sort((a, b) => a.explored - b.explored);
        return `${explored[0].algorithm.toUpperCase()} (${explored[0].explored} cells)`;
    }

    showError(message) {
        document.getElementById('results').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Error: ${message}
            </div>
        `;
    }

    updateButtonStates(disabled) {
        const buttons = ['runBtn', 'resetBtn', 'compareBtn'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            btn.disabled = disabled;
            if (disabled) {
                btn.innerHTML = `<span class="loading"></span> Running...`;
            } else {
                btn.innerHTML = this.getButtonText(id);
            }
        });
    }

    getButtonText(buttonId) {
        const texts = {
            'runBtn': '<i class="fas fa-play me-2"></i>Run Algorithm',
            'resetBtn': '<i class="fas fa-redo me-2"></i>Reset',
            'compareBtn': '<i class="fas fa-chart-bar me-2"></i>Compare All'
        };
        return texts[buttonId] || '';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PathfindingVisualizer();
});
