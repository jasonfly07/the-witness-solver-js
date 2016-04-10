// A path object is used by the solver to record the history of searching
// It contains all node visited, essential node counts, etc.
function Path (puzzle) {
  this.puzzle = puzzle;
  this.path = [];
  this.blockMap = puzzle.blockMap.clone();

  this.touchCount = 0;
  this.leaveCount = 0;
  this.missedTailCount = 0;
  this.segmenting = false;

  this.visitedNodes = new HashSet();
  this.visitedTails = new HashSet();
  this.visitedSides = new HashSet();
  this.visitedEssentialNodes = new HashSet();
};

Path.prototype.toString = function () {
  var pathStr = "";
  for (i = 0; i < this.path.length; i++) {
    pathStr = pathStr + this.path[i].toString();
  }
  return pathStr;
}

Path.prototype.clone = function () {
  var copy = new Path(this.puzzle);
  for (i = 0; i < this.path.length; i++) {
    copy.path.push(this.path[i]);
  }
  copy.blockMap = this.blockMap.clone();

  copy.touchCount = this.touchCount;
  copy.leaveCount = this.leaveCount;
  copy.missedTailCount = this.missedTailCount;
  copy.segmenting = this.segmenting;

  copy.visitedNodes = this.visitedNodes.clone();
  copy.visitedTails = this.visitedTails.clone();
  copy.visitedSides = this.visitedSides.clone();
  copy.visitedEssentialNodes = this.visitedEssentialNodes.clone();

  return copy;
}

Path.prototype.hasCollectedAllEssentialNodes = function () {
  return this.puzzle.nodeEssentials.size() == this.visitedEssentialNodes.size();
}

Path.prototype.hasTailLeft = function () {
  return (this.puzzle.nodeTails.size() == this.visitedTails.size()) ? false : true;
}

// Shortcut for accessing the last node in the path
// TODO: make sure it's available
Path.prototype.prevNode = function () {
  var prevCoord = this.path[this.path.length - 1];
  return this.puzzle.getNode(prevCoord);
}

Path.prototype.cutBlockTie = function (v1, v2) {
  // No need to proceed if side is on the border
  if (v1.r == 0 && v2.r == 0) return;
  if (v1.c == 0 && v2.c == 0) return;
  if (v1.r == this.puzzle.nodeRow - 1 && v2.r == this.puzzle.nodeRow - 1) return;
  if (v1.c == this.puzzle.nodeCol - 1 && v2.c == this.puzzle.nodeCol - 1) return;

  // Case 1: side is vertical
  if (v1.c == v2.c) {
    var R = Math.min(v1.r, v2.r);
    var C = v1.c;
    this.blockMap.cutTie(new Vector2(R, C - 1), new Vector2(R, C));
  }
  // Case 2: side is horizontal
  else if (v1.r == v2.r) {
    var R = v1.r;
    var C = Math.min(v1.c, v2.c);
    this.blockMap.cutTie(new Vector2(R - 1, C), new Vector2(R, C));
  }  
}

Path.prototype.evaluateSegment = function (segment) {
  // Are there black & white blocks mixed together?
  // If yes, return false immediately
  if (this.puzzle.hasBlackWhite) {
    var hasWhite = false;
    var hasBlack = false;
    for (v of segment.values()) {
      var block = this.blockMap.getBlock(v);
      if (block.blockType == BlockType.White) hasWhite = true;
      if (block.blockType == BlockType.Black) hasBlack = true;
      if (hasWhite && hasBlack) return false;
    }
  }

  // Find all the unvisited nodes in segment
  if (this.puzzle.nodeEssentials.size() > 0) {
    var unvisitedNodes = new HashSet();
    var offsets = new HashSet();
    offsets.add(new Vector2(0, 0));
    offsets.add(new Vector2(0, 1));
    offsets.add(new Vector2(1, 1));
    offsets.add(new Vector2(1, 0));
    for (v of segment.values()) {
      for (o of offsets.values()) {
        var nodeCoord = v.add(o);
        if (!this.visitedNodes.contains(nodeCoord)) {
          unvisitedNodes.add(nodeCoord);
        }
      }
    }

    // Are there unvisited essential nodes?
    // If yes, return false immediately
    for (v of unvisitedNodes.values()) {
      if (this.puzzle.getNode(v).isEssential) {
        return false;
      }
    }
  }

  // Find all the unvisited sides in segment
  if (this.puzzle.sideEssentials.size() > 0) {
    var unvisitedSides = new HashSet();
    for (v of segment.values()) {
      var corner1 = v.add(new Vector2(0, 0));
      var corner2 = v.add(new Vector2(0, 1));
      var corner3 = v.add(new Vector2(1, 1));
      var corner4 = v.add(new Vector2(1, 0));
      var sides = new HashSet();
      sides.add(new Side(corner1, corner2));
      sides.add(new Side(corner2, corner3));
      sides.add(new Side(corner3, corner4));
      sides.add(new Side(corner4, corner1));
      for (s of sides.values()) {
        if (!this.visitedSides.contains(s)) {
          unvisitedSides.add(s.clone()); // clone() probably isn't necessary
        }
      }
    }

    // Are there unvisited essential sides?
    // If yes, return false immediately
    for (s of unvisitedSides.values()) {
      if (this.puzzle.essentialSides.contains(s)) {
        return false;
      }
    }
  }

  // TODO: tetris

  // Return true if it survives all the way to the end
  return true;
}

