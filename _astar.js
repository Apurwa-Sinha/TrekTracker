function test(nodes, start, target, nodesToAnimate, boardArray, name, heuristic) {
  if (!start || !target || start === target) return false;
  
  nodes[start].distance = 0;
  nodes[start].totalDistance = 0;
  nodes[start].direction = "up";
  
  let unvisitedNodes = Object.keys(nodes);
  
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    
    while (currentNode.status === "wall" && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes)
    }
    if (currentNode.totalDistance === Infinity) return false;
    
    currentNode.status = "visited";
    nodesToAnimate.push(currentNode); 
    
    if (currentNode.id === target) {
      while (currentNode.id !== start) {
        nodesToAnimate.unshift(currentNode);
        currentNode = nodes[currentNode.previousNode];
      }
      return "success!";
    }
    
    if (name === "astar" || name === "greedy") {
      updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
    } else if (name === "dijkstra") {
      updateNeighbors(nodes, currentNode, boardArray);
    }
  }
}

function closestNode(nodes, unvisitedNodes) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
  let neighbors = getNeighbors(node.id, nodes, boardArray);
  for (let neighbor of neighbors) {
    if (target) {
      updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
    } else {
      updateNode(node, nodes[neighbor]);
    }
  }
}

function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distanceData = getDistance(currentNode, targetNode);
  let weight = targetNode.weight === 15 ? 15 : 1;
  let g = currentNode.distance + weight + distanceData[0];
  let f; 

  if (actualTargetNode && name === "astar") {
    let h = 0;
    if (heuristic === "manhattanDistance") h = manhattanDistance(targetNode, actualTargetNode);
    else if (heuristic === "poweredManhattanDistance") h = Math.pow(manhattanDistance(targetNode, actualTargetNode), 3);
    else if (heuristic === "extraPoweredManhattanDistance") h = Math.pow(manhattanDistance(targetNode, actualTargetNode), 5);
    f = g + h;
  } else if (actualTargetNode && name === "greedy") {
    f = manhattanDistance(targetNode, actualTargetNode);
  } else {
    f = g; 
  }

  if (f < targetNode.totalDistance) {
    targetNode.distance = g;           
    targetNode.totalDistance = f;      
    targetNode.previousNode = currentNode.id;
    targetNode.path = distanceData[1];
    targetNode.direction = distanceData[2];
  }
}

function getNeighbors(id, nodes, boardArray) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  return neighbors;
}

function getDistance(nodeOne, nodeTwo) {
  let currentCoordinates = nodeOne.id.split("-");
  let targetCoordinates = nodeTwo.id.split("-");
  let x1 = parseInt(currentCoordinates[0]), y1 = parseInt(currentCoordinates[1]);
  let x2 = parseInt(targetCoordinates[0]), y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.direction === "up") return [1, ["f"], "up"];
    if (nodeOne.direction === "right") return [2, ["l", "f"], "up"];
    if (nodeOne.direction === "left") return [2, ["r", "f"], "up"];
    if (nodeOne.direction === "down") return [3, ["r", "r", "f"], "up"];
  } else if (x2 > x1) {
    if (nodeOne.direction === "up") return [3, ["r", "r", "f"], "down"];
    if (nodeOne.direction === "right") return [2, ["r", "f"], "down"];
    if (nodeOne.direction === "left") return [2, ["l", "f"], "down"];
    if (nodeOne.direction === "down") return [1, ["f"], "down"];
  }
  if (y2 < y1) {
    if (nodeOne.direction === "up") return [2, ["l", "f"], "left"];
    if (nodeOne.direction === "right") return [3, ["l", "l", "f"], "left"];
    if (nodeOne.direction === "left") return [1, ["f"], "left"];
    if (nodeOne.direction === "down") return [2, ["r", "f"], "left"];
  } else if (y2 > y1) {
    if (nodeOne.direction === "up") return [2, ["r", "f"], "right"];
    if (nodeOne.direction === "right") return [1, ["f"], "right"];
    if (nodeOne.direction === "left") return [3, ["r", "r", "f"], "right"];
    if (nodeOne.direction === "down") return [2, ["l", "f"], "right"];
  }
  return [0, ["f"], nodeOne.direction];
}

function manhattanDistance(nodeOne, nodeTwo) {
  let n1 = nodeOne.id.split("-").map(e => parseInt(e));
  let n2 = nodeTwo.id.split("-").map(e => parseInt(e));
  return Math.abs(n1[0] - n2[0]) + Math.abs(n1[1] - n2[1]);
}

module.exports = test;








      


