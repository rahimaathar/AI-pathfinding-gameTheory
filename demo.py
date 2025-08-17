#!/usr/bin/env python3
"""
AI Pathfinding & Game Theory Algorithms Demo
============================================

This script demonstrates both the original terminal-based algorithms
and the new web interface for showcasing the AI algorithms.

Usage:
    python demo.py --web          # Start the web interface
    python demo.py --terminal     # Run terminal demos
    python demo.py --help         # Show this help message
"""

import argparse
import subprocess
import sys
import time
import os

def run_web_demo():
    """Start the Flask web application"""
    print("🚀 Starting AI Algorithms Web Demo...")
    print("📱 Open your browser to: http://localhost:8080")
    print("🔄 Press Ctrl+C to stop the server")
    print()
    
    try:
        # Check if Flask is installed
        import flask
        print("✅ Flask is installed")
    except ImportError:
        print("❌ Flask not found. Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Start the Flask app
    subprocess.run([sys.executable, "app.py"])

def run_terminal_demo():
    """Run the original terminal-based algorithms"""
    print("🖥️  Running Terminal-Based AI Algorithms Demo")
    print("=" * 50)
    
    # Test pathfinding algorithms
    print("\n1️⃣  Testing Pathfinding Algorithms")
    print("-" * 30)
    
    algorithms = [
        ("DFS (Depth-First Search)", "python task1.py --dfs"),
        ("BFS (Breadth-First Search)", "python task1.py --bfs"),
        ("A* Search", "python task1.py --astar")
    ]
    
    for name, command in algorithms:
        print(f"\n🔍 Running {name}...")
        try:
            result = subprocess.run(command.split(), capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                print(f"✅ {name} completed successfully")
            else:
                print(f"❌ {name} failed: {result.stderr}")
        except subprocess.TimeoutExpired:
            print(f"⏰ {name} timed out")
        except Exception as e:
            print(f"❌ {name} error: {e}")
    
    # Test graph coloring algorithms
    print("\n2️⃣  Testing Graph Coloring Algorithms")
    print("-" * 35)
    
    graph_algorithms = [
        ("Arc Consistency", "python task2.py --arc"),
        ("DFS Backtracking", "python task2.py --dfs"),
        ("Graph Display", "python task2.py --graph")
    ]
    
    for name, command in graph_algorithms:
        print(f"\n🎨 Running {name}...")
        try:
            result = subprocess.run(command.split(), capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                print(f"✅ {name} completed successfully")
            else:
                print(f"❌ {name} failed: {result.stderr}")
        except subprocess.TimeoutExpired:
            print(f"⏰ {name} timed out")
        except Exception as e:
            print(f"❌ {name} error: {e}")
    
    # Test game theory
    print("\n3️⃣  Testing Game Theory (Tic-Tac-Toe)")
    print("-" * 35)
    print("🎮 Starting interactive Tic-Tac-Toe game...")
    print("💡 The AI uses Minimax with Alpha-Beta pruning")
    print("🎯 Try to beat the unbeatable AI!")
    print("📝 Enter numbers 1-9 to make your moves")
    print("🔄 Press Ctrl+C to exit the game")
    print()
    
    try:
        subprocess.run(["python", "task3.py"])
    except KeyboardInterrupt:
        print("\n👋 Game ended by user")
    except Exception as e:
        print(f"❌ Game error: {e}")

def show_project_info():
    """Display project information"""
    print("🎯 AI Pathfinding & Game Theory Algorithms")
    print("=" * 50)
    print()
    print("📚 This project demonstrates three fundamental AI algorithms:")
    print()
    print("1. 🔍 Pathfinding Algorithms")
    print("   • Depth-First Search (DFS)")
    print("   • Breadth-First Search (BFS)")
    print("   • A* Search with Euclidean Heuristic")
    print()
    print("2. 🎨 Graph Coloring Algorithms")
    print("   • Arc Consistency")
    print("   • DFS Backtracking")
    print("   • European Map Coloring Problem")
    print()
    print("3. 🎮 Game Theory")
    print("   • Minimax Algorithm")
    print("   • Alpha-Beta Pruning")
    print("   • Unbeatable Tic-Tac-Toe AI")
    print()
    print("🚀 Features:")
    print("   • Interactive web interface")
    print("   • Real-time algorithm visualization")
    print("   • Performance comparison tools")
    print("   • Professional documentation")
    print()
    print("💼 Perfect for showcasing to employers!")
    print()

def main():
    parser = argparse.ArgumentParser(
        description="AI Pathfinding & Game Theory Algorithms Demo",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python demo.py --web          # Start web interface
  python demo.py --terminal     # Run terminal demos
  python demo.py --info         # Show project info
        """
    )
    
    parser.add_argument(
        "--web", 
        action="store_true", 
        help="Start the Flask web interface"
    )
    
    parser.add_argument(
        "--terminal", 
        action="store_true", 
        help="Run the original terminal-based algorithms"
    )
    
    parser.add_argument(
        "--info", 
        action="store_true", 
        help="Show project information"
    )
    
    args = parser.parse_args()
    
    if args.info:
        show_project_info()
    elif args.web:
        run_web_demo()
    elif args.terminal:
        run_terminal_demo()
    else:
        show_project_info()
        print("💡 Use --help to see available options")
        print("🌐 Try --web for the interactive interface")
        print("🖥️  Try --terminal for command-line demos")

if __name__ == "__main__":
    main() 