from flask import Flask, render_template, request, jsonify
import json
import sys
import os
import time
import random
from queue import PriorityQueue
import math
import networkx as nx
import matplotlib.pyplot as plt
import io
import base64

# Import our existing algorithms
from task1 import DFS, BFS, AStar, heuristic
from task2 import arc_consistency, dfs_backtracking
from task3 import minimax, computer_move, winner

app = Flask(__name__)

# Global variables for maze and graph
maze_data = None
graph_data = None

class WebMaze:
    """Simplified maze class for web visualization"""
    def __init__(self, rows=20, cols=20):
        self.rows = rows
        self.cols = cols
        self.maze_map = {}
        self._load_maze()
    
    def _load_maze(self):
        """Load maze from CSV file"""
        try:
            with open('maze_config.csv', 'r') as f:
                import csv
                reader = csv.reader(f)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 5:
                        coords = row[0].strip('()').split(',')
                        x, y = int(coords[0]), int(coords[1])
                        self.maze_map[(x, y)] = {
                            'E': int(row[1]) == 1,
                            'W': int(row[2]) == 1,
                            'N': int(row[3]) == 1,
                            'S': int(row[4]) == 1
                        }
        except:
            # Create a simple maze if file not found
            for i in range(1, self.rows + 1):
                for j in range(1, self.cols + 1):
                    self.maze_map[(i, j)] = {
                        'E': random.choice([True, False]),
                        'W': random.choice([True, False]),
                        'N': random.choice([True, False]),
                        'S': random.choice([True, False])
                    }

class WebGraph:
    """Graph class for web visualization"""
    def __init__(self):
        self.edges = [
            ("PL", "GE"), ("PL", "CZ"), ("GE", "CZ"), ("CZ", "AU"),
            ("CZ", "SK"), ("AU", "SK"), ("SK", "HU"), ("AU", "HU"),
            ("AU", "SL"), ("HU", "SL"), ("SL", "CR"), ("HU", "CR"),
            ("CR", "BH"), ("HU", "SE"), ("HU", "RO"), ("SE", "RO"),
            ("BH", "SE"), ("CR", "SE"), ("RO", "BG"), ("BG", "GR")
        ]
        self.G = nx.Graph()
        self.G.add_edges_from(self.edges)
        self.colors = ["red", "green", "blue"]
        self.domain = {node: self.colors for node in self.G.nodes()}
        self.domain["PL"] = ["red"]
        self.domain["GR"] = ["green"]
        self.domain["SL"] = ["red"]
        self.domain["HU"] = ["green"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pathfinding')
def pathfinding():
    return render_template('pathfinding.html')

@app.route('/graph_coloring')
def graph_coloring():
    return render_template('graph_coloring.html')

@app.route('/game_theory')
def game_theory():
    return render_template('game_theory.html')

@app.route('/api/run_algorithm', methods=['POST'])
def run_algorithm():
    data = request.get_json()
    algorithm = data.get('algorithm')
    start = tuple(data.get('start', [20, 20]))
    goal = tuple(data.get('goal', [1, 1]))
    
    # Initialize maze
    global maze_data
    if maze_data is None:
        maze_data = WebMaze()
    
    # Run selected algorithm
    if algorithm == 'dfs':
        explored, path = DFS(maze_data, start, goal)
    elif algorithm == 'bfs':
        explored, path = BFS(maze_data, start, goal)
    elif algorithm == 'astar':
        explored, path = AStar(maze_data, start, goal)
    else:
        return jsonify({'error': 'Invalid algorithm'})
    
    # Convert to list format for JSON
    explored_list = [[pos[0], pos[1]] for pos in explored]
    path_list = [[pos[0], pos[1]] for pos in path]
    
    return jsonify({
        'explored': explored_list,
        'path': path_list,
        'explored_count': len(explored),
        'path_length': len(path),
        'algorithm': algorithm
    })

@app.route('/api/run_graph_coloring', methods=['POST'])
def run_graph_coloring():
    data = request.get_json()
    algorithm = data.get('algorithm')
    
    global graph_data
    if graph_data is None:
        graph_data = WebGraph()
    
    if algorithm == 'arc':
        solution = arc_consistency(graph_data.G, graph_data.domain.copy())
    elif algorithm == 'dfs':
        solution = dfs_backtracking(graph_data.G, graph_data.domain.copy())
    else:
        return jsonify({'error': 'Invalid algorithm'})
    
    # Convert solution to web-friendly format
    nodes = list(graph_data.G.nodes())
    edges = list(graph_data.G.edges())
    colors = [solution.get(node, 'gray') for node in nodes]
    
    return jsonify({
        'nodes': nodes,
        'edges': edges,
        'colors': colors,
        'solution': solution
    })

@app.route('/api/play_tictactoe', methods=['POST'])
def play_tictactoe():
    data = request.get_json()
    board = data.get('board')
    player_move = data.get('player_move')
    
    if player_move is not None:
        # Player's move
        if board[player_move] == "-":
            board[player_move] = "X"
    
    # Check if game is over
    game_result = winner(board)
    if game_result:
        return jsonify({
            'board': board,
            'game_over': True,
            'winner': game_result
        })
    
    # Computer's move
    if "-" in board:
        computer_move_index = computer_move(board)
        if computer_move_index != -1:
            board[computer_move_index] = "O"
    
    # Check again after computer's move
    game_result = winner(board)
    
    return jsonify({
        'board': board,
        'game_over': game_result is not None,
        'winner': game_result
    })

@app.route('/api/performance_comparison')
def performance_comparison():
    """Compare performance of all pathfinding algorithms"""
    global maze_data
    if maze_data is None:
        maze_data = WebMaze()
    
    start = (20, 20)
    goal = (1, 1)
    
    results = {}
    
    # Test each algorithm
    for algorithm, func in [('DFS', DFS), ('BFS', BFS), ('A*', AStar)]:
        start_time = time.time()
        explored, path = func(maze_data, start, goal)
        end_time = time.time()
        
        results[algorithm] = {
            'explored_count': len(explored),
            'path_length': len(path),
            'execution_time': round(end_time - start_time, 4),
            'optimal': algorithm in ['BFS', 'A*']
        }
    
    return jsonify(results)

if __name__ == '__main__':
    # Get port from environment variable (for deployment) or use 8080 for local development
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=False, host='0.0.0.0', port=port) 