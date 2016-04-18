$(document).ready(function() {
  UnitTest();
  // Main();

  var numRow = 2;
  var numCol = 2;

  // Get row & col
  $('#btn-row .dropdown-menu li').on('click', function(){
    numRow = parseInt($(this).text());
    $("#btn-row .btn:first-child").text("Row : " + $(this).text());
  });
  $('#btn-col .dropdown-menu li').on('click', function(){
    numCol = parseInt($(this).text());
    $("#btn-col .btn:first-child").text("Col : " + $(this).text());
  });

  $('#buttonRun').click(function() {
    var pw = document.getElementsByClassName("puzzle-window")[0];
    var pwSide  = parseInt(getComputedStyle(pw).getPropertyValue("height").split("p")[0]);
    var pwMargin  = pwSide * 0.125;
    var pathWidth = pwSide * 0.05;
    var pathHalf  = pathWidth * 0.5;

    // Compute the block size and height & width
    var blockSide = (pwSide - (pwMargin * 2)) / (Math.max(numRow, numCol) - 1) - pathWidth;
    var puzzleHeight = blockSide * (numRow - 1) + pathWidth * numRow;
    var puzzleWidth  = blockSide * (numCol - 1) + pathWidth * numCol;

    // Compute margin lengths
    var vertMarginHeight = (pwSide - puzzleHeight) / 2;
    var horiMarginHeight = puzzleHeight;
    var horiMarginWidth  = (pwSide - puzzleWidth) / 2;

    // Set vertical margins
    var vertMargins = document.getElementsByClassName("puzzle-vert-margin");
    for (i = 0; i < vertMargins.length; i++) {
      vertMargins[i].style.height = String(vertMarginHeight) + "px";
    }

    // Set mid window
    var windowMid = document.getElementsByClassName("puzzle-window-mid")[0];
    windowMid.style.height = String(horiMarginHeight) + "px";

    // Set horizontal margins
    var horiMargins = document.getElementsByClassName("puzzle-hori-margin");
    for (i = 0; i < horiMargins.length; i++) {
      horiMargins[i].style.width  = String(horiMarginWidth) + "px";
      horiMargins[i].style.height = String(horiMarginHeight) + "px";
    }

    // Set puzzle body
    var puzzleBody = document.getElementsByClassName("puzzle-body")[0];
    puzzleBody.style.width  = String(puzzleWidth) + "px";
    puzzleBody.style.height = String(puzzleHeight) + "px";

    // Clear everything inside puzzleBody
    while (puzzleBody.firstChild) {
      puzzleBody.removeChild(puzzleBody.firstChild);
    }

    // Set puzzleRowThin & puzzleRowFat
    for (r = 0; r < numRow; r++) {
      var puzzleRowThin = document.createElement("div");
      puzzleRowThin.className    = "puzzle-row-thin";
      puzzleRowThin.style.width  = String(puzzleWidth) + "px";
      puzzleRowThin.style.height = String(pathWidth) + "px";
      puzzleBody.appendChild(puzzleRowThin);

      // For each puzzleRowThin, pupulate with puzzleNode & puzzleSideHori
      for (c = 0; c < numCol; c++) {
        var puzzleNode = document.createElement('div');
        puzzleNode.id = "n-" + String(r) + "-" + String(c);
        puzzleNode.className = 'puzzle-node';
        puzzleNode.style.width  = String(pathWidth) + "px";
        puzzleNode.style.height = String(pathWidth) + "px";
        puzzleRowThin.appendChild(puzzleNode);

        if (c != numCol - 1) {
          var puzzleSideHori = document.createElement('div');
          puzzleSideHori.id = "s-" + String(r) + "-" + String(c) + "-" + String(r) + "-" + String(c + 1);
          puzzleSideHori.className = 'puzzle-side-hori';
          puzzleSideHori.style.width  = String(blockSide) + "px";
          puzzleSideHori.style.height = String(pathWidth) + "px";
          puzzleRowThin.appendChild(puzzleSideHori);
        }
      }

      if (r != numRow - 1) {
        var puzzleRowFat = document.createElement("div");
        puzzleRowFat.className    = "puzzle-row-fat";
        puzzleRowFat.style.width  = String(puzzleWidth) + "px";
        puzzleRowFat.style.height = String(blockSide) + "px";
        puzzleBody.appendChild(puzzleRowFat);

        // For each puzzleRowFat, pupulate with puzzleBlock & puzzleSideVert
        for (c = 0; c < numCol; c++) {
          var puzzleSideVert = document.createElement('div');
          puzzleSideVert.id = "s-" + String(r) + "-" + String(c) + "-" + String(r + 1) + "-" + String(c);
          puzzleSideVert.className = 'puzzle-side-vert';
          puzzleSideVert.style.width  = String(pathWidth) + "px";
          puzzleSideVert.style.height = String(blockSide) + "px";
          puzzleRowFat.appendChild(puzzleSideVert);

          if (c != numCol - 1) {
            var puzzleBlock = document.createElement('div');
            puzzleBlock.id = "b-" + String(r) + "-" + String(c);
            puzzleBlock.className = 'puzzle-block';
            puzzleBlock.style.width  = String(blockSide) + "px";
            puzzleBlock.style.height = String(blockSide) + "px";
            puzzleRowFat.appendChild(puzzleBlock);
          }
        }
      }
    }


  });





});

