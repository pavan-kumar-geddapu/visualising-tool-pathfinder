// to get neighbour nodes
export function getUnvisitedNeighbours(node, grid) {
  let neighbours = [];
  const {row, col} = node;
  if(col > 0 && !grid[row][col-1].isVisited && !grid[row][col-1].isWall) neighbours.push(grid[row][col-1]);
  if(row > 0 && !grid[row-1][col].isVisited && !grid[row-1][col].isWall) neighbours.push(grid[row-1][col]);
  if(col < grid[0].length-1 && !grid[row][col+1].isVisited && !grid[row][col+1].isWall) neighbours.push(grid[row][col+1]);
  if(row < grid.length-1 && !grid[row+1][col].isVisited && !grid[row+1][col].isWall) neighbours.push(grid[row+1][col]);
  return neighbours;
}

// connect neighbour nodes to current node
export function connectNeighbourNodes(node, neighbours) {
  neighbours.forEach((neighbour) => {
    // if it is not previously connected to anything
    if(neighbour.prevNode === null){
      neighbour.distance = node.distance + 1;
      neighbour.prevNode = node;
    }
  }
  );
}

// find min distance node in given array 
export function findMinDistanceNode(nodeArray) {
  let minVal = Infinity , minNode = null;
  nodeArray.forEach((node) => {
    if(node.distance < minVal) {
      minVal = node.distance;
      minNode = node;
    }
  });
  return minNode;
}