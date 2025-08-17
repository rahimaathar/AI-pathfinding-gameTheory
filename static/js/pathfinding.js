class PathfindingDemo {
    constructor() {
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 30;
        this.mazeSize = 20;
        this.explored = [];
        this.path = [];
        this.isAnimating = false;
        this.animationSpeed = 5;

        this.initializeEventListeners();
        this.drawMaze();
    }

    initializeEventListeners() {
        document.getElementById('runBtn').addEventListener('click', () => this.runAlgorithm());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('compareBtn').addEventListener('click', () => this.compareAlgorithms());
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = e.target.value;
        });
    }

    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let i = 0; i <= this.mazeSize; i++) {
            this.ctx.strokeStyle = '#dee2e6';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.mazeSize * this.cellSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.mazeSize * this.cellSize, i * this.cellSize);
            this.ctx.stroke();
        }

        // Draw start and goal
        this.drawCell(19, 19, '#28a745', 'S');
        this.drawCell(0, 0, '#dc3545', 'G');
    }

    drawCell(x, y, color, label = '') {
        const pixelX = x * this.cellSize;
        const pixelY = y * this.cellSize;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX + 1, pixelY + 1, this.cellSize - 2, this.cellSize - 2);

        if (label) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, pixelX + this.cellSize / 2, pixelY + this.cellSize / 2 + 4);
        }
    }

    async runAlgorithm() {
        if (this.isAnimating) return;

        const algorithm = document.getElementById('algorithmSelect').value;
        const runBtn = document.getElementById('runBtn');
        const resultsDiv = document.getElementById('results');

        runBtn.disabled = true;
        runBtn.innerHTML = '<div class="spinner"></div> Running...';

        try {
            const response = await fetch('/api/run_algorithm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    algorithm: algorithm,
                    start: [20, 20],
                    goal: [1, 1]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.explored = data.explored;
            this.path = data.path;

            // Display results
            resultsDiv.innerHTML = `
                <div class="alert alert-success">
                    <h6>Algorithm: ${algorithm.toUpperCase()}</h6>
                    <p><strong>Nodes Explored:</strong> ${data.explored_count}</p>
                    <p><strong>Path Length:</strong> ${data.path_length}</p>
                    <p><strong>Optimal:</strong> ${algorithm === 'dfs' ? 'No' : 'Yes'}</p>
                </div>
            `;

            // Animate the algorithm
            await this.animateAlgorithm();

        } catch (error) {
            resultsDiv.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        } finally {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="fas fa-play me-2"></i>Run Algorithm';
        }
    }

    async animateAlgorithm() {
        this.isAnimating = true;
        this.drawMaze();

        // Animate explored nodes
        for (let i = 0; i < this.explored.length; i++) {
            const [x, y] = this.explored[i];
            this.drawCell(x - 1, y - 1, '#ffc107', '');

            if (i % this.animationSpeed === 0) {
                await this.sleep(50);
            }
        }

        // Animate final path
        for (let i = 0; i < this.path.length; i++) {
            const [x, y] = this.path[i];
            this.drawCell(x - 1, y - 1, '#007bff', '');

            if (i % this.animationSpeed === 0) {
                await this.sleep(100);
            }
        }

        this.isAnimating = false;
    }

    async compareAlgorithms() {
        const compareBtn = document.getElementById('compareBtn');
        const comparisonResults = document.getElementById('comparisonResults');

        compareBtn.disabled = true;
        compareBtn.innerHTML = '<div class="spinner"></div> Comparing...';

        try {
            const response = await fetch('/api/performance_comparison');
            const data = await response.json();

            let html = '<div class="row">';
            for (const [algorithm, metrics] of Object.entries(data)) {
                html += `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5 class="card-title">${algorithm}</h5>
                                <div class="row">
                                    <div class="col-6">
                                        <h6>Explored</h6>
                                        <p class="text-primary">${metrics.explored_count}</p>
                                    </div>
                                    <div class="col-6">
                                        <h6>Path Length</h6>
                                        <p class="text-success">${metrics.path_length}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <h6>Time (ms)</h6>
                                        <p class="text-info">${(metrics.execution_time * 1000).toFixed(2)}</p>
                                    </div>
                                    <div class="col-6">
                                        <h6>Optimal</h6>
                                        <p class="${metrics.optimal ? 'text-success' : 'text-warning'}">
                                            ${metrics.optimal ? '✓' : '✗'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            html += '</div>';

            comparisonResults.innerHTML = html;

        } catch (error) {
            comparisonResults.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        } finally {
            compareBtn.disabled = false;
            compareBtn.innerHTML = '<i class="fas fa-chart-bar me-2"></i>Compare All';
        }
    }

    reset() {
        this.explored = [];
        this.path = [];
        this.isAnimating = false;
        this.drawMaze();

        document.getElementById('results').innerHTML = '<p class="text-muted">Run an algorithm to see results...</p>';
        document.getElementById('comparisonResults').innerHTML = '<p class="text-muted">Click "Compare All" to see performance metrics...</p>';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PathfindingDemo();
}); 