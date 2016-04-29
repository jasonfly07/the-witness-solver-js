// This object contains all the information about a puzzle before solving.
// A puzzle consists of a node map and a block map.
// The goal of the puzzle is to find a path from one of the heads to one of the tails,
// while also fulfilling specific requirements in the process.
function Puzzle (numR, numC) {
  if (numR < 2 || numC < 2) {
    throw "Invalid Puzzle dimension";
  } 
  this.nodeRow = numR;
  this.nodeCol = numC;

  // 2 main maps of the puzzle
  this.nodeMap  = new NodeMap(numR, numC);
  this.blockMap = new BlockMap(numR - 1, numC - 1);

  // Heads & tails (starts & goals)
  this.nodeHeads = new HashSet();
  this.nodeTails = new HashSet();

  // Essentials
  this.nodeEssentials = new HashSet();
  this.sideEssentials = new HashSet();

  // Other elements
  this.sideObstacles = new HashSet();
  this.specialBlocks = new Hashtable();
  this.puzzleName = "";

  // Additional flags
  this.hasBlackWhite = false;
  this.hasTetris = false;
};

Puzzle.prototype.print = function () {
  console.log("head:");
  var headStr = "";
  for (e of this.nodeHeads.entries()) {
    headStr = headStr + e[0].toString();
  }
  console.log(headStr);
};

Puzzle.prototype.getNode = function (v) {
  return this.nodeMap.getNode(v);
};
Puzzle.prototype.getBlock = function (v) {
  return this.blockMap.getBlock(v);
};

Puzzle.prototype.validNodeCoord = function (v) {
  return this.nodeMap.validCoord(v);
};
Puzzle.prototype.validBlockCoord = function (v) {
  return this.blockMap.validCoord(v);
};

Puzzle.prototype.addHead = function (v) {
  // Make sure inputNode is not in nodeTails before adding to nodeHeads
  this.nodeTails.remove(v);
  this.nodeHeads.add(v);
}

Puzzle.prototype.addTail = function (v) {
  // Make sure inputNode is not in nodeHeads before adding to nodeTails
  this.nodeHeads.remove(v);
  this.nodeTails.add(v);
}

Puzzle.prototype.addEssentialNode = function (v) {
  this.nodeEssentials.add(v);
}

Puzzle.prototype.addObstacleSide = function (v1, v2) {
  // Make sure inputSide is not in sideEssentials before adding to sideObstacles
  var inputSide = new Side(v1, v2);
  this.sideEssentials.remove(inputSide);
  this.sideObstacles.add(inputSide);
}

Puzzle.prototype.addEssentialSide = function (v1, v2) {
  // Make sure inputSide is not in sideObstacles before adding to sideEssentials
  // If side is already an obstacle, remove it from sideObstacles first
  var inputSide = new Side(v1, v2);
  this.sideObstacles.remove(inputSide);
  this.sideEssentials.add(inputSide);
}

Puzzle.prototype.addSpecialBlock = function (v, type) {
  this.specialBlocks.remove(v);
  this.specialBlocks.put(v, type);  
}

Puzzle.prototype.checkBlackWhite = function () {
  for (r = 0; r < this.blockMap.numRow; r++) {
    for (c = 0; c < this.blockMap.numCol; c++) {
      var currBlock = this.getBlock(new Vector2(r, c));
      if ((currBlock.blockType == BlockType.Black) || (currBlock.blockType == BlockType.White)) {
        return true;
      }
    }
  }
  return false;
}

Puzzle.prototype.checkTetris = function () {
  for (r = 0; r < this.blockMap.numRow; r++) {
    for (c = 0; c < this.blockMap.numCol; c++) {
      var currBlock = this.getBlock(new Vector2(r, c));
      if (currBlock.blockType >= 3) {
        return true;
      }
    }
  }
  return false;
}

Puzzle.prototype.convertBlackWhiteToEssentialSides = function () {
  // For every block [r, c], process the sides (if valid):
  // 1. between [r, c] and [r, c + 1]
  // 2. between [r, c] and [r + 1, c]
  for (r = 0; r < this.blockMap.numRow; r++) {
    for (c = 0; c < this.blockMap.numCol; c++) {
      var currBlock = this.getBlock(new Vector2(r, c));

      // 1. [r, c + 1]
      if (this.validBlockCoord(new Vector2(r, c + 1))) {
        var rightBlock = this.getBlock(new Vector2(r, c + 1));
        if ((currBlock.blockType == BlockType.White && rightBlock.blockType == BlockType.Black) ||
            (currBlock.blockType == BlockType.Black && rightBlock.blockType == BlockType.White)) {
          this.addEssentialSide(new Vector2(r, c + 1), new Vector2(r + 1, c + 1));
        }
      }

      // 2. [r + 1, c]
      if (this.validBlockCoord(new Vector2(r + 1, c))) {
        var bottomBlock = this.getBlock(new Vector2(r + 1, c));
        if ((currBlock.blockType == BlockType.White && bottomBlock.blockType == BlockType.Black) ||
            (currBlock.blockType == BlockType.Black && bottomBlock.blockType == BlockType.White)) {
          this.addEssentialSide(new Vector2(r + 1, c), new Vector2(r + 1, c + 1));
        }
      }
    }
  }
}

Puzzle.prototype.regenerate = function () {
  // Set heads & tails
  for (e of this.nodeHeads.entries()) {
    this.getNode(e[0]).isHead = true;
  }
  for (e of this.nodeTails.entries()) {
    this.getNode(e[0]).isTail = true;
  }

  // Set essentials
  for (e of this.nodeEssentials.entries()) {
    this.getNode(e[0]).isEssential = true;
  }

  // Set obstacles
  for (e of this.sideObstacles.entries()) {
    this.nodeMap.cutTie(e[0].vec1, e[1].vec2);
  }

  // Set blocks
  var specialBlocks = this.specialBlocks.entries();
  for (e of specialBlocks) {
    this.blockMap.setType(e[0], e[1]);
  }

  // Check if there are black & white blocks
  // If yes, dump all sides that touch B & W on both sides to sideEssentials
  this.hasBlackWhite = this.checkBlackWhite();
  if (this.hasBlackWhite) {
    this.convertBlackWhiteToEssentialSides();
  }

  // Check if there are tetris blocks
  this.hasTetris = this.checkTetris();
}
