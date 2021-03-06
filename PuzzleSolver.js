function PuzzleSolver (puzzle, maxNumOutput) {
  this.puzzle = puzzle;
  this.maxNumOutput = maxNumOutput;
  this.paths = [];

  // Create the priority queue for A-star
  this.pathPQ = new PriorityQueue({ 
    comparator: function(pa, pb) { return (pa.costG + pa.costH) - (pb.costG + pb.costH); }
  });
};

PuzzleSolver.prototype.initialize = function () {
  // Clear containers
  this.paths.length = 0;
  this.pathPQ.clear();

  // Seed the priority queue
  for (e of this.puzzle.nodeHeads.entries()) {
    var path = new Path(this.puzzle);
    path.addNode(e[0]);
    this.pathPQ.queue(path);
  }
}

PuzzleSolver.prototype.expand = function (currPath) {
  // Heuristic:
  // There're at most 3 unvisited neighbors, so 3 sides to explore
  // If none of them are essential sides, proceed as usual
  // If 1 of them is an (unvisited) essential side, we HAVE to take it
  // (otherwise there's no chance of stepping on it later)
  // If 2 or 3 of them are (unvisited) essential sides, this path is screwed
  var currEssentialSideCount = 0;
  var currNode = currPath.prevNode();
  for (e of currNode.getNeighborCoords().entries()) {
    if (!currPath.visitedNodes.contains(e[0])) {
      if (this.puzzle.sideEssentials.contains(new Side(currNode.coord, e[0]))) {
        currEssentialSideCount++;
      }
    }
  }

  if (currEssentialSideCount == 0) {
    for (e of currNode.getNeighborCoords().entries()) {
      if (!currPath.visitedNodes.contains(e[0])) {
        var newPath = new Path(currPath);
        var isValid = newPath.addNode(e[0]);
        if (isValid) {
          this.pathPQ.queue(newPath);
        }
      }
    }
  }
  else if (currEssentialSideCount == 1) {
    for (e of currNode.getNeighborCoords().entries()) {
      if (!currPath.visitedNodes.contains(e[0])) {
        if (this.puzzle.sideEssentials.contains(new Side(currNode.coord, e[0]))) {
          var newPath = new Path(currPath);
          var isValid = newPath.addNode(e[0]);
          if (isValid) {
            this.pathPQ.queue(newPath);
          }
        }
      }
    }
  }
  else {
    // If currEssentialSideCount > 1, do nothing
  }
}

PuzzleSolver.prototype.solve = function () {
  this.initialize();

  // Perform A-star
  while (this.pathPQ.length != 0) {
    var currPath = this.pathPQ.dequeue();

    // currPath.print();
    // console.log("cost", currPath.costG, currPath.costH);

    // Has it reached a tail?
    if (currPath.prevNode().isTail) {

      // Make a copy, since a path can still continue exploring after reaching a tail
      var endPath = new Path(currPath);

      // At this point there would be 1 - 2 unprocessed segments.
      // Find them and process them.
      var validEndPath = endPath.processRemainingSegments();

      if (validEndPath) {

        // If currPath survives all the checks above, include it in this.paths
        this.paths.push(endPath);
        if (this.paths.length == this.maxNumOutput) {
          return;
        }
      }
    }

    // If the current path has no exit left, there's no need to further explore it
    if (!currPath.hasTailLeft()) {
      continue;
    }

    // Continue the search
    this.expand(currPath);
  }
};
