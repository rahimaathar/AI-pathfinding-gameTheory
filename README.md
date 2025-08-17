# AI Pathfinding & Game Theory Algorithms

A comprehensive implementation of classic AI algorithms with interactive visualizations, perfect for demonstrating algorithmic thinking and problem-solving skills.

## 🎯 Project Overview

This project implements three fundamental AI algorithms with modern visual interfaces:

1. **Pathfinding Algorithms** - DFS, BFS, and A* search with real-time maze visualization
2. **Graph Coloring** - Arc Consistency and DFS Backtracking for constraint satisfaction
3. **Game Theory** - Minimax with Alpha-Beta pruning for optimal game play

## 🚀 Features

### Interactive Web Interface
- **Real-time visualization** of algorithm execution
- **Step-by-step animation** showing decision processes
- **Performance metrics** and comparison tools
- **Modern, responsive design** suitable for demos

### Algorithm Implementations

#### Pathfinding (Task 1)
- **Depth-First Search (DFS)** - Systematic exploration using stack-based traversal
- **Breadth-First Search (BFS)** - Optimal path finding using queue-based traversal  
- **A* Search** - Heuristic-based optimal pathfinding with Euclidean distance

#### Graph Coloring (Task 2)
- **Arc Consistency** - Constraint propagation for graph coloring
- **DFS Backtracking** - Systematic search with constraint satisfaction
- **Interactive graph visualization** with color assignments

#### Game Theory (Task 3)
- **Minimax Algorithm** - Optimal decision making for two-player games
- **Alpha-Beta Pruning** - Performance optimization for game tree search
- **Interactive Tic-Tac-Toe** with unbeatable AI opponent

## 🛠️ Technologies Used

- **Python 3.8+** - Core algorithm implementation
- **Flask** - Web framework for interactive interface
- **JavaScript/HTML5 Canvas** - Real-time visualizations
- **NetworkX** - Graph algorithms and visualization
- **Matplotlib** - Static graph plotting
- **Tkinter** - Desktop maze visualization

## 📊 Performance Analysis

### Pathfinding Algorithms Comparison
| Algorithm | Time Complexity | Space Complexity | Optimal Path | Use Case |
|-----------|----------------|------------------|--------------|----------|
| DFS | O(V + E) | O(V) | ❌ | Memory efficient exploration |
| BFS | O(V + E) | O(V) | ✅ | Shortest path guarantee |
| A* | O(V log V) | O(V) | ✅ | Heuristic-guided optimal search |

### Graph Coloring Results
- **Arc Consistency**: Reduces search space by 60-80%
- **DFS Backtracking**: Guarantees solution if one exists
- **Combined approach**: Optimal performance for constraint satisfaction

## 🎮 Interactive Demos

### Web Interface
Run the Flask application for an interactive experience:
```bash
python app.py
```
Then visit `http://localhost:5000` in your browser.

### Command Line Interface
For traditional terminal-based execution:

```bash
# Pathfinding algorithms
python task1.py --bfs    # Breadth-First Search
python task1.py --dfs    # Depth-First Search  
python task1.py --astar  # A* Search

# Graph coloring algorithms
python task2.py --arc    # Arc Consistency
python task2.py --dfs    # DFS Backtracking
python task2.py --graph  # Display graph

# Game theory
python task3.py          # Interactive Tic-Tac-Toe
```

## 📈 Key Learning Outcomes

### Algorithm Design
- **Systematic problem decomposition** for complex AI challenges
- **Trade-off analysis** between time, space, and optimality
- **Heuristic design** for informed search strategies

### Implementation Skills
- **Clean, maintainable code** with comprehensive documentation
- **Performance optimization** through algorithmic improvements
- **Visual debugging** and real-time algorithm analysis

### Problem-Solving Approach
- **Constraint satisfaction** techniques for complex problems
- **Game theory principles** for strategic decision making
- **Search space exploration** strategies

## 🎯 Resume-Ready Highlights

### Technical Skills Demonstrated
- **Algorithm Implementation**: DFS, BFS, A*, Minimax, Arc Consistency
- **Data Structures**: Stacks, Queues, Priority Queues, Graphs
- **Optimization Techniques**: Alpha-Beta pruning, Heuristic functions
- **Visualization**: Real-time algorithm animation and performance metrics

### Soft Skills Showcased
- **Problem Decomposition**: Breaking complex AI problems into manageable components
- **Performance Analysis**: Understanding and optimizing algorithmic complexity
- **User Experience**: Creating intuitive interfaces for complex algorithms
- **Documentation**: Professional-grade project documentation

## 🔧 Installation & Setup

### Prerequisites
```bash
pip install -r requirements.txt
```

### Quick Start
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run web interface: `python app.py`
4. Open browser to `http://localhost:5000`

## 📝 Usage Examples

### Pathfinding Demo
```python
# Compare algorithms on the same maze
start = (20, 20)
goal = (1, 1)

# BFS - guaranteed shortest path
explored_bfs, path_bfs = BFS(maze, start, goal)

# A* - heuristic-guided optimal search  
explored_astar, path_astar = AStar(maze, start, goal)

# Performance comparison
print(f"BFS explored {len(explored_bfs)} nodes")
print(f"A* explored {len(explored_astar)} nodes")
```

### Graph Coloring Demo
```python
# Solve European map coloring problem
solution = arc_consistency(G, domain)
print("Optimal color assignment:", solution)

# Visualize the solution
nx.draw(G, pos, node_color=[solution[node] for node in G.nodes()])
plt.show()
```

## 🎓 Educational Value

This project demonstrates mastery of:
- **Search Algorithms**: Systematic exploration strategies
- **Optimization**: Performance improvements through pruning and heuristics
- **Constraint Satisfaction**: Problem-solving with multiple constraints
- **Game Theory**: Strategic decision-making in competitive environments

Perfect for showcasing algorithmic thinking and problem-solving skills to potential employers!

## 📄 License

This project is created for educational purposes and portfolio demonstration. 