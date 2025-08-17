// Graph Coloring Algorithm Visualization
class GraphColoringVisualizer {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = {
            'PL': { x: 150, y: 100, name: 'Poland' },
            'GE': { x: 100, y: 150, name: 'Germany' },
            'CZ': { x: 120, y: 180, name: 'Czech Republic' },
            'AU': { x: 140, y: 220, name: 'Austria' },
            'SK': { x: 160, y: 200, name: 'Slovakia' },
            'HU': { x: 180, y: 220, name: 'Hungary' },
            'SL': { x: 120, y: 240, name: 'Slovenia' },
            'CR': { x: 140, y: 260, name: 'Croatia' },
            'BH': { x: 160, y: 280, name: 'Bosnia' },
            'SE': { x: 180, y: 260, name: 'Serbia' },
            'RO': { x: 200, y: 240, name: 'Romania' },
            'BG': { x: 220, y: 260, name: 'Bulgaria' },
            'GR': { x: 200, y: 300, name: 'Greece' }
        };

        this.edges = [
            ["PL", "GE"], ["PL", "CZ"], ["GE", "CZ"], ["CZ", "AU"],
            ["CZ", "SK"], ["AU", "SK"], ["SK", "HU"], ["AU", "HU"],
            ["AU", "SL"], ["HU", "SL"], ["SL", "CR"], ["HU", "CR"],
            ["CR", "BH"], ["HU", "SE"], ["HU", "RO"], ["SE", "RO"],
            ["BH", "SE"], ["CR", "SE"], ["RO", "BG"], ["BG", "GR"]
        ];

        this.colors = {
            'red': '#dc3545',
            'green': '#28a745',
            'blue': '#007bff',
            'gray': '#6c757d'
        };

        this.isRunning = false;
        this.initializeEventListeners();
        this.drawGraph();
    }

    initializeEventListeners() {
        document.getElementById('runBtn').addEventListener('click', () => this.runAlgorithm());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('compareBtn').addEventListener('click', () => this.compareBoth());
    }

    async runAlgorithm() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateButtonStates(true);

        const algorithm = document.getElementById('algorithmSelect').value;

        try {
            const response = await fetch('/api/graph-coloring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ algorithm: algorithm })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            await this.visualizeSolution(data);
            this.showSolution(data);

        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        } finally {
            this.isRunning = false;
            this.updateButtonStates(false);
        }
    }

    async compareBoth() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateButtonStates(true);

        const algorithms = ['arc', 'dfs'];
        const results = {};

        try {
            for (const algorithm of algorithms) {
                const response = await fetch('/api/graph-coloring', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ algorithm: algorithm })
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

    async visualizeSolution(data) {
        // Clear previous coloring
        this.drawGraph();

        // Animate the coloring process
        const nodes = Object.keys(data.solution);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const color = data.solution[node];
            this.colorNode(node, color);
            await this.sleep(300);
        }
    }

    drawGraph() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw edges
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 2;

        for (const [node1, node2] of this.edges) {
            const pos1 = this.nodes[node1];
            const pos2 = this.nodes[node2];

            this.ctx.beginPath();
            this.ctx.moveTo(pos1.x, pos1.y);
            this.ctx.lineTo(pos2.x, pos2.y);
            this.ctx.stroke();
        }

        // Draw nodes
        for (const [nodeId, node] of Object.entries(this.nodes)) {
            this.drawNode(nodeId, node, '#6c757d');
        }
    }

    drawNode(nodeId, node, color) {
        // Draw node circle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw node label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(nodeId, node.x, node.y);
    }

    colorNode(nodeId, colorName) {
        const node = this.nodes[nodeId];
        const color = this.colors[colorName] || this.colors['gray'];
        this.drawNode(nodeId, node, color);
    }

    reset() {
        this.drawGraph();
        document.getElementById('solution').innerHTML = '<p class="text-muted">Run an algorithm to see the solution...</p>';
    }

    showSolution(data) {
        const solutionDiv = document.getElementById('solution');

        let html = '<h6>Coloring Solution:</h6>';
        html += '<div class="row">';

        const colorGroups = {};
        for (const [node, color] of Object.entries(data.solution)) {
            if (!colorGroups[color]) {
                colorGroups[color] = [];
            }
            colorGroups[color].push(node);
        }

        for (const [color, nodes] of Object.entries(colorGroups)) {
            html += `
                <div class="col-6 mb-2">
                    <span class="badge" style="background-color: ${this.colors[color]}; color: white;">
                        ${color.toUpperCase()}
                    </span>
                    <small class="ms-2">${nodes.join(', ')}</small>
                </div>
            `;
        }

        html += '</div>';

        // Check for constraint violations
        const violations = this.checkViolations(data.solution);
        if (violations.length > 0) {
            html += `
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Constraint Violations:</strong>
                    <ul class="mb-0 mt-2">
                        ${violations.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            html += `
                <div class="alert alert-success mt-3">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Valid Solution:</strong> No constraint violations found!
                </div>
            `;
        }

        solutionDiv.innerHTML = html;
    }

    checkViolations(solution) {
        const violations = [];

        for (const [node1, node2] of this.edges) {
            if (solution[node1] && solution[node2] && solution[node1] === solution[node2]) {
                violations.push(`${node1} and ${node2} both colored ${solution[node1]}`);
            }
        }

        return violations;
    }

    showComparison(results) {
        const solutionDiv = document.getElementById('solution');

        let html = '<h6>Algorithm Comparison:</h6>';
        html += '<div class="row">';

        for (const [algorithm, data] of Object.entries(results)) {
            const violations = this.checkViolations(data.solution);
            const isValid = violations.length === 0;

            html += `
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${algorithm.toUpperCase()}</h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-2">
                                <span class="badge ${isValid ? 'bg-success' : 'bg-warning'}">
                                    ${isValid ? 'Valid' : 'Invalid'} Solution
                                </span>
                            </div>
                            <div class="mb-2">
                                <strong>Nodes Colored:</strong> ${Object.keys(data.solution).length}
                            </div>
                            ${violations.length > 0 ? `
                                <div class="alert alert-warning">
                                    <small><strong>Violations:</strong> ${violations.length}</small>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';

        // Add analysis
        const arcValid = this.checkViolations(results.arc.solution).length === 0;
        const dfsValid = this.checkViolations(results.dfs.solution).length === 0;

        html += `
            <div class="mt-3">
                <h6>Analysis:</h6>
                <ul>
                    <li><strong>Arc Consistency:</strong> ${arcValid ? 'Found valid solution' : 'Incomplete solution'}</li>
                    <li><strong>DFS Backtracking:</strong> ${dfsValid ? 'Found valid solution' : 'No solution found'}</li>
                    <li><strong>Recommendation:</strong> ${dfsValid ? 'DFS Backtracking is more reliable' : 'Both algorithms have limitations'}</li>
                </ul>
            </div>
        `;

        solutionDiv.innerHTML = html;
    }

    showError(message) {
        document.getElementById('solution').innerHTML = `
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
            'compareBtn': '<i class="fas fa-chart-bar me-2"></i>Compare Both'
        };
        return texts[buttonId] || '';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GraphColoringVisualizer();
});
