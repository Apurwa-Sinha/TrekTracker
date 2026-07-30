const astar = require("./astar");

/**
 * Runs a bidirectional search from `start` and `target` simultaneously,
 * meeting somewhere in the middle.
 *
 * NOTE ON THE FIX: the original scoring formula multiplied the step cost
 * by the Manhattan distance to the goal:
 *
 *   currentNode.distance + (weight + stepCost) * manhattanDistance(...)
 *
 * That's not how A*-style scoring works (f = g + h, not g * h), and it
 * meant nodes far from the goal were penalized multiplicatively for every
 * single step, distorting the search so it wouldn't reliably find the
 * shortest path. It's now g + h, matching standard practice.
 */
function bidirectional(nodes, start, target, nodesToAnimate, boardArray, name, heuristic, board) {
  if (name === "astar") return astar(nodes, start, target, nodesToAnimate, boardArray, name);
  if (!start || !target || start === target) {
    return false;
  }

  nodes[start].distance = 0;
  nodes[start].direction = "right";
  nodes[target].otherdistance = 0;
  nodes[target].otherdirection = "left";

  let visitedNodes = {};
  let unvisitedNodesOne = Object.keys(nodes);
  let unvisitedNodesTwo = Object.keys(nodes);

  while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
    let currentNode = closestNode(nodes, unvisitedNodesOne, "distance");
    let secondCurrentNode = closestNode(nodes, unvisitedNodesTwo, "otherdistance");

    while (
      (currentNode.status === "wall" || secondCurrentNode.status === "wall") &&
      unvisitedNodesOne.length &&
      unvisitedNodesTwo.length
    ) {
      if (currentNode.status === "wall") currentNode = closestNode(nodes, unvisitedNodesOne, "distance");
      if (secondCurrentNode.status === "wall") secondCurrentNode = closestNode(nodes, unvisitedNodesTwo, "otherdistance");
    }

    if (currentNode.distance === Infinity || secondCurrentNode.otherdistance === Infinity) {
      return false;
    }

    nodesToAnimate.push(currentNode);
    nodesToAnimate.push(secondCurrentNode);
    currentNode.status = "visited";
    secondCurrentNode.status = "visited";

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
 * Pops and returns the unvisited node with the smallest value for `distanceKey`
 * ("distance" for the forward search, "otherdistance" for the reverse search).
 * Replaces the old closestNode/closestNodeTwo pair.
 */
function closestNode(nodes, unvisitedNodes, distanceKey) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    const candidate = nodes[unvisitedNodes[i]];
    if (!currentClosest || currentClosest[distanceKey] > candidate[distanceKey]) {
      currentClosest = candidate;
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

/**
 * Updates every walkable neighbor of `node` toward `targetId`.
 * `reverse` selects whether we're updating the forward-search fields
 * (distance/previousNode/direction) or the reverse-search fields
 * (otherdistance/otherpreviousNode/otherdirection).
 * Replaces updateNeighbors/updateNeighborsTwo + updateNode/updateNodeTwo.
 */
function updateNeighbors(nodes, node, boardArray, targetId, reverse) {
  const neighbors = getNeighbors(node.id, nodes, boardArray);
  const targetNodeForHeuristic = nodes[targetId];

  const distanceKey = reverse ? "otherdistance" : "distance";
  const previousNodeKey = reverse ? "otherpreviousNode" : "previousNode";
  const directionKey = reverse ? "otherdirection" : "direction";

  for (const neighborId of neighbors) {
    const neighborNode = nodes[neighborId];

    // Skip nodes already finalized by this search direction — once a
    // node has been visited/closed, its shortest distance is final;
    // overwriting it later can leave the previousNode chain
    // inconsistent for any node that already built its path through it.
    if (neighborNode.status === "visited") continue;

    const step = getStep(node, neighborNode, directionKey);
    const weight = neighborNode.weight === 15 ? 15 : 1;

    // f = g (accumulated cost) + h (heuristic estimate to target)
    const g = node[distanceKey] + weight + step[0];
    const h = manhattanDistance(neighborNode, targetNodeForHeuristic);
    const score = g + h;

    if (score < neighborNode[distanceKey]) {
      neighborNode[distanceKey] = score;
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

/**
 * Returns [stepCost, turnPath, newFacingDirection] for moving from nodeOne
 * to nodeTwo, given nodeOne's current facing direction (read from
 * `directionKey`, so the same function serves both the forward and
 * reverse searches). Replaces getDistance/getDistanceTwo.
 */
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

  const [cost, path] = turns[newDirection][facing];
  return [cost, path, newDirection];
}

function manhattanDistance(nodeOne, nodeTwo) {
  const [x1, y1] = nodeOne.id.split("-").map(Number);
  const [x2, y2] = nodeTwo.id.split("-").map(Number);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

module.exports = bidirectional;


  





 
