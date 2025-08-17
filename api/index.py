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
from http.server import BaseHTTPRequestHandler
import urllib.parse

# Import our existing algorithms
from task1 import DFS, BFS, AStar, heuristic
from task2 import arc_consistency, dfs_backtracking
from task3 import minimax, computer_move, winner

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

def render_template(template_name, **kwargs):
    """Simple template renderer for Vercel"""
    if template_name == 'index.html':
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Algorithm Visualizer</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                .card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
                a { color: #007bff; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Algorithm Visualizer</h1>
                <div class="card">
                    <h2><a href="/pathfinding">Pathfinding Algorithms</a></h2>
                    <p>Visualize DFS, BFS, and A* algorithms on a maze.</p>
                </div>
                <div class="card">
                    <h2><a href="/graph_coloring">Graph Coloring</a></h2>
                    <p>Solve graph coloring problems using constraint satisfaction.</p>
                </div>
                <div class="card">
                    <h2><a href="/game_theory">Game Theory</a></h2>
                    <p>Play Tic-Tac-Toe against an AI using minimax algorithm.</p>
                </div>
            </div>
        </body>
        </html>
        '''
    return f"<h1>{template_name}</h1>"

def jsonify(data):
    """Simple JSON response for Vercel"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(data)
    }

def html_response(html_content):
    """Simple HTML response for Vercel"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        },
        'body': html_content
    }

def handle_algorithm_request(data):
    """Handle algorithm execution requests"""
    algorithm = data.get('algorithm')
    start = tuple(data.get('start', [20, 20]))
    goal = tuple(data.get('goal', [1, 1]))
    
    global maze_data
    if maze_data is None:
        maze_data = WebMaze()
    
    if algorithm == 'dfs':
        explored, path = DFS(maze_data, start, goal)
    elif algorithm == 'bfs':
        explored, path = BFS(maze_data, start, goal)
    elif algorithm == 'astar':
        explored, path = AStar(maze_data, start, goal)
    else:
        return jsonify({'error': 'Invalid algorithm'})
    
    explored_list = [[pos[0], pos[1]] for pos in explored]
    path_list = [[pos[0], pos[1]] for pos in path]
    
    return jsonify({
        'explored': explored_list,
        'path': path_list,
        'explored_count': len(explored),
        'path_length': len(path),
        'algorithm': algorithm
    })

def handle_graph_coloring_request(data):
    """Handle graph coloring requests"""
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
    
    nodes = list(graph_data.G.nodes())
    edges = list(graph_data.G.edges())
    colors = [solution.get(node, 'gray') for node in nodes]
    
    return jsonify({
        'nodes': nodes,
        'edges': edges,
        'colors': colors,
        'solution': solution
    })

def handle_tictactoe_request(data):
    """Handle Tic-Tac-Toe game requests"""
    board = data.get('board')
    player_move = data.get('player_move')
    
    if player_move is not None:
        if board[player_move] == "-":
            board[player_move] = "X"
    
    game_result = winner(board)
    if game_result:
        return jsonify({
            'board': board,
            'game_over': True,
            'winner': game_result
        })
    
    if "-" in board:
        computer_move_index = computer_move(board)
        if computer_move_index != -1:
            board[computer_move_index] = "O"
    
    game_result = winner(board)
    
    return jsonify({
        'board': board,
        'game_over': game_result is not None,
        'winner': game_result
    })

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        path = self.path.split('?')[0]
        
        if path == '/':
            html = render_template('index.html')
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        elif path == '/pathfinding':
            html = render_template('pathfinding.html')
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        elif path == '/graph_coloring':
            html = render_template('graph_coloring.html')
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        elif path == '/game_theory':
            html = render_template('game_theory.html')
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

    def do_POST(self):
        """Handle POST requests"""
        path = self.path.split('?')[0]
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            data = {}
        
        if path == '/api/run_algorithm':
            response = handle_algorithm_request(data)
        elif path == '/api/run_graph_coloring':
            response = handle_graph_coloring_request(data)
        elif path == '/api/play_tictactoe':
            response = handle_tictactoe_request(data)
        else:
            response = jsonify({'error': 'Invalid endpoint'})
        
        self.send_response(response['statusCode'])
        for header, value in response['headers'].items():
            self.send_header(header, value)
        self.end_headers()
        self.wfile.write(response['body'].encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
