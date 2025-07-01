from collections import deque

def is_valid(grid, row, col, num, constraints, grid_size):
    """
    Checks if placing a number in a given cell is valid.
    """
    # Check row and column for uniqueness
    for i in range(grid_size):
        if grid[row][i] == num or grid[i][col] == num:
            return False

    # Check inequality constraints
    for constraint in constraints:
        pos1 = (constraint['position1']['row'], constraint['position1']['col'])
        pos2 = (constraint['position2']['row'], constraint['position2']['col'])
        
        val1 = grid[pos1[0]][pos1[1]] if (pos1[0] != row or pos1[1] != col) else num
        val2 = grid[pos2[0]][pos2[1]] if (pos2[0] != row or pos2[1] != col) else num

        if (row, col) == pos1:
            val1 = num
            if grid[pos2[0]][pos2[1]] is not None:
                val2 = grid[pos2[0]][pos2[1]]
            else:
                continue
        elif (row, col) == pos2:
            val2 = num
            if grid[pos1[0]][pos1[1]] is not None:
                val1 = grid[pos1[0]][pos1[1]]
            else:
                continue
        else:
            continue
        
        if val1 is not None and val2 is not None:
            if constraint['type'] == 'greater' and val1 <= val2:
                return False
            if constraint['type'] == 'less' and val1 >= val2:
                return False

    return True

def get_neighbors(row, col, grid_size):
    """Gets all row and column neighbors for a cell."""
    neighbors = set()
    for i in range(grid_size):
        if i != col:
            neighbors.add((row, i))
        if i != row:
            neighbors.add((i, col))
    return list(neighbors)
