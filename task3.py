# Importing modules and libraries
import time
import random
# You may add some imports here


# The board for the game
board = ["-", "-", "-",
         "-", "-", "-",
         "-", "-", "-"]

# Function to display the board
def display_board(board):
    print()
    print(board[0] + " | " + board[1] + " | " + board[2])
    print(board[3] + " | " + board[4] + " | " + board[5])
    print(board[6] + " | " + board[7] + " | " + board[8])
    print()

# Function to check if any player has won
def winner(board):
    # Checking rows
    for i in [0, 3, 6]:
        if board[i] == board[i+1] == board[i+2] != "-":
            return board[i]
        
    # Checking columns
    for i in [0, 1, 2]:
        if board[i] == board[i+3] == board[i+6] != "-":
            return board[i]
        
    # Checking diagonals
    if board[0] == board[4] == board[8] != "-":
        return board[0]
    if board[2] == board[4] == board[6] != "-":
        return board[2]
    
    # Checking if the game is a tie
    if "-" not in board:
        return "tie"
    
    # If no one has won and the game is not a tie, return None
    return None


# Minimax algorithm with alpha-beta pruning
# TODO: Implement the minimax algorithm with alpha-beta pruning
def minimax(board, Max, A, B):
    # this algorithm desires to get the favourable outcome for the computer so different outcomes output a number and the  computer
    # analyses these numbers to ultimately select the position that would let the computer win

    #the winner function has already described all possible outcomes that declares a winner or tie
    if winner(board) == "X":    
        return -100           #winning of human player X is undesirable for computer so we output a low score
    elif winner(board) == "O":
        return 100            #winning of computer player  O is favourable for computer so we output a high score
    elif winner(board) == "tie":
        return 0                # a tie is neutral

    if Max:   #indicates turn of computer player
        maxscore = -1000  #we have set an arbitary value and are trying  to maximize it further 
        for i in range(9):
            if board[i] == '-':
                board[i] = "O"
                score = minimax(board, False, A, B)    #This recursive call is made to evaluate the potential moves of the opponent, assuming they will make 
                board[i] = '-'                         # the move that minimizes the score for the current state. max is set to false when it's the turn of human player.
                maxscore = max(score, maxscore)      
                A = max(A, score)                    #depending on  next  max score alpha is updated 
                if B <= A:                          #depending on  next min score beta is updated and it  is ensured that beta which is least value 
                    break                            # is less than apha the  max value i.e alpha  beta  pruning  done
        return maxscore
    else:  #indicates turn of human player
        maxscore = 800    #we have set an arbitary value and are trying  to reduce it further 
        for i in range(9):
            if board[i] == '-':
                board[i] = "X"
                score = minimax(board, True, A, B)   #This recursive call is made to evaluate the  moves of the computer, assuming they will make 
                board[i] = '-'                       # the move that maximizes the score for the current state. max is set to true when it's the turn of computer player. 
                maxscore = min(score, maxscore)   #best score is updated
                B = min(B, score)    
                if B <= A:                         #depending on  next min score beta is updated and it  is ensured that beta which is least value 
                    break                          # is less than apha the  max value i.e alpha  beta  pruning  done
        return maxscore


# Function to find the best computer's move using minimax with alpha-beta pruning
# TODO: Implement the function to find the best computer's move using minimax with alpha-beta pruning
def computer_move(board):
    maxscore = -1000    #we have  set a random number as maxscore and its corresponding  move that returns  the maxscore as  best move  
    maxmove = -1

    A = -10000       #alpha is a greatest possible number and we give it a random value to be updated later
    B = 10000        #beta is a smallest possible number and we give it a random value to be updated later

    for i in range(9):  #there are 9 possible places on  the board 
        if board[i] == '-':    #if that  spot is empty computer makes a move here
            board[i] = "O"
            score = minimax(board, False, A, B)   #algorithm is run by  analyzing move from human players pov
            board[i] = '-'                       #board is set to initial state to explore more moves

            if score > maxscore:        
                maxscore = score    
                maxmove = i

    return maxmove


# /////////////////////////////////////////////////////////////////////////////////////////////// #
# Main function to run the game
def main():
    current_player = "X"

    while True:
        # Displaying the board
        display_board(board)
        
        # Checking if the game has ended
        if winner(board) == "tie":
            print("The game has ended in a tie.")
            break
        elif winner(board) == "X":
            print("Congratualtions! You have won the game.")
            break
        elif winner(board) == "O":
            print("The computer has won the game.")
            break
        
        if current_player == "X":
            # Getting the user's move
            while True:
                try:
                    user_move = int(input("Enter your move (1-9): ")) - 1
                    if user_move in range(9) and board[user_move] == "-":
                        board[user_move] = "X"
                        break
                    else:
                        print("Invalid move. Try again.")
                except:
                    print("Invalid move. Try again.")
                    
            current_player = "O"
        else:
            # Getting the computer's move
            print("The computer is thinking...")
            time.sleep(0.5) # Sleep for suspense

            computer = computer_move(board)
            board[computer] = "O"
            current_player = "X"

if __name__ == "__main__":
    main()
