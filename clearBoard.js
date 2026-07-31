function clearBoard() {
  // 1. Reset all arrays and states
  this.nodesToAnimate = [];
  this.objectNodesToAnimate = [];
  this.wallsToAnimate = [];
  this.algoDone = false;
  this.isObject = false;
  this.numberOfObjects = 0;

  // 2. Loop through the grid and wipe everything clean
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    let currentHTMLNode = document.getElementById(id);
    
    // Reset math
    currentNode.previousNode = null;
    currentNode.distance = Infinity;
    currentNode.totalDistance = Infinity;
    currentNode.heuristicDistance = null;
    currentNode.direction = null;
    currentNode.storedDirection = null;
    currentNode.weight = 0;
    
    // Reset Bidirectional search variables
    currentNode.otherpreviousNode = null;
    currentNode.otherdistance = Infinity;
    currentNode.otherTotalDistance = Infinity;
    currentNode.otherdirection = null;

    // Remove walls, weights, objects, and paths
    if (currentNode.status !== "start" && currentNode.status !== "target") {
      currentNode.status = "unvisited";
      currentHTMLNode.className = "unvisited";
    }
  });

  // 3. Reset the Start and Target nodes to their default positions
  let defaultStartId = `${Math.floor(this.height / 2)}-${Math.floor(this.width / 4)}`;
  let defaultTargetId = `${Math.floor(this.height / 2)}-${Math.floor(3 * this.width / 4)}`;
  
  // Wipe the old start/target nodes
  this.nodes[this.start].status = "unvisited";
  document.getElementById(this.start).className = "unvisited";
  this.nodes[this.target].status = "unvisited";
  document.getElementById(this.target).className = "unvisited";

  // Reassign to defaults
  this.start = defaultStartId;
  this.target = defaultTargetId;
  
  this.nodes[this.start].status = "start";
  document.getElementById(this.start).className = "start";
  this.nodes[this.target].status = "target";
  document.getElementById(this.target).className = "target";
}

module.exports = clearBoard;
