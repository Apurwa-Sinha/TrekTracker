
  function clearBoard() {
  this.nodesToAnimate = [];
  this.objectNodesToAnimate = [];
  this.wallsToAnimate = [];
  this.algoDone = false;
  this.isObject = false;
  this.numberOfObjects = 0;

  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    let currentHTMLNode = document.getElementById(id);
    
    currentNode.previousNode = null;
    currentNode.distance = Infinity;
    currentNode.totalDistance = Infinity;
    currentNode.heuristicDistance = null;
    currentNode.direction = null;
    currentNode.storedDirection = null;
    currentNode.weight = 0;
    currentNode.otherpreviousNode = null;
    currentNode.otherdistance = Infinity;
    currentNode.otherTotalDistance = Infinity;
    currentNode.otherdirection = null;

    currentHTMLNode.style.backgroundColor = "";
    currentHTMLNode.style.border = "";

    if (currentNode.status !== "start" && currentNode.status !== "target") {
      currentNode.status = "unvisited";
      currentHTMLNode.className = "unvisited";
    }
  });

  let defaultStartId = `${Math.floor(this.height / 2)}-${Math.floor(this.width / 4)}`;
  let defaultTargetId = `${Math.floor(this.height / 2)}-${Math.floor(3 * this.width / 4)}`;
  
  this.nodes[this.start].status = "unvisited";
  document.getElementById(this.start).className = "unvisited";
  this.nodes[this.target].status = "unvisited";
  document.getElementById(this.target).className = "unvisited";

  this.start = defaultStartId;
  this.target = defaultTargetId;
  
  this.nodes[this.start].status = "start";
  document.getElementById(this.start).className = "start";
  this.nodes[this.target].status = "target";
  document.getElementById(this.target).className = "target";
}

module.exports = clearBoard;  
    
  
