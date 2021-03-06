//// BlockMap
function BlockMap (i0, i1) {
  if (typeof i0 === "number" && typeof i1 === "number") {
    var numR = i0;
    var numC = i1;
    if (numR < 1 || numC < 1) {
      throw "Invalid BlockMap dimension";
    } 
    this.numRow = numR;
    this.numCol = numC;
    this.blockMatrix = [];
    for (r = 0; r < this.numRow; r++) {
      var newRow = [];
      for (c = 0; c < this.numCol; c++) {
        newRow.push(new Block(new Vector2(r, c)));
      }
      this.blockMatrix.push(newRow);
    }
    this.resetConnectivity();
  }
  // copy constructor
  else if (i0.constructor.name === "BlockMap") {
    var orig = i0;
    this.numRow = orig.numRow;
    this.numCol = orig.numCol;
    this.blockMatrix = [];
    for (r = 0; r < this.numRow; r++) {
      var newRow = [];
      for (c = 0; c < this.numCol; c++) {
        newRow.push(new Block(orig.blockMatrix[r][c]));
      }
      this.blockMatrix.push(newRow);
    }
  }
};

BlockMap.prototype.validCoord = function (v) {
  return (v.r >= 0 && v.r < this.numRow && v.c >= 0 && v.c < this.numCol);
};

BlockMap.prototype.getBlock = function (v) {
  if (!this.validCoord(v)) {
    throw "Invalid input";
  }
  return this.blockMatrix[v.r][v.c];
};

BlockMap.prototype.resetConnectivity = function () {
  for (r = 0; r < this.numRow; r++) {
    for (c = 0; c < this.numCol; c++) {
      var currBlock = this.blockMatrix[r][c];
      currBlock.neighborOffsets.clear();
      var lOffset = new Vector2( 0, -1);
      var rOffset = new Vector2( 0,  1);
      var tOffset = new Vector2(-1,  0);
      var bOffset = new Vector2( 1,  0);

      var lCoord = currBlock.coord.add(lOffset);
      if (this.validCoord(lCoord)) currBlock.neighborOffsets.add(lOffset);
      var rCoord = currBlock.coord.add(rOffset);
      if (this.validCoord(rCoord)) currBlock.neighborOffsets.add(rOffset);
      var tCoord = currBlock.coord.add(tOffset);
      if (this.validCoord(tCoord)) currBlock.neighborOffsets.add(tOffset);
      var bCoord = currBlock.coord.add(bOffset);
      if (this.validCoord(bCoord)) currBlock.neighborOffsets.add(bOffset);
    }
  }
};

BlockMap.prototype.setType = function (v, type) {
  this.getBlock(v).blockType = type;
}

BlockMap.prototype.cutTie = function (v1, v2) {
  // Check if block1 & block2 are adjacent
  if (v1.distTo(v2) != 1) {
    return;
  }
  var block1 = this.getBlock(v1);
  var block2 = this.getBlock(v2);

  var offset1to2 = block2.coord.sub(block1.coord);
  block1.neighborOffsets.remove(offset1to2);

  var offset2to1 = block1.coord.sub(block2.coord);
  block2.neighborOffsets.remove(offset2to1);
}

BlockMap.prototype.segment = function (v) {
  var blockStack = [];
  var seed = this.getBlock(v);
  seed.visited = true;
  blockStack.push(seed);

  var segment = new HashSet();
  while(blockStack.length != 0) {
    var currBlock = blockStack.pop();
    segment.add(currBlock.coord);
    for (e of currBlock.getNeighborCoords().entries()) {
      var neighborCoord = e[0];
      var neighbor = this.getBlock(neighborCoord);
      if (!neighbor.visited) {
        neighbor.visited = true;
        blockStack.push(neighbor);
      }
    }
  } 
  return segment;
}
