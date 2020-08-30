import { findMinDistanceNode, connectNeighbourNodes, getUnvisitedNeighbours } from "./Helper";

export function DijkstrasShortestPath(startNode, finishNode, grid) {

  // initalise all distances to infinity
  for(let i=0; i<grid.length; i++){
    for(let j=0;j<grid[0].length; j++){
      grid[i][j].distance = Infinity;
    }
  }

  let visNodes = [];
  // To store all adjacent nodes
  let unVisNodes = [startNode];
  startNode.distance = 0;

  let itrCount = 0;

  while(unVisNodes.length > 0){

    // incase infinite loop
    itrCount++;
    if(itrCount > 2000){
      console.log("infinity loop");
      return [];
    }

    let curNode = findMinDistanceNode(unVisNodes);
    curNode.isVisited = true;
    visNodes.push(curNode);
    // remove element from unVisNodes
    let index = unVisNodes.indexOf(curNode);
    unVisNodes.splice(index, 1);

    if(curNode === finishNode) break;

    let neighbours = getUnvisitedNeighbours(curNode, grid);
    neighbours.forEach((neighbour) => {
      if(curNode.distance !== Infinity && curNode.distance + 1 < neighbour.distance) {
        neighbour.distance = curNode.distance + 1;
        connectNeighbourNodes(curNode, [neighbour]);
        if(!unVisNodes.includes(neighbour)){
          unVisNodes.push(neighbour);
        }
      }
    });
  }

  return visNodes;
}