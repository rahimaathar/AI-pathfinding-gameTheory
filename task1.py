# Importing modules and libraries
from maze_visual import maze, agent
import sys
import argparse
# Import any other modules you want to use here
import math
from queue import PriorityQueue


# DO NOT CHANGE THESE LINES OF CODE
# ----------------------------------
ROWS = 20 # Number of rows in the maze
COLS = 20 # Number of columns in the maze
m = maze(ROWS, COLS) # Initialize the maze

# Load the maze from the csv file. You may need to change this path depending on where you save the files.
# m.LoadMaze(loadMaze='maze_config.csv', theme="dark") //
# m.LoadMaze(loadMaze='C:\Users\emwal\Downloads\PA1 (4)\maze_config.csv', theme="dark")
m.LoadMaze(loadMaze='maze_config.csv', theme="dark")
# ----------------------------------

def DFS(maze, start, goal):
    '''
    This function should implement the Depth First Search algorithm.
    The inputs to this function are:
        maze: The maze object
        start: The start position of the agent as a tuple (x,y)
        goal: The goal position of the agent as a tuple (x,y)
    The function should return:
        a list containing all the positions visited by the search algorithm
        a list containing the positions in the final path from the start to the goal
    '''

    visited_positions = []
    path_to_goal = []
    

    # TODO: Implement Depth-First Search (DFS) algorithm here
    # NOTE: Think sbout what direction you should explore first in the event of multiple options. For the purpose of this assignment, the start 
    #       position is always bottom right and the goal is always top left. Also think about what gets popped first using either stack or recursion.
    
    frontiers=[start] #child node
    order=['E','S','W','N']            #order is opposite to pritority because of LIFO nature of stack
    visited_positions.append(start)    #adding the start node to visited & frontiers list
    pathtoreverse={}

    while(len(frontiers)!=0):        #if the frontiers list is not empty
        currentNode=frontiers.pop()  #popping the last element in the frontiers list
        if currentNode==goal:        #if the goal is found, then break
            break
        for direction in order:
            if maze.maze_map[currentNode][direction]==True:
                x, y = currentNode  # x=1st coordinate, y=2nd coordinate
                if direction == 'E':            #traversing in the order opposite to that of priority
                    childNode = (x, y+1)
                elif direction == 'S':
                    childNode = (x+1, y)
                elif direction == 'W':
                    childNode = (x, y-1)
                elif direction == 'N':
                    childNode = (x-1, y)
                if childNode not in visited_positions:
                    visited_positions.append(childNode)
                    frontiers.append(childNode)
                    pathtoreverse[childNode]=currentNode

                    
    path_to_goal = [goal]   
    tempnode = goal

    while tempnode != start:               # the loop continues to run until the start node hasnt reached
        tempnode = pathtoreverse[tempnode] #tempnode= descendant retrieved from the pathtoreverse dictionary
        path_to_goal.append(tempnode)      #append the descendant to the list

    path_to_goal.reverse()                #reverse the list to start from the 'start' node
    # print(path_to_goal)

    # print(visited_positions)
    # from pprint import pprint
    # print(maze.maze_map)

    return visited_positions, path_to_goal




def BFS(maze, start, goal):
    '''
    This function should implement the Breadth First Search algorithm.
    The inputs to this function are:
        maze: The maze object
        start: The start position of the agent as a tuple (x,y)
        goal: The goal position of the agent as a tuple (x,y)
    The function should return:
        a list containing all the positions visited by the search algorithm
        a list containing the positions in the final path from the start to the goal
    '''

    visited_positions = []
    path_to_goal = []

    # TODO: Implement Breadth-First Search (BFS) algorithm here

    frontiers=[start] #child node
    order=['N','W','S','E']     #order is equal to pritority because of FIFO nature of queue
    visited_positions.append(start)    #adding the start node to visited & frontiers list
    pathtoreverse={}

    while(len(frontiers)!=0):        #if the frontiers list is not empty
        currentNode=frontiers.pop(0)  #popping the first element in the frontiers list
        if currentNode==goal:        #if the goal is found, then break
            break
        for direction in order:
            if maze.maze_map[currentNode][direction]==True:  #for those whose direction is '1'
                x, y = currentNode  # x=1st coordinate, y=2nd coordinate
                if direction == 'N':             #traversing in the order of priority
                    childNode = (x-1, y)
                elif direction == 'W':
                    childNode = (x, y-1)
                elif direction == 'S':
                    childNode = (x+1, y)
                elif direction == 'E':            
                    childNode = (x, y+1)

                if childNode not in visited_positions:
                    visited_positions.append(childNode)
                    frontiers.append(childNode)
                    pathtoreverse[childNode]=currentNode

                    
    path_to_goal = [goal]   
    tempnode = goal

    while tempnode != start:               # the loop continues to run until the start node hasnt reached
        tempnode = pathtoreverse[tempnode] #tempnode= descendant retrieved from the pathtoreverse dictionary
        path_to_goal.append(tempnode)      #append the descendant to the list

    path_to_goal.reverse()                #reverse the list to start from the 'start' node


    return visited_positions, path_to_goal




