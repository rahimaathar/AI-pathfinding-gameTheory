class GraphColoringDemo {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.solution = {};
        this.isAnimating = false;

        this.initializeEventListeners();
        this.drawGraph();
    }

    initializeEventListeners() {
        document.getElementById('runBtn').addEventListener('click', () => this.runAlgorithm());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('compareBtn').addEventListener('click', () => this.compareAlgorithms());
    }

    drawGraph() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // European countries graph layout
        const nodePositions = {
            'PL': [100, 150], 'GE': [200, 100], 'CZ': [250, 150], 'AU': [300, 200],
            'SK': [280, 180], 'HU': [320, 180], 'SL': [280, 220], 'CR': [350, 200],
            'BH': [380, 180], 'SE': [400, 160], 'RO': [450, 200], 'BG': [500, 220],
            'GR': [480, 280]
        };

        // Draw edges
        this.ctx.strokeStyle = '#dee2e6';
        this.ctx.lineWidth = 2;

        const edges = [
            ["PL", "GE"], ["PL", "CZ"], ["GE", "CZ"], ["CZ", "AU"],
            ["CZ", "SK"], ["AU", "SK"], ["SK", "HU"], ["AU", "HU"],
            ["AU", "SL"], ["HU", "SL"], ["SL", "CR"], ["HU", "CR"],
            ["CR", "BH"], ["HU", "SE"], ["HU", "RO"], ["SE", "RO"],
            ["BH", "SE"], ["CR", "SE"], ["RO", "BG"], ["BG", "GR"]
        ];

        edges.forEach(([node1, node2]) => {
            const pos1 = nodePositions[node1];
            const pos2 = nodePositions[node2];

            this.ctx.beginPath();
            this.ctx.moveTo(pos1[0], pos1[1]);
            this.ctx.lineTo(pos2[0], pos2[1]);
            this.ctx.stroke();
        });

        // Draw nodes
        Object.entries(nodePositions).forEach(([node, pos]) => {
            this.drawNode(pos[0], pos[1], node, this.solution[node] || '#6c757d');
        });
    }

    drawNode(x, y, label, color) {
        // Draw node circle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw border
        this.ctx.strokeStyle = '#343a40';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw label
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, x, y + 4);
    }

    async runAlgorithm() {
        if (this.isAnimating) return;

        const algorithm = document.getElementById('algorithmSelect').value;
        const runBtn = document.getElementById('runBtn');
        const solutionDiv = document.getElementById('solution');

        runBtn.disabled = true;
        runBtn.innerHTML = '<div class="spinner"></div> Running...';

        try {
            const response = await fetch('/api/run_graph_coloring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    algorithm: algorithm
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.solution = data.solution;

            // Display solution
            let solutionHtml = `
                <div class="alert alert-success">
                    <h6>Algorithm: ${algorithm === 'arc' ? 'Arc Consistency' : 'DFS Backtracking'}</h6>
                    <p><strong>Solution Found:</strong> ${Object.keys(this.solution).length > 0 ? 'Yes' : 'No'}</p>
                </div>
                <div class="mt-3">
                    <h6>Color Assignment:</h6>
                    <div class="row">
            `;

            const colorMap = {
                'red': '#dc3545',
                'green': '#28a745',
                'blue': '#007bff'
            };

            Object.entries(this.solution).forEach(([country, color]) => {
                solutionHtml += `
                    <div class="col-6 mb-2">
                        <span class="badge" style="background-color: ${colorMap[color]}; color: white;">
                            ${country}: ${color}
                        </span>
                    </div>
                `;
            });

            solutionHtml += '</div></div>';
            solutionDiv.innerHTML = solutionHtml;

            // Animate the solution
            await this.animateSolution();

        } catch (error) {
            solutionDiv.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        } finally {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="fas fa-play me-2"></i>Run Algorithm';
        }
    }

    async animateSolution() {
        this.isAnimating = true;

        // Animate each node color change
        const nodePositions = {
            'PL': [100, 150], 'GE': [200, 100], 'CZ': [250, 150], 'AU': [300, 200],
            'SK': [280, 180], 'HU': [320, 180], 'SL': [280, 220], 'CR': [350, 200],
            'BH': [380, 180], 'SE': [400, 160], 'RO': [450, 200], 'BG': [500, 220],
            'GR': [480, 280]
        };

        for (const [node, color] of Object.entries(this.solution)) {
            if (nodePositions[node]) {
                this.drawGraph();
                await this.sleep(200);
            }
        }

        this.isAnimating = false;
    }

    async compareAlgorithms() {
        const compareBtn = document.getElementById('compareBtn');
        const solutionDiv = document.getElementById('solution');

        compareBtn.disabled = true;
        compareBtn.innerHTML = '<div class="spinner"></div> Comparing...';

        try {
            const algorithms = ['arc', 'dfs'];
            const results = {};

            for (const algorithm of algorithms) {
                const response = await fetch('/api/run_graph_coloring', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ algorithm })
                });

                const data = await response.json();
                results[algorithm] = data.solution;
            }

            let comparisonHtml = `
                <div class="alert alert-info">
                    <h6>Algorithm Comparison</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Arc Consistency</h6>
                            <p>Solution: ${Object.keys(results.arc).length > 0 ? 'Found' : 'Not Found'}</p>
                            <p>Countries colored: ${Object.keys(results.arc).length}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>DFS Backtracking</h6>
                            <p>Solution: ${Object.keys(results.dfs).length > 0 ? 'Found' : 'Not Found'}</p>
                            <p>Countries colored: ${Object.keys(results.dfs).length}</p>
                        </div>
                    </div>
                </div>
            `;

            solutionDiv.innerHTML = comparisonHtml;

        } catch (error) {
            solutionDiv.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        } finally {
            compareBtn.disabled = false;
            compareBtn.innerHTML = '<i class="fas fa-chart-bar me-2"></i>Compare Both';
        }
    }

    reset() {
        this.solution = {};
        this.isAnimating = false;
        this.drawGraph();

        document.getElementById('solution').innerHTML = '<p class="text-muted">Run an algorithm to see the solution...</p>';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GraphColoringDemo();
}); 