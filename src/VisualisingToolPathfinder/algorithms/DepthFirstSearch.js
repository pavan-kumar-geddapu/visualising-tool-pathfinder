import { connectNeighbourNodes, getUnvisitedNeighbours } from "./Helper";

export function DepthFirstSearch(startNode, finishNode, grid) {
  let visNodes = [];
  startNode.isVisited = true;
  let unVisNodes = [startNode];
  startNode.distance = 0;
  
  let itrCount = 0;
  // stack implementation
  while(unVisNodes.length > 0){
    itrCount++;
    // incase infinite loop
    if(itrCount > 2000) return [];

    let curNode = unVisNodes[unVisNodes.length - 1];
    // console.log(curNode);
    
    if(!visNodes.includes(curNode)) visNodes.push(curNode);

    if(curNode === finishNode) break;

    let neighbours = getUnvisitedNeighbours(curNode, grid);
    // iterate into each neighbours recursively
    if(neighbours.length === 0){
      unVisNodes.pop();
      continue;
    }
    connectNeighbourNodes(curNode, neighbours);
    let childNode = neighbours[0];
    childNode.isVisited = true;
    unVisNodes.push(childNode);
  }

  return visNodes;
}