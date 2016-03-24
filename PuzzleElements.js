//// Node
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

//// BlockType
var BlockType = {
  // Default
  Empty : 0,

  // Black & white separation
  White : 1,
  Black : 2,

  // Tetris (Oriented)
  // Angles are counter-clockwise
  // TODO: all BlockTypes >= 3 are tetris for now;
  // this is subject to change when more  non-tetris types are added
  Square1x1 : 3, Square2x2 : 4,
  Line1x2 : 5, Line2x1 : 6,
  Line1x3 : 7, Line3x1 : 8,
  Line1x4 : 9, Line4x1 : 10,
  L2x2_0 : 11, L2x2_90 : 12, L2x2_180 : 13, L2x2_270 : 14,
  L3x2_0 : 15, L3x2_90 : 16, L3x2_180 : 17, L3x2_270 : 18,
  L2x3_0 : 19, L2x3_90 : 20, L2x3_180 : 21, L2x3_270 : 22,
};

//// Block
function Block (r, c) {
  this.coord = new Vector2(r || 0, c || 0);
  this.neighborOffsets = [];
  this.blockType = BlockType.Empty;
  this.visited = false;
};

Block.prototype.getNeighborCoords = function () {
  var neighborCoords = [];
  for (i = 0; i < this.neighborOffsets.length; i++) {
    var offset = this.neighborOffsets[i];
    neighborCoords.push(this.coord.add(offset));
  }
  return neighborCoords;
};

//// Side
function Side (v1, v2) {
  if (v1.distTo(v2) != 1) {
    throw "Invalid side input";
  }

  if (v1.r < v2.r) {
    this.vec1 = v1;
    this.vec2 = v2;
  }
  else if (v1.r == v2.r) {
    if (v1.c <= v2.c) {
      this.vec1 = v1;
      this.vec2 = v2;
    }
    else {
      this.vec1 = v2;
      this.vec2 = v1;
    }
  }
  else {
    this.vec1 = v2;
    this.vec2 = v1;
  }
};

// The side is vertical if not horizontal
Side.prototype.isHorizontal = function () {
  return (this.vec1.r == this.vec2.r) ? true : false;
};

Side.prototype.equal = function (other) {
  return (this.vec1.equal(other.vec1) && this.vec2.equal(other.vec2)) ? true : false;
};