var Main = function() {
  // puzzleSimpleMaze0();
  // puzzleSimpleMaze1();
  // PuzzleEssential1();
  // PuzzleEssential2(); // expensive

  // PuzzleBW1();
  // PuzzleBW2();
  // PuzzleBW3();
  // PuzzleBW4();
  // PuzzleBW5();
  
  // PuzzleEssentialBW1(); // very expensive

  // PuzzleTetrisOriented1();
  // PuzzleTetrisOriented2();
  // PuzzleTetrisOriented3();
  // PuzzleTetrisOriented4();
  // PuzzleTetrisOriented5();
} 

// Utility for run solver and profiling
var solvePuzzle = function (p) {
  var t0 = performance.now();
  var ps = new PuzzleSolver(p, 1);
  ps.solve();
  var t1 = performance.now();
  console.log(p.puzzleName, "time = " + (t1 - t0) + " ms");
  console.log("solution = ", ps.paths[0].toString());
}

var puzzleSimpleMaze0 = function () {
  var p = new Puzzle(2, 2);
  p.puzzleName = "PuzzleSimpleMaze0";
  p.addHead(new Vector2(1, 0));
  p.addTail(new Vector2(0, 1));
  p.regenerate();

  solvePuzzle(p);
}

var puzzleSimpleMaze1 = function () {
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
var PuzzleEssential1 = function () {
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
var PuzzleEssential2 = function () {
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

// Black & white separation
var PuzzleBW1 = function () {
  var p = new Puzzle(3, 3);
  p.puzzleName = "PuzzleBW1";
  p.addHead(new Vector2(2, 0));
  p.addTail(new Vector2(0, 2));
  p.addSpecialBlock(new Vector2(0, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 1), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 1), BlockType.White);
  p.regenerate();

  solvePuzzle(p);
}

// Black & white separation
var PuzzleBW2 = function () {
  var p = new Puzzle(4, 4);
  p.puzzleName = "PuzzleBW2";
  p.addHead(new Vector2(3, 0));
  p.addTail(new Vector2(2, 0));
  p.addSpecialBlock(new Vector2(0, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 1), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 0), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 2), BlockType.White);
  p.regenerate();

  solvePuzzle(p);
}

// Black & white separation
var PuzzleBW3 = function () {
  var p = new Puzzle(5, 5);
  p.puzzleName = "PuzzleBW3";
  p.addHead(new Vector2(4, 0));
  p.addTail(new Vector2(0, 1));

  p.addSpecialBlock(new Vector2(0, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 3), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 1), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 3), BlockType.Black);
  p.addSpecialBlock(new Vector2(2, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(2, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(2, 3), BlockType.Black);
  p.addSpecialBlock(new Vector2(3, 3), BlockType.Black);

  p.addSpecialBlock(new Vector2(0, 2), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(3, 0), BlockType.White);
  p.addSpecialBlock(new Vector2(3, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(3, 2), BlockType.White);
  p.regenerate();

  solvePuzzle(p);
}

// Black & white separation
var PuzzleBW4 = function () {
  var p = new Puzzle(4, 4);
  p.puzzleName = "PuzzleBW4";
  p.addHead(new Vector2(3, 0));
  p.addTail(new Vector2(0, 3));

  p.addSpecialBlock(new Vector2(0, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 1), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 0), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 2), BlockType.White);
  p.regenerate();

  solvePuzzle(p);
}

// Black & white separation
var PuzzleBW5 = function () {
  var p = new Puzzle(5, 5);
  p.puzzleName = "PuzzleBW5";
  p.addHead(new Vector2(2, 2));
  p.addTail(new Vector2(0, 4));

  p.addSpecialBlock(new Vector2(1, 1), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(2, 1), BlockType.Black);
  p.addSpecialBlock(new Vector2(2, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 0), BlockType.White);
  p.addSpecialBlock(new Vector2(0, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(0, 2), BlockType.White);
  p.addSpecialBlock(new Vector2(0, 3), BlockType.White);
  p.addSpecialBlock(new Vector2(1, 3), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 3), BlockType.White);
  p.addSpecialBlock(new Vector2(3, 3), BlockType.White);

  p.regenerate();

  solvePuzzle(p);
}

