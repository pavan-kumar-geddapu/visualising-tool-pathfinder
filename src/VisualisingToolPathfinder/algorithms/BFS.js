import { updateNeighbourNodes, getUnvisitedNeighbours } from "./Helper";

export function BFS(startNode, finishNode, grid) {
  let visNodes = [];
  let unVisNodes = [startNode];
  startNode.distance = 0;

  while(unVisNodes.length > 0){
    let curNode = unVisNodes.shift();

    if(curNode.isVisited || curNode.isWall) continue;
    curNode.isVisited = true;
    visNodes.push(curNode);

    if(curNode === finishNode) break;
    let neighbours = getUnvisitedNeighbours(curNode, grid);
    updateNeighbourNodes(curNode, grid);
    unVisNodes = unVisNodes.concat(neighbours);
  }

  return visNodes;
}