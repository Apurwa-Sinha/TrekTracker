

function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic, unvisitedNodes) {
  let neighbors = getNeighbors(node.id, nodes, boardArray);
  for (let neighborId of neighbors) {
    let neighborNode = nodes[neighborId];
    // Only update neighbors that haven't been visited
    if (neighborNode.status !== "visited") {
        updateNode(node, neighborNode, nodes[target], name, nodes, nodes[start], heuristic, boardArray, unvisitedNodes);
    }
  }
}

function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray, unvisitedNodes) {
  let distanceData = getDistance(currentNode, targetNode);
  
  if (!targetNode.heuristicDistance) {
      targetNode.heuristicDistance = manhattanDistance(targetNode, actualTargetNode);
  }
  
  let distanceToCompare = currentNode.distance + targetNode.weight + distanceData[0];
  
  // If we found a shorter path to this neighbor
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distanceData[1];
    targetNode.direction = distanceData[2];
    
    // Check if it's already in the queue; if not, push it so we can explore it later
    if (!unvisitedNodes.includes(targetNode)) {
        unvisitedNodes.push(targetNode);
    }
  }
}










      