// Black & white separation + essential nodes
var PuzzleEssentialBW1 = function () {
  var p = new Puzzle(8, 8);
  p.puzzleName = "PuzzleEssentialBW1";
  p.addHead(new Vector2(7, 0));
  p.addHead(new Vector2(2, 4));
  p.addHead(new Vector2(5, 2));
  p.addHead(new Vector2(4, 6));
  p.addTail(new Vector2(0, 0));
  p.addTail(new Vector2(0, 7));
  p.addTail(new Vector2(7, 7));

  p.addSpecialBlock(new Vector2(0, 0), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 5), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 3), BlockType.Black);
  p.addSpecialBlock(new Vector2(1, 4), BlockType.Black);
  p.addSpecialBlock(new Vector2(4, 2), BlockType.Black);
  p.addSpecialBlock(new Vector2(5, 6), BlockType.Black);
  p.addSpecialBlock(new Vector2(6, 6), BlockType.Black);
  p.addSpecialBlock(new Vector2(0, 1), BlockType.White);
  p.addSpecialBlock(new Vector2(1, 0), BlockType.White);
  p.addSpecialBlock(new Vector2(0, 6), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 3), BlockType.White);
  p.addSpecialBlock(new Vector2(2, 4), BlockType.White);
  p.addSpecialBlock(new Vector2(5, 2), BlockType.White);
  p.addSpecialBlock(new Vector2(6, 5), BlockType.White);
  p.addEssentialSide(new Vector2(0, 6), new Vector2(0, 7));
  p.addEssentialSide(new Vector2(1, 7), new Vector2(0, 7));
  p.addEssentialSide(new Vector2(3, 7), new Vector2(4, 7));
  p.addEssentialSide(new Vector2(4, 6), new Vector2(4, 7));
  p.addEssentialSide(new Vector2(5, 1), new Vector2(5, 2));
  p.addEssentialSide(new Vector2(6, 0), new Vector2(7, 0));
  p.addEssentialSide(new Vector2(7, 0), new Vector2(7, 1));
  p.addEssentialSide(new Vector2(7, 5), new Vector2(7, 6));
  p.regenerate();

  solvePuzzle(p);
}

// Tetris (Oriented)
var PuzzleTetrisOriented1 = function () {
  var p = new Puzzle(3, 3);
  p.puzzleName = "PuzzleTetrisOriented1";
  p.addHead(new Vector2(2, 0));
  p.addTail(new Vector2(0, 2));
  p.addSpecialBlock(new Vector2(1, 0), BlockType.L2x2_0);
  p.regenerate();

  solvePuzzle(p);
}

var PuzzleTetrisOriented2 = function () {
  var p = new Puzzle(4, 4);
  p.puzzleName = "PuzzleTetrisOriented2";
  p.addHead(new Vector2(3, 0));
  p.addTail(new Vector2(0, 3));
  p.addObstacleSide(new Vector2(1, 2), new Vector2(1, 3));
  p.addObstacleSide(new Vector2(2, 1), new Vector2(2, 2));
  p.addObstacleSide(new Vector2(3, 2), new Vector2(3, 3));
  p.addSpecialBlock(new Vector2(1, 1), BlockType.Square2x2);
  p.regenerate();

  solvePuzzle(p);
}


var PuzzleTetrisOriented3 = function () {
  var p = new Puzzle(4, 4);
  p.puzzleName = "PuzzleTetrisOriented3";
  p.addHead(new Vector2(3, 0));
  p.addTail(new Vector2(0, 3));
  p.addSpecialBlock(new Vector2(0, 0), BlockType.Line1x2);
  p.addSpecialBlock(new Vector2(2, 2), BlockType.Square2x2);
  p.regenerate();

  solvePuzzle(p);
}

var PuzzleTetrisOriented4 = function () {
  var p = new Puzzle(6, 6);
  p.puzzleName = "PuzzleTetrisOriented4";
  p.addHead(new Vector2(5, 0));
  p.addTail(new Vector2(0, 5));
  p.addObstacleSide(new Vector2(0, 2), new Vector2(1, 2));
  p.addObstacleSide(new Vector2(0, 4), new Vector2(1, 4));
  p.addObstacleSide(new Vector2(0, 5), new Vector2(1, 5));
  p.addObstacleSide(new Vector2(2, 0), new Vector2(3, 0));
  p.addObstacleSide(new Vector2(4, 1), new Vector2(4, 2));
  p.addObstacleSide(new Vector2(5, 4), new Vector2(5, 5));
  p.addSpecialBlock(new Vector2(2, 2), BlockType.L2x3_270);
  p.regenerate();

  solvePuzzle(p);
}

var PuzzleTetrisOriented5 = function () {
  var p = new Puzzle(5, 5);
  p.puzzleName = "PuzzleTetrisOriented5";
  p.addHead(new Vector2(4, 0));
  p.addTail(new Vector2(0, 4));
  p.addObstacleSide(new Vector2(1, 3), new Vector2(2, 3));
  p.addSpecialBlock(new Vector2(1, 0), BlockType.Line1x4);
  p.addSpecialBlock(new Vector2(3, 1), BlockType.Line3x1);
  p.addSpecialBlock(new Vector2(3, 2), BlockType.Line3x1);
  p.regenerate();

  solvePuzzle(p);
}