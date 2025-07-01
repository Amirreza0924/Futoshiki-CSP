# utils.py

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

        # Determine the values at the constrained positions
        val1 = None
        val2 = None

        if pos1 == (row, col):
            val1 = num
            if grid[pos2[0]][pos2[1]] is not None:
                val2 = grid[pos2[0]][pos2[1]]
        elif pos2 == (row, col):
            val2 = num
            if grid[pos1[0]][pos1[1]] is not None:
                val1 = grid[pos1[0]][pos1[1]]
        elif grid[pos1[0]][pos1[1]] is not None and grid[pos2[0]][pos2[1]] is not None:
            val1 = grid[pos1[0]][pos1[1]]
            val2 = grid[pos2[0]][pos2[1]]

        # If both constrained cells have values, check the constraint
        if val1 is not None and val2 is not None:
            if constraint['type'] == 'greater' and val1 <= val2:
                return False
            if constraint['type'] == 'less' and val1 >= val2:
                return False

    return True