def heuristic(position, goal):
    '''
    This function should implement Euclidean Distance as the heuristic function used in A* algorithm.
    The inputs to this function are:
        position: The current position of the agent as a tuple (x,y)
        goal: The goal position of the agent as a tuple (x,y)
    The function should return:
        the heuristic value of the given position
    '''
    if position==goal:  #heuristic of goal node is 0
        h = 0
    else:
        x1,y1=position
        x2,y2=goal
        h = math.sqrt((x2 - x1)**2 + (y2 - y1)**2) ##formula applied
    return h

def AStar(maze, start, goal):
    '''
    This function should implement the A* algorithm.
    The inputs to this function are:
        maze: The maze object
        start: The start position of the agent as a tuple (x,y)
        goal: The goal position of the agent as a tuple (x,y)
    The function should return:
        a list containing all the positions visited by the search algorithm
        a list containing the positions in the final path from the start to the goal
    '''

    visited_positions = []
    path_to_goal = []

    # TODO: Implement A* Search algorithm here
    # NOTE: You can assume the cost of moving one step is 1 for this maze
    #       You can use the Euclidean distance as the heuristic function for this assignment
    
    order=['N','W','S','E']     #order is equal to pritority because of FIFO nature of queue
    visited_positions.append(start)    #adding the start node to visited & frontiers list
    pathtoreverse={}
    
    #we use dictionaries in a* search to account for values of each node in the maze 
    gn = {}
    fn = {}

    for i in range(1, 21):
        for j in range(1, 21):
            node = (i, j)
            gn[node] = float('inf')
            fn[node] = float('inf')
            
    
    ##for start node
    gn[start]=0         #gn measures distance from start node, so for start node, its 0
    fn[start]=0+heuristic(start,goal)    #fn=gn+hn= 0+hn
    
    frontiers=PriorityQueue()            #a priority queue used in A* search
    frontiers.put((fn[start],heuristic(start,goal),start))  #putting the start node in the queue in the form of tuple
    
    
    while not frontiers.empty():                 
        currentTuple = frontiers.get()
        currentNode = currentTuple[2]     #extracting the 2nd index from the tuple of priority queue

        if currentNode == goal:
            break

        for direction in order:
            if maze.maze_map[currentNode][direction] == True:
                x, y = currentNode
                if direction == 'N':
                    childNode = (x-1, y)
                elif direction == 'W':
                    childNode = (x, y-1)
                elif direction == 'S':
                    childNode = (x+1, y)
                elif direction == 'E':
                    childNode = (x, y+1)

                newgn = gn[currentNode] + 1         #next gn =current cost +1
                newfn = newgn + heuristic(childNode, goal) #total=fn=gn+hn

                if newfn < fn[childNode]:     # we choose nodes with lower fn (low cost)
                    gn[childNode] = newgn
                    fn[childNode] = newfn
                    frontiers.put((newfn,heuristic(childNode,goal),childNode))  
                    visited_positions.append(childNode)
                    pathtoreverse[childNode]=currentNode
                    
                    
                               
    path_to_goal = [goal]   
    tempnode = goal

    while tempnode != start:               # the loop continues to run until the start node hasnt reached
        tempnode = pathtoreverse[tempnode] #tempnode= descendant retrieved from the pathtoreverse dictionary
        path_to_goal.append(tempnode)      #append the descendant to the list

    path_to_goal.reverse()                #reverse the list to start from the 'start' node
                    

    return visited_positions, path_to_goal



# DO NOT CHANGE THE LINES OF CODE BELOW
# -------------------------------------
# This part of the code calls the search algorithms implemented above and displays the results on the maze
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-b", "--bfs", help="Run BFS", action="store_true")
    parser.add_argument("-d", "--dfs", help="Run DFS", action="store_true")
    parser.add_argument("-a", "--astar", help="Run A* Search", action="store_true")

    args = parser.parse_args()

    start = (ROWS, COLS)
    goal = (1,1)

    explored, path_to_goal = [], []

    if args.bfs:
        explored, path_to_goal = BFS(m, start, goal)
    elif args.dfs:
        explored, path_to_goal = DFS(m, start, goal)
    elif args.astar:
        explored, path_to_goal = AStar(m, start, goal)
    else:
        print("No search algorithm specified. See help below.")
        parser.print_help()
        sys.exit()

    a = agent(m, ROWS, COLS, filled=True)
    b = agent(m, ROWS, COLS, color="red")

    m.tracePath({a: explored}, delay=20)
    m.tracePath({b: path_to_goal}, delay=50)

    m.run()


if __name__ == "__main__":
    main()











