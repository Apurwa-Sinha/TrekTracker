function simpleDemonstration(board) {
  let currentIdY = board.width - 10;
  let centerY = Math.floor(board.height / 2);
  
  // 1. Do the center node once
  let centerId = `${centerY}-${currentIdY}`;
  let centerElement = document.getElementById(centerId);
  board.wallsToAnimate.push(centerElement);
  board.nodes[centerId].status = "wall";
  board.nodes[centerId].weight = 0;

  // 2. Loop from 1 to 6 to do the top and bottom nodes
  for (let counter = 1; counter < 7; counter++) {
    let currentIdXOne = centerY - counter;
    let currentIdXTwo = centerY + counter;
    
    let currentIdOne = `${currentIdXOne}-${currentIdY}`;
    let currentIdTwo = `${currentIdXTwo}-${currentIdY}`;
    
    let currentElementOne = document.getElementById(currentIdOne);
    let currentElementTwo = document.getElementById(currentIdTwo);
    
    board.wallsToAnimate.push(currentElementOne);
    board.wallsToAnimate.push(currentElementTwo);
    
    let currentNodeOne = board.nodes[currentIdOne];
    let currentNodeTwo = board.nodes[currentIdTwo];
    
    currentNodeOne.status = "wall";
    currentNodeOne.weight = 0;
    currentNodeTwo.status = "wall";
    currentNodeTwo.weight = 0;
  }
}

module.exports = simpleDemonstration;
