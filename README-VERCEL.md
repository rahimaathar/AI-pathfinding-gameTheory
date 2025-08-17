# Algorithm Visualizer - Vercel Deployment

A web application for visualizing fundamental algorithms including pathfinding, graph coloring, and game theory.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/algorithm-visualizer)

## 📋 What's Included

- **Pathfinding Algorithms**: DFS, BFS, A* with interactive maze visualization
- **Graph Coloring**: Arc consistency and DFS backtracking algorithms
- **Game Theory**: Tic-Tac-Toe with minimax AI
- **Modern UI**: Responsive design with beautiful animations

## 🛠️ Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/algorithm-visualizer.git
   cd algorithm-visualizer
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run locally** (optional):
   ```bash
   python app.py
   ```

## 🌐 Deployment

### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Deploy automatically

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 📁 Project Structure

```
├── api/
│   └── algorithm.py          # Serverless functions
├── public/
│   ├── index.html           # Main page
│   └── pathfinding.html     # Pathfinding demo
├── vercel.json              # Vercel configuration
├── requirements.txt         # Python dependencies
├── task1.py                 # Pathfinding algorithms
├── task2.py                 # Graph coloring algorithms
├── task3.py                 # Game theory algorithms
└── maze_config.csv          # Maze configuration
```

## 🔧 Configuration

The app is pre-configured for Vercel with:

- **Static hosting** for frontend files
- **Serverless functions** for algorithm execution
- **CORS headers** for cross-origin requests
- **Automatic routing** between static and API endpoints

## 🎯 Features

### Pathfinding
- Interactive 20x20 maze visualization
- Real-time algorithm execution
- Performance metrics comparison
- Visual exploration and path highlighting

### Graph Coloring
- European country map coloring
- Constraint satisfaction algorithms
- Interactive color assignment
- Solution validation

### Game Theory
- Tic-Tac-Toe with AI opponent
- Minimax algorithm implementation
- Game state visualization
- Win/loss analysis

## 🔍 API Endpoints

- `POST /api/pathfinding` - Run pathfinding algorithms
- `POST /api/graph-coloring` - Solve graph coloring problems
- `POST /api/tictactoe` - Play Tic-Tac-Toe

## 🚨 Limitations

- **Function timeout**: 10 seconds (Vercel free tier)
- **Memory limits**: 1024MB per function
- **Cold starts**: First request may be slower
- **File system**: Read-only in production

## 🛠️ Troubleshooting

### Common Issues

1. **Import errors**: Check `requirements.txt` includes all dependencies
2. **Timeout errors**: Optimize algorithms for smaller datasets
3. **CORS errors**: Headers are pre-configured, check browser console

### Performance Tips

- Use smaller maze sizes for web deployment
- Implement early termination in algorithms
- Cache results when possible
- Optimize data structures

## 📈 Monitoring

After deployment, monitor:
- Function execution times
- Error rates
- Memory usage
- Cold start frequency

## 🔄 Updates

Push to your Git repository to automatically redeploy:
```bash
git add .
git commit -m "Update algorithm visualizer"
git push
```

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Python Runtime](https://vercel.com/docs/runtimes#official-runtimes/python)
- [Serverless Functions](https://vercel.com/docs/functions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
