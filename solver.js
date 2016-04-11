$(document).ready(function() {
  UnitTest();
  Main();
  
});

var Main = function() {
  puzzleSimpleMaze0();
  puzzleSimpleMaze1();
  PuzzleEssential1();
  PuzzleEssential2();
  
  console.log("Complete");
} 

// Utility for run solver and profiling
var solvePuzzle = function(p) {
  var t0 = performance.now();
  var ps = new PuzzleSolver(p, 1);
  ps.solve();
  var t1 = performance.now();
  console.log("Computation time = " + (t1 - t0) + " ms");
  console.log("solution = ", ps.paths[0].toString());
}

var puzzleSimpleMaze0 = function() {
  var p = new Puzzle(2, 2);
  p.puzzleName = "PuzzleSimpleMaze0";
  p.addHead(new Vector2(1, 0));
  p.addTail(new Vector2(0, 1));
  p.regenerate();

  solvePuzzle(p);
}

var puzzleSimpleMaze1 = function() {
  var p = new Puzzle(5, 4);
  p.puzzleName = "PuzzleSimpleMaze1";
  p.addHead(new Vector2(4, 0));
  p.addTail(new Vector2(0, 3));
  p.addObstacleSide(new Vector2(3, 0), new Vector2(4, 0));
  p.addObstacleSide(new Vector2(3, 1), new Vector2(4, 1));
  p.addObstacleSide(new Vector2(1, 1), new Vector2(2, 1));
  p.addObstacleSide(new Vector2(1, 2), new Vector2(2, 2));
  p.addObstacleSide(new Vector2(1, 3), new Vector2(2, 3));
  p.addObstacleSide(new Vector2(0, 2), new Vector2(1, 2));
  p.addObstacleSide(new Vector2(0, 2), new Vector2(0, 3));
  p.addObstacleSide(new Vector2(0, 0), new Vector2(0, 1));
  p.regenerate();

  solvePuzzle(p);
}

// Maze with essential nodes
var PuzzleEssential1 = function() {
  var p = new Puzzle(4, 4);
  p.puzzleName = "PuzzleEssential1";
  p.addHead(new Vector2(1, 1));
  p.addHead(new Vector2(2, 2));
  p.addTail(new Vector2(1, 0));
  p.addObstacleSide(new Vector2(0, 0), new Vector2(0, 1));
  p.addObstacleSide(new Vector2(0, 0), new Vector2(1, 0));
  p.addObstacleSide(new Vector2(1, 2), new Vector2(1, 3));
  p.addObstacleSide(new Vector2(2, 2), new Vector2(3, 2));
  p.addEssentialNode(new Vector2(2, 0));
  p.addEssentialNode(new Vector2(2, 1));
  p.addEssentialNode(new Vector2(0, 1));
  p.addEssentialNode(new Vector2(1, 2));
  p.addEssentialNode(new Vector2(1, 3));
  p.addEssentialNode(new Vector2(3, 3));
  p.regenerate();

  solvePuzzle(p);
}

// Maze with essential nodes
var PuzzleEssential2 = function() {
  var p = new Puzzle(5, 5);
  p.puzzleName = "PuzzleEssential2";
  p.addHead(new Vector2(2, 2));
  p.addTail(new Vector2(0, 4));
  for (r = 0; r < 5; r++) {
    for (c = 0; c < 5; c++) {
      p.addEssentialNode(new Vector2(r, c));
    }
  }
  p.regenerate();

  solvePuzzle(p);
}
