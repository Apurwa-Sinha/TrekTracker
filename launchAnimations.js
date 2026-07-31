function launchAnimations(board, success, type, object, algorithm, heuristic) {
  // Combine nodes to animate if the user placed a target object (midpoint)
  let nodes = object ? board.nodesToAnimate.concat(board.objectNodesToAnimate) : board.nodesToAnimate;
  
  let speed = 10; // Speed of the expanding search (in milliseconds)

  // Helper function to draw the final yellow path once the search completes
  function animateShortestPath() {
    let shortestNodes = [];
    let currentNode = board.nodes[board.target];
    
    // Backtrack from the target using the previousNode property
    while (currentNode && currentNode.id !== board.start) {
      shortestNodes.unshift(currentNode);
      currentNode = board.nodes[currentNode.previousNode];
    }
    
    // Animate the shortest path slightly slower for a dramatic effect
    for (let i = 0; i < shortestNodes.length; i++) {
      setTimeout(() => {
        let node = shortestNodes[i];
        let el = document.getElementById(node.id);
        
        // Preserve the start/target/object icons while coloring the path
        if (node.id === board.target) {
          el.className = "target shortest-path";
        } else if (node.id === board.object) {
          el.className = "object shortest-path";
        } else if (node.id !== board.start) {
          el.className = "shortest-path";
        }
      }, i * 40); 
    }
  }

  // Loop through all visited nodes to create the expanding animation
  for (let i = 0; i <= nodes.length; i++) {
    // Once we finish animating the visited nodes, trigger the shortest path
    if (i === nodes.length) {
      setTimeout(() => {
        if (success) {
          animateShortestPath();
        }
      }, i * speed);
      return;
    }

    setTimeout(() => {
      let node = nodes[i];
      let currentHTMLNode = document.getElementById(node.id);
      let relevantStatuses = ["start", "target", "object"];
      
      if (!relevantStatuses.includes(node.status)) {
        // If the node was a heavy weight, keep it visually distinct when visited
        if (node.weight === 15) {
          currentHTMLNode.className = "visited weight";
        } else {
          currentHTMLNode.className = "visited";
        }
      }
    }, i * speed);
  }
}

module.exports = launchAnimations;
