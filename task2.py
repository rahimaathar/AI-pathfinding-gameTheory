# Importing modules and libraries
import networkx as nx
import matplotlib.pyplot as plt
import argparse
import sys
# You may add some imports here

# Define the graph
edges = [
    ("PL", "GE"), ("PL", "CZ"), ("GE", "CZ"), ("CZ", "AU"),
    ("CZ", "SK"), ("AU", "SK"), ("SK", "HU"), ("AU", "HU"),
    ("AU", "SL"), ("HU", "SL"), ("SL", "CR"), ("HU", "CR"),
    ("CR", "BH"), ("HU", "SE"), ("HU", "RO"), ("SE", "RO"),
    ("BH", "SE"), ("CR", "SE"), ("RO", "BG"), ("BG", "GR")
]

# Create the graph
G = nx.Graph()
G.add_edges_from(edges)

# Constraints
colors = ["red", "green", "blue"]
domain = {node: colors for node in G.nodes()}
domain["PL"] = ["red"]  
domain["GR"] = ["green"]
domain["SL"] = ["red"]
domain["HU"] = ["green"]

# /////////////////////////////////////////////////////////////////////////////////////////////// #
# Arc consistency algorithm
# TODO: Implement the arc consistency algorithm
def arc_consistency(G, domain):
    edges = list(G.edges())    # the edge pair as tuples are made into a list

    while edges:  # iterating over each pair
        # the neighbouring edges are now assigned separate variables
        (node1, node2) = edges.pop()
        # domain1 and domain2 shows the colour domain of both these nodes
        domain1 = domain[node1]
        domain2 = domain[node2]

        colors1 = []
        for i in domain1:  # from domain of node1 we are removing those color which  are also in domain of node2
            unique = False
            for j in domain2:
                if i != j:
                    unique = True
                    break
            if unique:
                colors1.append(i)  # unique colors are added to  colors 1

        # if  node1 domain reduction happens  the domain  is updated and then we check for
        if len(colors1) < len(domain1):
            # further neighbours of node1 and the new edge  tuple is added at end of list and then
            domain[node1] = colors1
            for k in G.neighbors(node1):  # same process happens for that
                if k != node2:
                    edges.append((k, node1))

        colors2 = []  # for node2 we  do the same  processing its domain is reduced and updated and then check its neighbouring
        for i in domain2:  # domains and finally same process happens for the newly added node pair
            unique = False
            for j in domain1:
                if i != j:
                    unique = True
                    break
            if unique:
                colors2.append(i)

        if len(colors2) < len(domain2):
            domain[node2] = colors2
            for k in G.neighbors(node2):
                if k != node1:
                    edges.append((k, node2))

        domain3 = {}
        for j in domain:  # creating  a new dictionary and adding the nodes and their new domains consisting of one color and returning it
            domain3[j] = domain[j][0]

    return domain3


# ////////////////////////////////å/////////////////////////////////////////////////////////////// #
# Backtracking algorithm
# TODO: Implement the DFS with backtracking algorithm
def dfs_backtracking(G, domain):
    initialnodes = list(G.nodes())  # all nodes are in form  of list
    initialnodes.remove("PL")     #constrained nodes are removed from the list
    initialnodes.remove("GR")
    initialnodes.remove("SL")
    initialnodes.remove("HU")

    domain2 = {"PL": "red","GR": "green","SL": "red","HU": "green"}     #constraints added beforehand in domain 2 dictionary
    
    def coloring(initialnodes):       #coloring is a recursive function
        if len(domain2) == 13:   # there are 13 states so if all states are added to dictionary then the function will stop
            return True

        current = initialnodes.pop()  # selecting a node from  the list and it is removed from initial node list to assign  it  a suitable colour and add  it  to  dictionary

        for x in colors:    #iterating through the list of colors 
            bool1 = True
            for i in G.neighbors(current):    #checking neighbouring nodes  of the current node     
                if (i in domain2):           #first we check if that neighbour is added to  our final dictionary domain2
                    bool2 = True
                else:
                    bool2 = False

                if bool2 and domain2[i] == x:   #incase it is present we check if the color matches the  color that we selected for current node through for loop
                    bool1 = False           

            if bool1:       #in case the color chosen for current node was not assigned to its neighbours which was also in the  final dictionary
                domain2[current] = x   #that color is  assigned to the current node
                if coloring(initialnodes):    #recursive call is made for remaining node in the initialnodes list
                    return True
                else:
                    domain2.pop(current)  #in case color assignment was wrong the current node was removed from the domain2

        initialnodes.append(current)  #current node is added back to the  initial node list for re assignment 
        return False

    if coloring(initialnodes):   #the recursive function is called in  the main dfs  function  and domain2 is returned 
        return domain2


# /////////////////////////////////////////////////////////////////////////////////////////////// #
# main function. DO NOT MODIFY!

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-a", "--arc", help="Run Arc Consistency algorithm", action="store_true")
    parser.add_argument("-d", "--dfs", help="Run DFS with backtracking algorithm", action="store_true")
    parser.add_argument("-g", "--graph", help="Display the graph", action="store_true")

    args = parser.parse_args()

    # Generate fixed positions using spring_layout with a fixed seed
    pos = nx.spring_layout(G, seed=42)

    if args.graph:
        nx.draw(G, pos, with_labels=True, node_color="yellow")
        plt.show()

    elif args.arc:
        solution = arc_consistency(G, domain)
        print(solution)
        try:
            nx.draw(G, pos, with_labels=True, node_color=[solution[node] for node in G.nodes()])
        except:
            print("No / incorrect solution found.")
            nx.draw(G, pos, with_labels=True, node_color="yellow")
        plt.show()

    elif args.dfs:
        solution = dfs_backtracking(G, domain)
        print(solution)
        try:
            nx.draw(G, pos, with_labels=True, node_color=[solution[node] for node in G.nodes()])
        except:
            print("No / incorrect solution found.")
            nx.draw(G, pos, with_labels=True, node_color="yellow")
        plt.show()

    else:
        print("No algorithm specified. See help below.")
        parser.print_help()
        sys.exit()

if __name__ == "__main__":
    main()