Path.prototype.addNode = function (v) {
  var node = this.puzzle.getNode(v);

  // The first node HAS to be a head
  if (this.path.length == 0 && !node.isHead) {
    throw "First node has to be a head.";
  }

  // There're 2 cases at start: head is on edge & not on edge
  // if the head is on edge, set touchCount to 1
  if (this.path.length == 0 && node.isHead && node.onEdge) {
    this.touchCount = 1;
  }

  // If leaveCount >= 1, and touchCount = leaveCount + 1
  // in the next step, a segment will be created
  if (this.segmenting && this.leaveCount >= 1 && this.touchCount == this.leaveCount + 1) {
    this.segmenting = true;

    // Compute the node coord that's on the opposite side of the current step
    var currCoord = node.coord;
    var prevCoord = this.prevNode().coord;
    var oppositeCoord = prevCoord.mul(2).sub(currCoord);

    // The block for seeding the segment will touch the side formed by prevCoord & oppositeCoord
    var seedBlockCoord;
    var seedSide = new Side(prevCoord, oppositeCoord);
    if (seedSide.isHorizontal()) {
      if (seedSide.vec1.r == 0) {
        seedBlockCoord = seedSide.vec1;
      }
      else {
        seedBlockCoord = seedSide.vec1.sub(new Vector2(1, 0));
      }
    }
    else {
      if (seedSide.vec1.c == 0) {
        seedBlockCoord = seedSide.vec1;
      }
      else {
        seedBlockCoord = seedSide.vec1.sub(new Vector2(0, 1));
      }
    }

    // Perform segmentation with the seed
    var segment = this.blockMap.segment(seedBlockCoord);

    // Evalute this segment
    var validPath = this.evaluateSegment(segment);
    if (!validPath) return false;
  }

  // Cut the tie between 2 blocks if necessary
  if (this.path.length > 0) {
    this.cutBlockTie(node.coord, this.prevNode().coord);
  }

  // See if this step is leaving the edge
  if (this.path.length > 0) {
    if (!node.onEdge && this.prevNode().onEdge) {
      this.leaveCount++;
      this.segmenting = true;
    }
  }

  // See if this step is touching the edge
  if (this.path.length > 0) {
    if (node.onEdge && !this.prevNode().onEdge) {
      this.touchCount++;
    }
  }

  // Finally, insert the node into relevant containers
  this.visitedNodes.add(v);
  if (this.path.length > 0) {
    this.visitedSides.add(new Side(v, this.prevNode().coord));
  }
  this.path.push(v);
  if (node.isEssential) {
    this.visitedEssentialNodes.add(v);
  }
  if (node.isTail) {
    this.visitedTails.add(v);
  }
  return true;
}

// Deal with all unprocessed segments.
// Once reaching a tail, a path would have either 1 or 2 unprocessed segments;
// this method is for cleaning them up.
// Don't run this until reaching a tail.
Path.prototype.processRemainingSegments = function () {
  // Look for unvisited block
  for (r = 0; r < this.blockMap.numRow; r++) {
    for (c = 0; c < this.blockMap.numCol; c++) {
      var blockCoord = new Vector2(r, c);
      var block = this.blockMap.getBlock(blockCoord);
      // Once found, form a segment & evaluate it
      if (!block.visited) {
        var segment = this.blockMap.segment(blockCoord);
        var currResult = this.evaluateSegment(segment);
        if (!currResult) return false;
      }
    }
  }
  return true;
}
