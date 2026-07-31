function clearPath(clickedButton) {
  if (clickedButton) {
    let start = this.nodes[this.start];
    let target = this.nodes[this.target];
    let object = this.numberOfObjects ? this.nodes[this.object] : null;
    
    start.status = "start";
    document.getElementById(start.id).className = "start";
    target.status = "target";
    document.getElementById(target.id).className = "target";
    
    if (object) {
      object.status = "object";
      document.getElementById(object.id).className = "object";
    }
  }

  this.algoDone = false;
  
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    
    // Reset all math properties so a new algorithm can run fresh
    currentNode.previousNode = null;
    currentNode.distance = Infinity;
    currentNode.totalDistance = Infinity;
    currentNode.heuristicDistance = null;
    currentNode.direction = null;
    currentNode.storedDirection = null;
    currentNode.relatesToObject = false;
    currentNode.overwriteObjectRelation = false;
    
    // Reset Bidirectional search variables
    currentNode.otherpreviousNode = null;
    currentNode.otherdistance = Infinity;
    currentNode.otherTotalDistance = Infinity;
    currentNode.otherdirection = null;
    
    let currentHTMLNode = document.getElementById(id);
    let relevantStatuses = ["wall", "start", "target", "object"];
    
    // Keep walls and weights, but clear visited and path colors
    if ((!relevantStatuses.includes(currentNode.status) || currentHTMLNode.className === "visitedobject") && currentNode.weight !== 15) {
      currentNode.status = "unvisited";
      currentHTMLNode.className = "unvisited";
    } else if (currentNode.weight === 15) {
      currentNode.status = "unvisited";
      currentHTMLNode.className = "unvisited weight";
    }
  });
}

module.exports = clearPath;
