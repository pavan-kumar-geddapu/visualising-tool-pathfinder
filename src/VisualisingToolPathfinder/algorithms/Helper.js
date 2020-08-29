// update neighbour nodes by connecting them with current node
export function updateNeighbourNodes(node, grid) {
  const neighbours = getUnvisitedNeighbours(node, grid);
  neighbours.forEach((neighbour) => {
    neighbour.distance = node.distance + 1;
    neighbour.prevNode = node;
  }
  );
}

// to get neighbour nodes
export function getUnvisitedNeighbours(node, grid) {
  let neighbours = [];
  const {row, col} = node;
  if(row > 0 && !grid[row-1][col].isVisited) neighbours.push(grid[row-1][col]);
  if(row < grid.length-1 && !grid[row+1][col].isVisited) neighbours.push(grid[row+1][col]);
  if(col > 0 && !grid[row][col-1].isVisited) neighbours.push(grid[row][col-1]);
  if(col < grid[0].length-1 && !grid[row][col+1].isVisited) neighbours.push(grid[row][col+1]);
  return neighbours;
}