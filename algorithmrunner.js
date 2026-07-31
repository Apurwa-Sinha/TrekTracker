const weightedSearchAlgorithm = require('./weightedSearchAlgorithm');
const unweightedSearchAlgorithm = require('./unweightedSearchAlgorithm');
const bidirectional = require('./bidirectional');
const launchAnimations = require('./launchAnimations');

function runAlgorithm(board) {
  if (!board.currentAlgorithm) {
    document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>';
    return;
  }

  board.clearPath("clickedButton");
  board.toggleButtons();

  let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
  let unweightedAlgorithms = ["dfs", "bfs"];
  let success;

  let startTime = performance.now();

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

  let endTime = performance.now();
  updateAnalytics(board, startTime, endTime, success);
}

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

  document.getElementById("analytics-dashboard").style.display = "block";
  document.getElementById("stat-time").innerText = timeTaken + " ms";
  document.getElementById("stat-explored").innerText = nodesExplored + " nodes";
  document.getElementById("stat-path").innerText = success ? pathLength + " steps" : "No Path Found";
}

module.exports = runAlgorithm;


