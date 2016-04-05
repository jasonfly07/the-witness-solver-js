//// NodeMap
function NodeMap (numR, numC) {
  if (numR < 1 || numC < 1) {
    throw "Invalid NodeMap dimension";
  }
  this.numRow = numR;
  this.numCol = numC;

  this.nodeMatrix = [];
  for (r = 0; r < this.numRow; r++) {
    var newRow = [];
    for (c = 0; c < this.numCol; c++) {
      newRow.push(new Node(new Vector2(r, c)));
    }
    this.nodeMatrix.push(newRow);
  }

  this.resetConnectivity();
};

NodeMap.prototype.validCoord = function (v) {
  return (v.r >= 0 && v.r < this.numRow && v.c >= 0 && v.c < this.numCol);
};

NodeMap.prototype.getNode = function (v) {
  if (!this.validCoord(v)) {
    throw "Invalid input";
  }
  return this.nodeMatrix[v.r][v.c];
};

NodeMap.prototype.resetConnectivity = function () {
  for (r = 0; r < this.numRow; r++) {
    for (c = 0; c < this.numCol; c++) {
      var currNode = this.nodeMatrix[r][c];
      currNode.neighborOffsets.clear();
      var lOffset = new Vector2( 0, -1);
      var rOffset = new Vector2( 0,  1);
      var tOffset = new Vector2(-1,  0);
      var bOffset = new Vector2( 1,  0);

      var lCoord = currNode.coord.add(lOffset);
      if (this.validCoord(lCoord)) currNode.neighborOffsets.add(lOffset);
      var rCoord = currNode.coord.add(rOffset);
      if (this.validCoord(rCoord)) currNode.neighborOffsets.add(rOffset);
      var tCoord = currNode.coord.add(tOffset);
      if (this.validCoord(tCoord)) currNode.neighborOffsets.add(tOffset);
      var bCoord = currNode.coord.add(bOffset);
      if (this.validCoord(bCoord)) currNode.neighborOffsets.add(bOffset);
    }
  }
};

NodeMap.prototype.addEssential = function (v) {
  var node = this.getNode(v);
  node.isEssential = true;
}

NodeMap.prototype.isOnEdge = function (v) {
  return (v.r == 0 || v.c == 0 || v.r == (this.numRow - 1) || v.c == (this.numCol - 1)) ? true : false;
}

NodeMap.prototype.cutTie = function (v1, v2) {
  // Check if v1 & v2 are adjacent
  if (v1.distTo(v2) != 1) {
    return;
  }
  var node1 = this.getNode(v1);
  var node2 = this.getNode(v2);

  var offset1to2 = node2.coord.sub(node1.coord);
  node1.neighborOffsets.remove(offset1to2);

  var offset2to1 = node1.coord.sub(node2.coord);
  node2.neighborOffsets.remove(offset2to1);
}
