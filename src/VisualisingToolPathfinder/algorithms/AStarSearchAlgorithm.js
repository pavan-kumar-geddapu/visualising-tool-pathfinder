import { getUnvisitedNeighbours, findManhattanDistance } from "./Helper";

class AstarNode {
  constructor(node, g, h, f) {
    this.node = node;
    this.g = g;
    this.h = h;
    this.f = f;
  }
}

// find min f value node
function findMinFvalueNode(nodeArray) {
  let minNode = null, minVal = Infinity;
  nodeArray.forEach((nodeElement) => {
    if(nodeElement.f < minVal) {
      minVal = nodeElement.f;
      minNode = nodeElement;
    }
  });
  return minNode;
}

// is current node has min fvalue
function isMinFvalue(curAstarNode, nodeArray){
  nodeArray.forEach((nodeElement) => {
    if(nodeElement.node === curAstarNode.node && nodeElement.f <= curAstarNode.f){
      return false;
    }
  });
  return true;
}

export function AStarSearchAlgorithm(startNode, finishNode, grid) {

  // incase startnode is finishnode
  if(startNode === finishNode) return [finishNode];

  let openList = [], closedList = [], visNodes = [];

  openList.push(new AstarNode(startNode, 0, 0, 0));
  startNode.distance = 0;

  let itrCount = 0;

  while(openList.length > 0){

    // incase infinite loop
    itrCount++;
    if(itrCount > 2000){
      console.log("infinity loop");
      return [];
    }

    let curNode = findMinFvalueNode(openList);
    curNode.node.isVisited =true;

    // remove curNode from openList
    let index = openList.indexOf(curNode);
    openList.splice(index, 1);

    let neighbours = getUnvisitedNeighbours(curNode.node, grid);

    let isFinishNodeFound = false;

    for(let neighbour of neighbours){
      // if finishNode found
      if(neighbour === finishNode ) {
        isFinishNodeFound = true;
        neighbour.distance = curNode.node.distance + 1;
        neighbour.prevNode = curNode.node;
        visNodes.push(curNode.node);
        visNodes.push(neighbour);
        break;
      }
      let hValue = findManhattanDistance(neighbour, finishNode);
      let successorNode = new AstarNode(neighbour, curNode.g, hValue, curNode.g+hValue);
      
      // // if current node doesn't have min f value doen't include it in current open list
      if(!isMinFvalue(successorNode, openList) || !isMinFvalue(successorNode, closedList)) continue;

      successorNode.node.isVisited = true;
      successorNode.node.prevNode = curNode.node;
      successorNode.node.distance = curNode.node.distance + 1;
      openList.push(successorNode);      
    }
    // if finishnode found break
    if(isFinishNodeFound) break;
    
    closedList.push(curNode);
    visNodes.push(curNode.node);
  }

  // mark all nodes in visNodes list as visited
  visNodes.forEach((node) => {
    node.isVisited = true;
  });

  return visNodes;
}