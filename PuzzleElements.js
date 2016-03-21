function Node (r, c) {
  this.coord = new Vector2(r || 0, c || 0);
  this.neighborOffsets = [];
  this.isEssential = false;
  this.isHead = false;
  this.isTail = false;
  this.onEdge = false;
};

Node.prototype.getNeighborCoords = function () {
  var neighborCoords = [];
  for (i = 0; i < this.neighborOffsets.length; i++) {
    var offset = this.neighborOffsets[i];
    neighborCoords.push(this.coord.add(offset));
  }
  return neighborCoords;
};