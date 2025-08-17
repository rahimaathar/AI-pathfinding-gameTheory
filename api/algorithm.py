from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import time
import random
from queue import PriorityQueue
import math
import networkx as nx
import io
import base64

# Create tkinter-free versions of the algorithms
def DFS(maze, start, goal):
    """Depth-First Search implementation without tkinter dependencies"""
    visited_positions = []
    path_to_goal = []
    
    frontiers = [start]
    order = ['E', 'S', 'W', 'N']
    visited_positions.append(start)
    pathtoreverse = {}

    while len(frontiers) != 0:
        currentNode = frontiers.pop()
        if currentNode == goal:
            break
        for direction in order:
            if currentNode in maze.maze_map and maze.maze_map[currentNode][direction] == True:
                x, y = currentNode
                if direction == 'E':
                    childNode = (x, y+1)
                elif direction == 'S':
                    childNode = (x+1, y)
                elif direction == 'W':
                    childNode = (x, y-1)
                elif direction == 'N':
                    childNode = (x-1, y)
                
                # Check if childNode is within bounds and exists in maze
                if (1 <= childNode[0] <= maze.rows and 
                    1 <= childNode[1] <= maze.cols and 
                    childNode in maze.maze_map and
                    childNode not in visited_positions):
                    visited_positions.append(childNode)
                    frontiers.append(childNode)
                    pathtoreverse[childNode] = currentNode

    path_to_goal = [goal]
    tempnode = goal

    while tempnode != start:
        tempnode = pathtoreverse[tempnode]
        path_to_goal.append(tempnode)

    path_to_goal.reverse()
    return visited_positions, path_to_goal

def BFS(maze, start, goal):
    """Breadth-First Search implementation without tkinter dependencies"""
    visited_positions = []
    path_to_goal = []
    
    frontiers = [start]
    order = ['E', 'S', 'W', 'N']
    visited_positions.append(start)
    pathtoreverse = {}

    while len(frontiers) != 0:
        currentNode = frontiers.pop(0)  # Use pop(0) for queue behavior
        if currentNode == goal:
            break
        for direction in order:
            if currentNode in maze.maze_map and maze.maze_map[currentNode][direction] == True:
                x, y = currentNode
                if direction == 'E':
                    childNode = (x, y+1)
                elif direction == 'S':
                    childNode = (x+1, y)
                elif direction == 'W':
                    childNode = (x, y-1)
                elif direction == 'N':
                    childNode = (x-1, y)
                
                # Check if childNode is within bounds and exists in maze
                if (1 <= childNode[0] <= maze.rows and 
                    1 <= childNode[1] <= maze.cols and 
                    childNode in maze.maze_map and
                    childNode not in visited_positions):
                    visited_positions.append(childNode)
                    frontiers.append(childNode)
                    pathtoreverse[childNode] = currentNode

    path_to_goal = [goal]
    tempnode = goal

    while tempnode != start:
        tempnode = pathtoreverse[tempnode]
        path_to_goal.append(tempnode)

    path_to_goal.reverse()
    return visited_positions, path_to_goal

def heuristic(a, b):
    """Manhattan distance heuristic"""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def AStar(maze, start, goal):
    """A* Search implementation without tkinter dependencies"""
    visited_positions = []
    path_to_goal = []
    
    frontiers = PriorityQueue()
    frontiers.put((0, start))
    came_from = {}
    cost_so_far = {}
    came_from[start] = None
    cost_so_far[start] = 0
    visited_positions.append(start)

    while not frontiers.empty():
        current = frontiers.get()[1]
        
        if current == goal:
            break
            
        for direction in ['E', 'S', 'W', 'N']:
            if current in maze.maze_map and maze.maze_map[current][direction] == True:
                x, y = current
                if direction == 'E':
                    next_node = (x, y+1)
                elif direction == 'S':
                    next_node = (x+1, y)
                elif direction == 'W':
                    next_node = (x, y-1)
                elif direction == 'N':
                    next_node = (x-1, y)
                
                # Check if next_node is within bounds and exists in maze
                if (1 <= next_node[0] <= maze.rows and 
                    1 <= next_node[1] <= maze.cols and 
                    next_node in maze.maze_map):
                    
                    new_cost = cost_so_far[current] + 1
                    
                    if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                        cost_so_far[next_node] = new_cost
                        priority = new_cost + heuristic(next_node, goal)
                        frontiers.put((priority, next_node))
                        came_from[next_node] = current
                        if next_node not in visited_positions:
                            visited_positions.append(next_node)

    # Reconstruct path
    current = goal
    while current is not None:
        path_to_goal.append(current)
        current = came_from.get(current)
    path_to_goal.reverse()
    
    return visited_positions, path_to_goal

# Graph coloring algorithms (simplified versions)
def arc_consistency(graph, domain):
    """Arc consistency algorithm for graph coloring"""
    # Simplified implementation
    solution = {}
    for node in graph.nodes():
        if len(domain[node]) == 1:
            solution[node] = domain[node][0]
    
    # Simple greedy coloring for remaining nodes
    for node in graph.nodes():
        if node not in solution:
            used_colors = set()
            for neighbor in graph.neighbors(node):
                if neighbor in solution:
                    used_colors.add(solution[neighbor])
            
            for color in domain[node]:
                if color not in used_colors:
                    solution[node] = color
                    break
            else:
                solution[node] = domain[node][0] if domain[node] else 'gray'
    
    return solution

