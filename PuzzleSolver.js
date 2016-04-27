function PuzzleSolver (puzzle, maxNumOutput) {
  this.puzzle = puzzle;
  this.maxNumOutput = maxNumOutput;
  this.paths = [];
};

PuzzleSolver.prototype.solve = function () {
  // Clear the solution container
  this.paths.length = 0;

  // Create the priority queue for A-star
  var pathPQ = new PriorityQueue({ comparator: function(pa, pb) { return pa.cost() - pb.cost(); }});
  var nodeHeads = this.puzzle.nodeHeads.values();
  for (v of nodeHeads) {
    var path = new Path(this.puzzle);
    path.addNode(v);
    pathPQ.queue(path);
  }

  // Perform A-star
  while (pathPQ.length != 0) {
    var currPath = pathPQ.dequeue();

    // Debugging
    // currPath.print();
    // console.log("cost", currPath.costG(), currPath.costH());

    // Perform additional evaluation if the current path has reached a goal (tail)
    if (currPath.prevNode().isTail) {

      // Make a copy, since a path can still continue exploring after reaching a tail
      var endPath = currPath.clone();

      // At this point there would be 1 - 2 unprocessed segments.
      // Find them and process them.
      var validEndPath = endPath.processRemainingSegments();

      if (validEndPath) {
        // Additional essential nodes evaluation
        if (this.puzzle.nodeEssentials.size() > 0) {
          // Give up on this path if it has insufficient essential node count
          if (!endPath.hasCollectedAllEssentialNodes()) {
            continue;
          }
        }

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

    // Heuristic:
    // There're at most 3 unvisited neighbors, so 3 sides to explore
    // If none of them are essential sides, proceed as usual
    // If 1 of them is an (unvisited) essential side, we HAVE to take it
    // (otherwise there's no chance of stepping on it later)
    // If 2 or 3 of them are (unvisited) essential sides, this path is screwed
    var currEssentialSideCount = 0;
    var currNode = currPath.prevNode();
    var currNodeNeighborCoords = currNode.getNeighborCoords().values();
    for (v of currNodeNeighborCoords) {
      if (!currPath.visitedNodes.contains(v)) {
        if (this.puzzle.sideEssentials.contains(new Side(currNode.coord, v))) {
          currEssentialSideCount++;
        }
      }
    }

    if (currEssentialSideCount == 0) {
      for (v of currNodeNeighborCoords) {
        if (!currPath.visitedNodes.contains(v)) {
          var newPath = currPath.clone();
          var isValid = newPath.addNode(v);
          if (isValid) {
            pathPQ.queue(newPath);
          }
        }
      }
    }
    else if (currEssentialSideCount == 1) {
      for (v of currNodeNeighborCoords) {
        if (!currPath.visitedNodes.contains(v)) {
          if (this.puzzle.sideEssentials.contains(new Side(currNode.coord, v))) {
            var newPath = currPath.clone();
            var isValid = newPath.addNode(v);
            if (isValid) {
              pathPQ.queue(newPath);
            }
          }
        }
      }
    }
    else {
      // If currEssentialSideCount > 1, do nothing
    }

  }
};
