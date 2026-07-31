const { playNoteForNode, playSuccessChord } = require('./audioSymphony'); // 🎵 IMPORT AUDIO

function launchAnimations(board, success, type, object, algorithm, heuristic) {
  let nodes = object ? board.nodesToAnimate.concat(board.objectNodesToAnimate) : board.nodesToAnimate;
  let speed = 10; 

  function animateShortestPath() {
    let shortestNodes = [];
    let currentNode = board.nodes[board.target];
    
    while (currentNode && currentNode.id !== board.start) {
      shortestNodes.unshift(currentNode);
      currentNode = board.nodes[currentNode.previousNode];
    }
    
    for (let i = 0; i < shortestNodes.length; i++) {
      setTimeout(() => {
        let node = shortestNodes[i];
        let el = document.getElementById(node.id);
        
        el.style.backgroundColor = ""; 
        el.style.border = "";
        
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

  for (let i = 0; i <= nodes.length; i++) {
    if (i === nodes.length) {
      setTimeout(() => {
        if (success) {
          playSuccessChord(); // 🎵 PLAY CHORD WHEN TARGET IS FOUND
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
        
        // 🎵 PLAY INDIVIDUAL NOTE FOR THIS NODE (throttle to every 2nd node to prevent audio tearing)
        if (i % 2 === 0) playNoteForNode(node.id, board.target);

        let fraction = i / nodes.length; 
        let hue = Math.floor(240 - (fraction * 240)); 

        if (node.weight === 15) {
          currentHTMLNode.className = "visited weight";
          currentHTMLNode.style.backgroundColor = `hsl(${hue}, 100%, 30%)`; 
        } else {
          currentHTMLNode.className = "visited";
          currentHTMLNode.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
          currentHTMLNode.style.border = `1px solid hsl(${hue}, 100%, 40%)`; 
        }
      }
    }, i * speed);
  }
}

module.exports = launchAnimations;
        
        

