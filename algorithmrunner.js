const weightedSearchAlgorithm = require('./weightedSearchAlgorithm');
const unweightedSearchAlgorithm = require('./unweightedSearchAlgorithm');
const bidirectional = require('./bidirectional');
const launchAnimations = require('./launchAnimations');

function runAlgorithm(board) {
  // Check if the user actually picked an algorithm first
  if (!board.currentAlgorithm) {
    document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>';
    return;
  }

  // 1. Clean the board before running
  board.clearPath("clickedButton");
  board.toggleButtons();

  let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
  let unweightedAlgorithms = ["dfs", "bfs"];
  let success;

  // ⏱️ START THE STOPWATCH
  let startTime = performance.now();

  // 2. Run the selected algorithm
  if (board.currentAlgorithm === "bidirectional") {
    if (!board.numberOfObjects) {
      success = bidirectional(board.nodes, board.start, board.target, board.nodesToAnimate, board.boardArray, board.currentAlgorithm, board.currentHeuristic, board);
      launchAnimations(board, success, "weighted");
    } else {
      board.isObject = true;
    }
    board.algoDone = true;
  } else if (board.currentAlgorithm === "astar" || weightedAlgorithms.includes(board.currentAlgorithm)) {
    if (!board.numberOfObjects) {
      success = weightedSearchAlgorithm(board.nodes, board.start, board.target, board.nodesToAnimate, board.boardArray, board.currentAlgorithm, board.currentHeuristic);
      launchAnimations(board, success, "weighted");
    } else {
      board.isObject = true;
      success = weightedSearchAlgorithm(board.nodes, board.start, board.object, board.objectNodesToAnimate, board.boardArray, board.currentAlgorithm, board.currentHeuristic);
      launchAnimations(board, success, "weighted", "object", board.currentAlgorithm, board.currentHeuristic);
    }
    board.algoDone = true;
  } else if (unweightedAlgorithms.includes(board.currentAlgorithm)) {
    if (!board.numberOfObjects) {
      success = unweightedSearchAlgorithm(board.nodes, board.start, board.target, board.nodesToAnimate, board.boardArray, board.currentAlgorithm);
      launchAnimations(board, success, "unweighted");
    } else {
      board.isObject = true;
      success = unweightedSearchAlgorithm(board.nodes, board.start, board.object, board.objectNodesToAnimate, board.boardArray, board.currentAlgorithm);
      launchAnimations(board, success, "unweighted", "object", board.currentAlgorithm);
    }
    board.algoDone = true;
  }

  // ⏱️ STOP THE STOPWATCH
  let endTime = performance.now();
  
  // 3. Update the Analytics Dashboard
  updateAnalytics(board, startTime, endTime, success);
}

// Helper function for the dashboard
function updateAnalytics(board, startTime, endTime, success) {
  let timeTaken = (endTime - startTime).toFixed(2);
  let nodesExplored = board.nodesToAnimate.length;
  if (board.objectNodesToAnimate && board.objectNodesToAnimate.length) {
    nodesExplored += board.objectNodesToAnimate.length;
  }

  let pathLength = 0;
  if (success) {
    let currentNode = board.nodes[board.target];
    while (currentNode && currentNode.id !== board.start) {
      pathLength++;
      currentNode = board.nodes[currentNode.previousNode];
    }
  }

  // Display the stats
  document.getElementById("analytics-dashboard").style.display = "block";
  document.getElementById("stat-time").innerText = timeTaken + " ms";
  document.getElementById("stat-explored").innerText = nodesExplored + " nodes";
  document.getElementById("stat-path").innerText = success ? pathLength + " steps" : "No Path Found";
}

module.exports = runAlgorithm;
