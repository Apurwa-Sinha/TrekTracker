// bidirectional.js

const astar = require("./astar");

function bidirectional(nodes, start, target, nodesToAnimate, boardArray, name, heuristic, board) {
  if (name === "astar") return astar(nodes, start, target, nodesToAnimate, boardArray, name);
  if (!start || !target || start === target) {
    return false;
  }

  // Initialize start node (Forward search)
  nodes[start].distance = 0;
  nodes[start].totalScore = 0; // This acts as 'f' (f = g + h)
  nodes[start].direction = "right";
  
  // Initialize target node (Reverse search)
  nodes[target].otherdistance = 0;
  nodes[target].otherTotalScore = 0; // This acts as reverse 'f'
  nodes[target].otherdirection = "left";

  let visitedNodes = {};
  let unvisitedNodesOne = Object.keys(nodes);
  let unvisitedNodesTwo = Object.keys(nodes);

  while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
    // FIX: Pass the correct key for the total A* score (f)
    let currentNode = closestNode(nodes, unvisitedNodesOne, "totalScore");
    let secondCurrentNode = closestNode(nodes, unvisitedNodesTwo, "otherTotalScore");

    while (
      (currentNode.status === "wall" || secondCurrentNode.status === "wall") &&
      unvisitedNodesOne.length &&
      unvisitedNodesTwo.length
    ) {
      if (currentNode.status === "wall") currentNode = closestNode(nodes, unvisitedNodesOne, "totalScore");
      if (secondCurrentNode.status === "wall") secondCurrentNode = closestNode(nodes, unvisitedNodesTwo, "otherTotalScore");
    }

    if (currentNode.distance === Infinity || secondCurrentNode.otherdistance === Infinity) {
      return false; // No path found
    }

    nodesToAnimate.push(currentNode);
    nodesToAnimate.push(secondCurrentNode);
    currentNode.status = "visited";
    secondCurrentNode.status = "visited";

    // Stop condition: Frontiers meet
    if (visitedNodes[currentNode.id]) {
      board.middleNode = currentNode.id;
      return "success";
    } else if (visitedNodes[secondCurrentNode.id]) {
      board.middleNode = secondCurrentNode.id;
      return "success";
    } else if (currentNode === secondCurrentNode) {
      board.middleNode = secondCurrentNode.id;
      return "success";
    }

    visitedNodes[currentNode.id] = true;
    visitedNodes[secondCurrentNode.id] = true;

    updateNeighbors(nodes, currentNode, boardArray, target, false);
    updateNeighbors(nodes, secondCurrentNode, boardArray, start, true);
  }
}

/**
 * Pops and returns the unvisited node with the smallest value for the given score key.
 */
function closestNode(nodes, unvisitedNodes, scoreKey) {
  let currentClosest, index;
  
  for (let i = 0; i < unvisitedNodes.length; i++) {
    const candidate = nodes[unvisitedNodes[i]];
    // If the node hasn't been reached yet, its score is Infinity
    const candScore = candidate[scoreKey] !== undefined ? candidate[scoreKey] : Infinity;
    const closestScore = (currentClosest && currentClosest[scoreKey] !== undefined) ? currentClosest[scoreKey] : Infinity;

    if (!currentClosest || candScore < closestScore) {
      currentClosest = candidate;
      index = i;
    }
  }
  
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

/**
 * Updates every walkable neighbor of `node` toward `targetId`.
 */
function updateNeighbors(nodes, node, boardArray, targetId, reverse) {
  const neighbors = getNeighbors(node.id, nodes, boardArray);
  const targetNodeForHeuristic = nodes[targetId];

  // Map keys based on whether this is the forward or reverse search
  const distanceKey = reverse ? "otherdistance" : "distance";
  const totalScoreKey = reverse ? "otherTotalScore" : "totalScore";
  const previousNodeKey = reverse ? "otherpreviousNode" : "previousNode";
  const directionKey = reverse ? "otherdirection" : "direction";

  for (const neighborId of neighbors) {
    const neighborNode = nodes[neighborId];

    if (neighborNode.status === "visited") continue;

    const step = getStep(node, neighborNode, directionKey);
    const weight = neighborNode.weight === 15 ? 15 : 1;

    // FIX THE SNOWBALL BUG: f = g + h
    // 1. Calculate new accumulated cost (g) based ONLY on parent's distance (g), not parent's f!
    const g = node[distanceKey] + weight + step[0];
    
    // 2. Calculate heuristic (h)
    const h = manhattanDistance(neighborNode, targetNodeForHeuristic);
    
    // 3. Calculate total score (f)
    const f = g + h;

    // Only update if we found a strictly shorter pure path (g) to this neighbor
    if (neighborNode[distanceKey] === undefined || g < neighborNode[distanceKey]) {
      neighborNode[distanceKey] = g;           // Store pure path cost (g)
      neighborNode[totalScoreKey] = f;         // Store total A* score (f) used for sorting
      neighborNode[previousNodeKey] = node.id;
      neighborNode.path = step[1];
      neighborNode[directionKey] = step[2];
    }
  }
}

function getNeighbors(id, nodes, boardArray) {
  const [xStr, yStr] = id.split("-");
  const x = parseInt(xStr);
  const y = parseInt(yStr);
  const neighbors = [];

  const offsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dx, dy] of offsets) {
    const nx = x + dx;
    const ny = y + dy;
    if (boardArray[nx] && boardArray[nx][ny]) {
      const neighborId = `${nx}-${ny}`;
      if (nodes[neighborId].status !== "wall") neighbors.push(neighborId);
    }
  }

  return neighbors;
}

function getStep(nodeOne, nodeTwo, directionKey) {
  const [x1, y1] = nodeOne.id.split("-").map(Number);
  const [x2, y2] = nodeTwo.id.split("-").map(Number);
  const facing = nodeOne[directionKey];

  const turns = {
    up: { up: [1, ["f"]], right: [2, ["l", "f"]], left: [2, ["r", "f"]], down: [3, ["r", "r", "f"]] },
    down: { up: [3, ["r", "r", "f"]], right: [2, ["r", "f"]], left: [2, ["l", "f"]], down: [1, ["f"]] },
    left: { up: [2, ["l", "f"]], right: [3, ["l", "l", "f"]], left: [1, ["f"]], down: [2, ["r", "f"]] },
    right: { up: [2, ["r", "f"]], right: [1, ["f"]], left: [3, ["r", "r", "f"]], down: [2, ["l", "f"]] },
  };

  let newDirection;
  if (x2 < x1) newDirection = "up";
  else if (x2 > x1) newDirection = "down";
  else if (y2 < y1) newDirection = "left";
  else if (y2 > y1) newDirection = "right";

  // Fallback just in case `facing` isn't properly initialized
  const safeFacing = facing || "right"; 
  
  const [cost, path] = turns[newDirection][safeFacing];
  return [cost, path, newDirection];
}

function manhattanDistance(nodeOne, nodeTwo) {
  const [x1, y1] = nodeOne.id.split("-").map(Number);
  const [x2, y2] = nodeTwo.id.split("-").map(Number);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

module.exports = bidirectional;













  





 
