# Deploying to Vercel

This guide will help you deploy your Algorithm Visualizer to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Vercel CLI** (optional): `npm i -g vercel`

## Deployment Options

### Option 1: Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `./` (default)
   - Build Command: Leave empty (Vercel will auto-detect)
   - Output Directory: Leave empty

3. **Environment Variables** (if needed):
   - Add any environment variables in the project settings

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your project

### Option 2: Vercel CLI

1. **Install CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow prompts**:
   - Link to existing project or create new
   - Confirm settings
   - Deploy

## Project Structure

Your project is configured with:

```
├── api/
│   └── algorithm.py          # Serverless functions
├── public/
│   └── index.html           # Static frontend
├── vercel.json              # Vercel configuration
├── requirements.txt         # Python dependencies
└── [other algorithm files]
```

## API Endpoints

After deployment, your API will be available at:

- **Pathfinding**: `https://your-domain.vercel.app/api/pathfinding`
- **Graph Coloring**: `https://your-domain.vercel.app/api/graph-coloring`
- **Tic-Tac-Toe**: `https://your-domain.vercel.app/api/tictactoe`

## Troubleshooting

### Common Issues

1. **Import Errors**:
   - Ensure all dependencies are in `requirements.txt`
   - Check that file paths are correct

2. **Function Timeout**:
   - Vercel has a 10-second timeout for free tier
   - Consider optimizing algorithms for larger datasets

3. **CORS Issues**:
   - CORS headers are already configured in the API
   - Check browser console for errors

### Performance Optimization

1. **Reduce Dependencies**:
   - Remove unused imports
   - Consider lighter alternatives to heavy libraries

2. **Optimize Algorithms**:
   - Add early termination conditions
   - Limit maze/graph sizes for web deployment

3. **Caching**:
   - Implement result caching for repeated requests
   - Use Vercel's edge caching where possible

## Alternative Hosting Options

If Vercel doesn't meet your needs, consider:

### 1. Railway
- **Pros**: Great Python support, easy deployment
- **Cons**: Limited free tier

### 2. Render
- **Pros**: Excellent Flask support, generous free tier
- **Cons**: Slower cold starts

### 3. Heroku
- **Pros**: Classic choice, good documentation
- **Cons**: No free tier anymore

### 4. PythonAnywhere
- **Pros**: Python-focused, easy setup
- **Cons**: Limited features

## Monitoring

After deployment:

1. **Check Logs**: Monitor function execution in Vercel dashboard
2. **Performance**: Use Vercel Analytics to track usage
3. **Errors**: Set up error monitoring if needed

## Updates

To update your deployment:

1. **Push Changes**: Commit and push to your Git repository
2. **Auto-Deploy**: Vercel will automatically redeploy
3. **Manual Deploy**: Use `vercel --prod` for manual deployment

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Python Runtime](https://vercel.com/docs/runtimes#official-runtimes/python)
- [Serverless Functions](https://vercel.com/docs/functions)
