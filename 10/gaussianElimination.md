# Notes to understand the example solution

```
First, perform gaussian elimination to minimize amount of free variables:
store current row, start at zero
foreach column
  find first nonzero row
  if found
    swap rows so this row is current row
    divide all cells in row by the value at the column (ie make col value 1)
    for all other rows with a value in the column, subtract by factor (ie reduce this column to zero for all other rows)
    increment current row

calculate max goal number
searchBound = maxGoal + 1 (the maximum number of times any one button can be pressed)
minCost = infinite

Search the free variables recursively, storing the best result
```

```
Search remaining free variables recursively

//check recursive guard
if this path has all the free variables assigned:
  solve the equation using the assigned free variables and back-substitution:
    copy the assigned free variables to a solution array, each column is a variable.
    for each row in reverse
      take the pivot column for that row (the column where only one row has a value)
      take the result (right hand side of the equation, also called junction value)
      for each column from the pivot column + 1, except the result column: (the pivot column is not needed, it would always be zero since we're calculating the solution to that column now)
        subtract from the result value the current column times the solution for that column
      if the junction value is not an integer, or is below zero, the solution is not valid (at least in this case...)
        return
      store the value in the solution table for this column

  is the solution shorter than current best?
    current best = this
  return solution

while value < searchBound (optimization: and total cost < current best)
  recurse with next free variable
  increment value
```
