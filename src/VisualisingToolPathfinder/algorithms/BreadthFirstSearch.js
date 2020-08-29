import { connectNeighbourNodes, getUnvisitedNeighbours } from "./Helper";

export function BreadthFirstSearch(startNode, finishNode, grid) {
  let visNodes = [];
  let unVisNodes = [startNode];
  startNode.distance = 0;

  while(unVisNodes.length > 0){
    let curNode = unVisNodes.shift();

    if(curNode.isVisited) continue;
    curNode.isVisited = true;
    visNodes.push(curNode);

    if(curNode === finishNode) break;
    let neighbours = getUnvisitedNeighbours(curNode, grid);
    connectNeighbourNodes(curNode, neighbours);
    unVisNodes = unVisNodes.concat(neighbours);
  }

  return visNodes;
}