function caveMaze(board) {
  let nodes = board.nodes;
  let width = board.width;
  let height = board.height;
  
  // Step 1: Randomly fill the board with 40% walls
  Object.keys(nodes).forEach(id => {
    let node = nodes[id];
    let relevantStatuses = ["start", "target", "object"];
    if (!relevantStatuses.includes(node.status)) {
      if (Math.random() < 0.40) {
        node.status = "wall";
      } else {
        node.status = "unvisited";
      }
    }
  });

  // Step 2: Smooth the caves out (Cellular Automata rule)
  // We run this smoothing pass 4 times to create natural-looking caverns
  for (let i = 0; i < 4; i++) {
    let nextStatus = {};
    
    Object.keys(nodes).forEach(id => {
      let node = nodes[id];
      let relevantStatuses = ["start", "target", "object"];
      if (relevantStatuses.includes(node.status)) return;

      let wallNeighbors = countWallNeighbors(id, nodes, width, height);
      
      // The Rule: If a space is surrounded by walls, it becomes a wall. 
      // If it has lots of open space, it becomes empty space.
      if (wallNeighbors > 4) {
        nextStatus[id] = "wall";
      } else if (wallNeighbors < 4) {
        nextStatus[id] = "unvisited";
      } else {
        nextStatus[id] = node.status; // stay the same
      }
    });

    // Apply the new statuses
    Object.keys(nextStatus).forEach(id => {
      nodes[id].status = nextStatus[id];
    });
  }

  // Step 3: Push the final walls to the animation array
  Object.keys(nodes).forEach(id => {
    let node = nodes[id];
    if (node.status === "wall") {
      let htmlNode = document.getElementById(id);
      board.wallsToAnimate.push(htmlNode);
    }
  });
}

function countWallNeighbors(id, nodes, width, height) {
  let coords = id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  let wallCount = 0;

  // Check all 8 surrounding neighbors (including diagonals)
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;
      
      let newRow = r + rowOffset;
      let newCol = c + colOffset;
      
      // If the neighbor is out of bounds, count it as a wall to close off the edges
      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        wallCount++;
      } else {
        let neighborId = `${newRow}-${newCol}`;
        if (nodes[neighborId].status === "wall") {
          wallCount++;
        }
      }
    }
  }
  return wallCount;
}

module.exports = caveMaze;
