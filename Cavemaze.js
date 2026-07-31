function caveMaze(board) {
  let nodes = board.nodes;
  let width = board.width;
  let height = board.height;
  
  Object.keys(nodes).forEach(id => {
    let node = nodes[id];
    let relevantStatuses = ["start", "target", "object"];
    if (!relevantStatuses.includes(node.status)) {
      if (Math.random() < 0.40) node.status = "wall";
      else node.status = "unvisited";
    }
  });

  for (let i = 0; i < 4; i++) {
    let nextStatus = {};
    Object.keys(nodes).forEach(id => {
      let node = nodes[id];
      let relevantStatuses = ["start", "target", "object"];
      if (relevantStatuses.includes(node.status)) return;

      let wallNeighbors = countWallNeighbors(id, nodes, width, height);
      if (wallNeighbors > 4) nextStatus[id] = "wall";
      else if (wallNeighbors < 4) nextStatus[id] = "unvisited";
      else nextStatus[id] = node.status;
    });

    Object.keys(nextStatus).forEach(id => nodes[id].status = nextStatus[id]);
  }

  Object.keys(nodes).forEach(id => {
    let node = nodes[id];
    if (node.status === "wall") {
      board.wallsToAnimate.push(document.getElementById(id));
    }
  });
}

function countWallNeighbors(id, nodes, width, height) {
  let coords = id.split("-");
  let r = parseInt(coords[0]), c = parseInt(coords[1]), count = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;
      let newRow = r + rowOffset, newCol = c + colOffset;
      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        count++;
      } else {
        if (nodes[`${newRow}-${newCol}`].status === "wall") count++;
      }
    }
  }
  return count;
}

module.exports = caveMaze;
    
    
      