def dfs_backtracking(graph, domain):
    """DFS backtracking for graph coloring"""
    def is_valid_assignment(node, color, assignment):
        for neighbor in graph.neighbors(node):
            if neighbor in assignment and assignment[neighbor] == color:
                return False
        return True
    
    def backtrack(assignment):
        if len(assignment) == len(graph.nodes()):
            return assignment
        
        unassigned = [node for node in graph.nodes() if node not in assignment]
        if not unassigned:
            return assignment
        
        node = unassigned[0]
        for color in domain[node]:
            if is_valid_assignment(node, color, assignment):
                assignment[node] = color
                result = backtrack(assignment)
                if result:
                    return result
                del assignment[node]
        
        return None
    
    return backtrack({}) or {}

# Game theory algorithms
def winner(board):
    """Check for winner in Tic-Tac-Toe"""
    lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]  # diagonals
    ]
    
    for line in lines:
        if board[line[0]] == board[line[1]] == board[line[2]] != "-":
            return board[line[0]]
    
    if "-" not in board:
        return "tie"
    return None

def minimax(board, depth, is_maximizing):
    """Minimax algorithm for Tic-Tac-Toe"""
    result = winner(board)
    
    if result == "X":
        return -1
    elif result == "O":
        return 1
    elif result == "tie":
        return 0
    
    if is_maximizing:
        best_score = float('-inf')
        for i in range(9):
            if board[i] == "-":
                board[i] = "O"
                score = minimax(board, depth + 1, False)
                board[i] = "-"
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(9):
            if board[i] == "-":
                board[i] = "X"
                score = minimax(board, depth + 1, True)
                board[i] = "-"
                best_score = min(score, best_score)
        return best_score

def computer_move(board):
    """Find best move for computer using minimax"""
    best_score = float('-inf')
    best_move = -1
    
    for i in range(9):
        if board[i] == "-":
            board[i] = "O"
            score = minimax(board, 0, False)
            board[i] = "-"
            if score > best_score:
                best_score = score
                best_move = i
    
    return best_move

class WebMaze:
    """Simplified maze class for web visualization without tkinter"""
    def __init__(self, rows=20, cols=20):
        self.rows = rows
        self.cols = cols
        self.maze_map = {}
        self._load_maze()
    
    def _load_maze(self):
        """Load maze from CSV file or create random maze"""
        try:
            # Create a simple maze with all cells connected
            for i in range(1, self.rows + 1):
                for j in range(1, self.cols + 1):
                    self.maze_map[(i, j)] = {
                        'E': j < self.cols,  # Can go east if not at right edge
                        'W': j > 1,         # Can go west if not at left edge
                        'N': i > 1,         # Can go north if not at top edge
                        'S': i < self.rows  # Can go south if not at bottom edge
                    }
            
            pass  # Use the simple maze created above
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

def run_pathfinding_algorithm(algorithm, start, goal):
    """Run pathfinding algorithm"""
    maze = WebMaze()
    
    if algorithm == 'dfs':
        explored, path = DFS(maze, start, goal)
    elif algorithm == 'bfs':
        explored, path = BFS(maze, start, goal)
    elif algorithm == 'astar':
        explored, path = AStar(maze, start, goal)
    else:
        return {'error': 'Invalid algorithm'}
    
    explored_list = [[pos[0], pos[1]] for pos in explored]
    path_list = [[pos[0], pos[1]] for pos in path]
    
    return {
        'explored': explored_list,
        'path': path_list,
        'explored_count': len(explored),
        'path_length': len(path),
        'algorithm': algorithm
    }

def run_graph_coloring(algorithm):
    """Run graph coloring algorithm"""
    graph = WebGraph()
    
    if algorithm == 'arc':
        solution = arc_consistency(graph.G, graph.domain.copy())
    elif algorithm == 'dfs':
        solution = dfs_backtracking(graph.G, graph.domain.copy())
    else:
        return {'error': 'Invalid algorithm'}
    
    nodes = list(graph.G.nodes())
    edges = list(graph.G.edges())
    colors = [solution.get(node, 'gray') for node in nodes]
    
    return {
        'nodes': nodes,
        'edges': edges,
        'colors': colors,
        'solution': solution
    }

def play_tictactoe(board, player_move):
    """Play Tic-Tac-Toe game"""
    if player_move is not None:
        if board[player_move] == "-":
            board[player_move] = "X"
    
    game_result = winner(board)
    if game_result:
        return {
            'board': board,
            'game_over': True,
            'winner': game_result
        }
    
    if "-" in board:
        computer_move_index = computer_move(board)
        if computer_move_index != -1:
            board[computer_move_index] = "O"
    
    game_result = winner(board)
    
    return {
        'board': board,
        'game_over': game_result is not None,
        'winner': game_result
    }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for algorithm execution"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            data = {}
        
        # Determine which algorithm to run based on the endpoint
        path = self.path.split('?')[0]
        
        if 'pathfinding' in path:
            algorithm = data.get('algorithm', 'dfs')
            start = tuple(data.get('start', [20, 20]))
            goal = tuple(data.get('goal', [1, 1]))
            result = run_pathfinding_algorithm(algorithm, start, goal)
        elif 'graph_coloring' in path:
            algorithm = data.get('algorithm', 'arc')
            result = run_graph_coloring(algorithm)
        elif 'tictactoe' in path:
            board = data.get('board', ['-'] * 9)
            player_move = data.get('player_move')
            result = play_tictactoe(board, player_move)
        else:
            result = {'error': 'Invalid endpoint'}
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
