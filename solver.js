var ToggleType = {
  None      : 0,
  Head      : 1,
  Tail      : 2,
  Essential : 3,
  Obstacle  : 4,
  Black     : 5,
  White     : 6
};

$(document).ready(function() {
  // TODO: remove
  PuzzleElementTest();
  // PuzzleSolverTest();

  var numRow = 2;
  var numCol = 2;
  var blockSide = 0;
  var pathWidth = 0;

  var vertMarginHeight = 0;
  var horiMarginHeight = 0;
  var horiMarginWidth  = 0;

  // none, start/end, essential/obstacle, black/white
  var numElement = 7;
  var elementToggle = ToggleType.None;

  $(".toolbar-col").on("click", "#btn-col-minus", function() {
    if (numCol > 2) {
      numCol--;
      DrawPuzzleGrid();
      DrawRowColBlocks();
      puzzle = new Puzzle(numRow, numCol);
    } 
  });

  $(".toolbar-col").on("click", "#btn-col-plus", function() {
    if (numCol < 6) {
      numCol++;
      DrawPuzzleGrid();
      DrawRowColBlocks();
      puzzle = new Puzzle(numRow, numCol);
    } 
  });

  $(".toolbar-row").on("click", "#btn-row-minus", function() {
    if (numRow > 2) {
      numRow--;
      DrawPuzzleGrid();
      DrawRowColBlocks();
      puzzle = new Puzzle(numRow, numCol);
    } 
  });

  $(".toolbar-row").on("click", "#btn-row-plus", function() {
    if (numRow < 6) {
      numRow++;
      DrawPuzzleGrid();
      DrawRowColBlocks();
      puzzle = new Puzzle(numRow, numCol);
    } 
  });

  $( ".rc-select" ).click( function() {
    var idStringList = this.id.split("-");
    if (idStringList[1] === "row") {
      numRow = parseInt(idStringList[2]) + 1;
      DrawPuzzleGrid();
      DrawRowColBlocks();
      puzzle = new Puzzle(numRow, numCol);
    }
    else {
      numCol = parseInt(idStringList[2]) + 1;
      DrawPuzzleGrid();
      DrawRowColBlocks();
      puzzle = new Puzzle(numRow, numCol);
    }
  });

  var DrawRowColBlocks = function () {
    for (r = 2; r <= 6; r++) {
      var btn = document.getElementById("btn-row-" + String(r - 1));
      if (r <= numRow) {
        btn.classList.remove("fa-square-o");
        btn.classList.add("fa-square");
      }
      else {
        btn.classList.remove("fa-square");
        btn.classList.add("fa-square-o");
      }
    }

    for (c = 2; c <= 6; c++) {
      var btn = document.getElementById("btn-col-" + String(c - 1));
      if (c <= numCol) {
        btn.classList.remove("fa-square-o");
        btn.classList.add("fa-square");
      }
      else {
        btn.classList.remove("fa-square");
        btn.classList.add("fa-square-o");
      }
    }
  }

  $( ".rc-square" )
  .mouseover(function() {
    // this.style.color = "#50543a";
    this.style.opacity = 0.75;
  })
  .mouseout(function() {
    // this.style.color = "#727661";
    this.style.opacity = 0.65;
  })
  .mousedown(function() {
    // this.style.color = "#282a1d";
    this.style.opacity = 1;
  })
  .mouseup(function() {
    // this.style.color = "#727661";
    this.style.opacity = 0.75;
  });

  $("#execute-btn-reset").click(function() {
    ClearPuzzleElements();
  });

  $("#execute-btn-solve").click(function() {
    Solve(puzzle);
  });

  $(".execute-btn")
  .mouseover(function() {
    this.style.color = "#ffc019";
  })
  .mouseout(function() {
    this.style.color = "#ecf3d0";
  })
  .mousedown(function() {
    this.style.color = "#ff5e2f";
  })
  .mouseup(function() {
    this.style.color = "#ffc019";
  });

  // Switch between different elements to add to the puzzle
  $(".toolbar-element-btn").click(function() {
    var clickedID = parseInt(this.id.split("-")[2]);
    if (elementToggle == clickedID) {
      elementToggle = 0;
    }
    else {
      elementToggle = clickedID;
    }

    for (i = 1; i < numElement; i++) {
      var btnElement = document.getElementById("element-btn-" + String(i));
      if (elementToggle == i) {
        btnElement.style.opacity = 1;
      }
      else {
        btnElement.style.opacity = 0.25;
      }
    } 
  });

  $( ".toolbar-element-btn" )
  .mouseover(function() {
    this.style.opacity = 1;
  })
  .mouseout(function() {
    var clickedID = parseInt(this.id.split("-")[2]);
    if (elementToggle == clickedID) {
      this.style.opacity = 1;
    }
    else {
      this.style.opacity = 0.25;
    }
  });

  $(".puzzle-window").on("click", ".puzzle-node", function() {
    var idStringList = this.id.split("-");
    var r = parseInt(idStringList[1]);
    var c = parseInt(idStringList[2]);
    var v = new Vector2(r, c);

    // Add/remove heads
    if (elementToggle == ToggleType.Head) {
      if (puzzle.nodeHeads.contains(v)) {
        puzzle.nodeHeads.remove(v);
        EraseHead(r, c);
      }
      else {
        if (puzzle.nodeTails.contains(v)) {
          EraseTail(r, c);
        }
        puzzle.addHead(v);
        DrawHead(r, c);
      }
    }

    // Add/remove tails
    // We only allow tails on edges
    if (elementToggle == ToggleType.Tail && puzzle.nodeMap.isOnEdge(v)) {
      if (puzzle.nodeTails.contains(v)) {
        puzzle.nodeTails.remove(v);
        EraseTail(r, c);
      }
      else {
        if (puzzle.nodeHeads.contains(v)) {
          EraseHead(r, c);
        }
        puzzle.addTail(v);
        DrawTail(r, c);
      }
    }

    // Add/remove essential nodes
    if (elementToggle == ToggleType.Essential) {
      if (puzzle.nodeEssentials.contains(v)) {
        puzzle.nodeEssentials.remove(v);
        EraseEssentialNode(r, c);
      }
      else {
        puzzle.addEssentialNode(v);
        DrawEssentialNode(r, c);
      }
    }
  });

  $(".puzzle-window").on("click", ".puzzle-side", function() {
    var idStringList = this.id.split("-");
    var r1 = parseInt(idStringList[1]);
    var c1 = parseInt(idStringList[2]);
    var r2 = parseInt(idStringList[3]);
    var c2 = parseInt(idStringList[4]);
    var v1 = new Vector2(r1, c1);
    var v2 = new Vector2(r2, c2);
    var s  = new Side(v1, v2);

    // Add/remove essential sides
    if (elementToggle == ToggleType.Essential) {
      if (puzzle.sideEssentials.contains(s)) {
        puzzle.sideEssentials.remove(s);
        EraseEssentialSide(r1, c1, r2, c2);
      }
      else {
        if (puzzle.sideObstacles.contains(s)) {
          EraseObstacleSide(r1, c1, r2, c2);
        }
        puzzle.addEssentialSide(v1, v2);
        DrawEssentialSide(r1, c1, r2, c2);
      }
    }

    // Add/remove obstacle sides
    if (elementToggle == ToggleType.Obstacle) {
      if (puzzle.sideObstacles.contains(s)) {
        puzzle.sideObstacles.remove(s);
        EraseObstacleSide(r1, c1, r2, c2);
      }
      else {
        if (puzzle.sideEssentials.contains(s)) {
          EraseEssentialSide(r1, c1, r2, c2);
        }
        puzzle.addObstacleSide(v1, v2);
        DrawObstacleSide(r1, c1, r2, c2);
      }
    }
  });

  var ClearPuzzleElements = function() {
    $(".puzzle-window").find(".puzzle-head").remove();
    $(".puzzle-window").find(".puzzle-tail").remove();
    $(".puzzle-window").find(".puzzle-essential-node").remove();
    $(".puzzle-window").find(".puzzle-essential-side").remove();
    $(".puzzle-window").find(".puzzle-obstacle-side").remove();
    $(".puzzle-window").find(".path").remove();
  }

  var DrawPuzzleGrid = function() {
    ClearPuzzleElements();

    // Compute window dimension
    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];
    var puzzleWindowSide  = parseInt(getComputedStyle(puzzleWindow).getPropertyValue("height").split("p")[0]);
    var puzzleWindowMargin  = puzzleWindowSide * 0.125;
    pathWidth = puzzleWindowSide * 0.05;
    var pathHalf  = pathWidth * 0.5;

    // Compute the block size and height & width
    blockSide = (puzzleWindowSide - (puzzleWindowMargin * 2)) / (Math.max(numRow, numCol) - 1) - pathWidth;
    var puzzleHeight = blockSide * (numRow - 1) + pathWidth * numRow;
    var puzzleWidth  = blockSide * (numCol - 1) + pathWidth * numCol;

    // Compute margin lengths
    vertMarginHeight = (puzzleWindowSide - puzzleHeight) / 2;
    horiMarginHeight = puzzleHeight;
    horiMarginWidth  = (puzzleWindowSide - puzzleWidth) / 2;

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
          puzzleSideHori.className = 'puzzle-side puzzle-side-hori';
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
          puzzleSideVert.className = 'puzzle-side puzzle-side-vert';
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
  }

  var DrawHead = function(r, c) {
    var headTop  = vertMarginHeight + r * (blockSide + pathWidth) - pathWidth * 0.5;
    var headLeft = horiMarginWidth  + c * (blockSide + pathWidth) - pathWidth * 0.5;

    var puzzleHead = document.createElement('div');
    puzzleHead.id = "h-" + String(r) + "-" + String(c);
    puzzleHead.className = "puzzle-head puzzle-node";
    puzzleHead.style.width = String(pathWidth * 2) + "px";
    puzzleHead.style.height = String(pathWidth * 2) + "px";
    puzzleHead.style.position = "absolute";
    puzzleHead.style.left = String(headLeft) + "px";
    puzzleHead.style.top = String(headTop) + "px";
    puzzleHead.style.borderRadius = String(pathWidth) + "px";

    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];
    puzzleWindow.appendChild(puzzleHead);
  }
  var EraseHead = function (r, c) {
    var head = document.getElementById("h-" + String(r) + "-" + String(c));
    head.parentNode.removeChild(head);
  }

  var DrawTail = function(r, c) {
    var puzzleTail = document.createElement('div');
    puzzleTail.id = "t-" + String(r) + "-" + String(c);
    puzzleTail.className = "puzzle-tail puzzle-node";
    puzzleTail.style.position = "absolute";
    puzzleTail.style.borderRadius = String(500) + "px";

    if (r == 0) {
      var tailTop  = vertMarginHeight + r * (blockSide + pathWidth) - pathWidth;
      var tailLeft = horiMarginWidth  + c * (blockSide + pathWidth);
      puzzleTail.style.width  = String(pathWidth) + "px";
      puzzleTail.style.height = String(pathWidth * 2) + "px";
      puzzleTail.style.top  = String(tailTop) + "px";
      puzzleTail.style.left = String(tailLeft) + "px";
    }
    else if (r == numRow - 1) {
      var tailTop  = vertMarginHeight + r * (blockSide + pathWidth);
      var tailLeft = horiMarginWidth  + c * (blockSide + pathWidth);
      puzzleTail.style.width  = String(pathWidth) + "px";
      puzzleTail.style.height = String(pathWidth * 2) + "px";
      puzzleTail.style.top  = String(tailTop) + "px";
      puzzleTail.style.left = String(tailLeft) + "px";
    }
    else if (c == 0) {
      var tailTop  = vertMarginHeight + r * (blockSide + pathWidth);
      var tailLeft = horiMarginWidth  + c * (blockSide + pathWidth) - pathWidth;
      puzzleTail.style.width  = String(pathWidth * 2) + "px";
      puzzleTail.style.height = String(pathWidth) + "px";
      puzzleTail.style.top  = String(tailTop) + "px";
      puzzleTail.style.left = String(tailLeft) + "px";
    }
    else { // c == numCol - 1
      var tailTop  = vertMarginHeight + r * (blockSide + pathWidth);
      var tailLeft = horiMarginWidth  + c * (blockSide + pathWidth);
      puzzleTail.style.width  = String(pathWidth * 2) + "px";
      puzzleTail.style.height = String(pathWidth) + "px";
      puzzleTail.style.top  = String(tailTop) + "px";
      puzzleTail.style.left = String(tailLeft) + "px";
    }
    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];
    puzzleWindow.appendChild(puzzleTail);
  }
  var EraseTail = function (r, c) {
    var tail = document.getElementById("t-" + String(r) + "-" + String(c));
    tail.parentNode.removeChild(tail);
  }

  var DrawEssentialNode = function(r, c) {
    var essentialNodeTop  = vertMarginHeight + r * (blockSide + pathWidth);
    var essentialNodeLeft = horiMarginWidth  + c * (blockSide + pathWidth);

    var puzzleEssentialNode = document.createElement('div');
    puzzleEssentialNode.id = "en-" + String(r) + "-" + String(c);
    puzzleEssentialNode.className = "puzzle-essential-node puzzle-node";
    puzzleEssentialNode.style.width = String(pathWidth) + "px";
    puzzleEssentialNode.style.height = String(pathWidth) + "px";
    // puzzleEssentialNode.style.position = "absolute";
    puzzleEssentialNode.style.top  = String(essentialNodeTop) + "px";
    puzzleEssentialNode.style.left = String(essentialNodeLeft) + "px";
    puzzleEssentialNode.style.borderRadius = String(pathWidth / 2) + "px";

    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];
    puzzleWindow.appendChild(puzzleEssentialNode);
  }
  var EraseEssentialNode = function (r, c) {
    var essentialNode = document.getElementById("en-" + String(r) + "-" + String(c));
    essentialNode.parentNode.removeChild(essentialNode);
  }

  var DrawEssentialSide = function (r1, c1, r2, c2) {
    var puzzleEssentialSide = document.createElement('div');
    puzzleEssentialSide.id = "es-" + String(r1) + "-" + String(c1) + "-" + String(r2) + "-" + String(c2);
    puzzleEssentialSide.className = "puzzle-essential-side puzzle-side ";
    puzzleEssentialSide.style.width = String(pathWidth) + "px";
    puzzleEssentialSide.style.height = String(pathWidth) + "px";
    // puzzleEssentialSide.style.position = "absolute";
    puzzleEssentialSide.style.borderRadius = String(pathWidth / 2) + "px";

    if (r1 == r2) { // horizontal
      var essentialSideTop  = vertMarginHeight + r1 * (blockSide + pathWidth);
      var essentialSideLeft = horiMarginWidth  + c1 * (blockSide + pathWidth) + (blockSide + pathWidth) / 2;
      puzzleEssentialSide.style.top  = String(essentialSideTop) + "px";
      puzzleEssentialSide.style.left = String(essentialSideLeft) + "px";
    }
    else { // vertical
      var essentialSideTop  = vertMarginHeight + r1 * (blockSide + pathWidth) + (blockSide + pathWidth) / 2;
      var essentialSideLeft = horiMarginWidth  + c1 * (blockSide + pathWidth);
      puzzleEssentialSide.style.top  = String(essentialSideTop) + "px";
      puzzleEssentialSide.style.left = String(essentialSideLeft) + "px";
    }
    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];
    puzzleWindow.appendChild(puzzleEssentialSide);
  }
  var EraseEssentialSide = function (r1, c1, r2, c2) {
    var essentialSide = document.getElementById("es-" + String(r1) + "-" + String(c1) + "-" + String(r2) + "-" + String(c2));
    essentialSide.parentNode.removeChild(essentialSide);
  }

  var DrawObstacleSide = function (r1, c1, r2, c2) {
    var puzzleObstacleSide = document.createElement('div');
    puzzleObstacleSide.id = "os-" + String(r1) + "-" + String(c1) + "-" + String(r2) + "-" + String(c2);
    puzzleObstacleSide.className = "puzzle-obstacle-side puzzle-side ";
    puzzleObstacleSide.style.width = String(pathWidth) + "px";
    puzzleObstacleSide.style.height = String(pathWidth) + "px";

    if (r1 == r2) { // horizontal
      var obstacleSideTop  = vertMarginHeight + r1 * (blockSide + pathWidth);
      var obstacleSideLeft = horiMarginWidth  + c1 * (blockSide + pathWidth) + (blockSide + pathWidth) / 2;
      puzzleObstacleSide.style.top  = String(obstacleSideTop) + "px";
      puzzleObstacleSide.style.left = String(obstacleSideLeft) + "px";
    }
    else { // vertical
      var obstacleSideTop  = vertMarginHeight + r1 * (blockSide + pathWidth) + (blockSide + pathWidth) / 2;
      var obstacleSideLeft = horiMarginWidth  + c1 * (blockSide + pathWidth);
      puzzleObstacleSide.style.top  = String(obstacleSideTop) + "px";
      puzzleObstacleSide.style.left = String(obstacleSideLeft) + "px";
    }
    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];
    puzzleWindow.appendChild(puzzleObstacleSide);
  }
  var EraseObstacleSide = function (r1, c1, r2, c2) {
    var obstacleSide = document.getElementById("os-" + String(r1) + "-" + String(c1) + "-" + String(r2) + "-" + String(c2));
    obstacleSide.parentNode.removeChild(obstacleSide);
  }

  var Solve = function (puzzle) {
    puzzle.regenerate();
    // puzzle.print();
    var ps = new PuzzleSolver(puzzle, 1);
    ps.solve();
    if (ps.paths.length > 0) {
      console.log("solution = ", ps.paths[0].toString());
      DrawPath(ps.paths[0]);
    }
  }
  var DrawPath = function (path) {
    var puzzleWindow = document.getElementsByClassName("puzzle-window")[0];

    var pathList = path.path;
    for (i = 0; i < pathList.length - 1; i++) {
      var s = new Side(pathList[i], pathList[i + 1]);
      var side = document.getElementById("s-" + String(s.vec1.r) + "-" + String(s.vec1.c) 
                                        + "-" + String(s.vec2.r) + "-" + String(s.vec2.c));
      var pathSide = document.createElement('div');
      pathSide.className  = "path";
      pathSide.style.height = side.style.height;
      pathSide.style.width  = side.style.width;
      if (s.isHorizontal()) {
        var pathTop  = vertMarginHeight + s.vec1.r * (blockSide + pathWidth);
        var pathLeft = horiMarginWidth  + s.vec1.c * (blockSide + pathWidth) + pathWidth;
        pathSide.style.top  = String(pathTop) + "px";
        pathSide.style.left = String(pathLeft) + "px";
        puzzleWindow.appendChild(pathSide);
      }
      else {
        var pathTop  = vertMarginHeight + s.vec1.r * (blockSide + pathWidth) + pathWidth;
        var pathLeft = horiMarginWidth  + s.vec1.c * (blockSide + pathWidth);
        pathSide.style.top  = String(pathTop) + "px";
        pathSide.style.left = String(pathLeft) + "px";
        puzzleWindow.appendChild(pathSide);
      }
    }

    for (i = 0; i < pathList.length; i++) {
      if (i == 0) {
        var head = document.getElementById("h-" + String(pathList[i].r) + "-" + String(pathList[i].c));
        var pathHead = head.cloneNode(true);
        pathHead.className  = "path";
        pathHead.id  = "";
        puzzleWindow.appendChild(pathHead);
      }
      if (i == pathList.length - 1) {
        var tail = document.getElementById("t-" + String(pathList[i].r) + "-" + String(pathList[i].c));
        var pathTail = tail.cloneNode(true);
        pathTail.className  = "path";
        pathTail.id  = "";
        puzzleWindow.appendChild(pathTail);
      }
      // Special care need to be taken when the path makes turns
      var pathNode = document.createElement('div');
      pathNode.className  = "path";
      pathNode.style.height = String(pathWidth) + "px";
      pathNode.style.width  = String(pathWidth) + "px";
      var nodeTop  = vertMarginHeight + pathList[i].r * (blockSide + pathWidth);
      var nodeLeft = horiMarginWidth  + pathList[i].c * (blockSide + pathWidth);
      pathNode.style.top  = String(nodeTop) + "px";
      pathNode.style.left = String(nodeLeft) + "px";

      if (i > 0 && i < pathList.length) {
        var vPrev = pathList[i - 1];
        var vCurr = pathList[i];
        // Not available if vCurr is tail, so we need to extrapolate
        var vNext;
        if (i == pathList.length - 1) {
          if      (vCurr.r == 0)          vNext = vCurr.add(new Vector2(-1, 0));
          else if (vCurr.r == numRow - 1) vNext = vCurr.add(new Vector2(1, 0));
          else if (vCurr.c == 0)          vNext = vCurr.add(new Vector2(0, -1));
          else                            vNext = vCurr.add(new Vector2(0, 1));
        } 
        else {
          vNext = pathList[i + 1];
        }

        // This is a tricky variable to name
        var cornerOffset = vPrev.add(vNext).sub(vCurr.mul(2));
        if (cornerOffset.equals(new Vector2(-1, -1))) {
          pathNode.style.borderBottomRightRadius = String(pathWidth / 2) + "px";
        }
        else if (cornerOffset.equals(new Vector2(-1, 1))) {
          pathNode.style.borderBottomLeftRadius = String(pathWidth / 2) + "px";
        }
        else if (cornerOffset.equals(new Vector2(1, -1))) {
          pathNode.style.borderTopRightRadius = String(pathWidth / 2) + "px";
        }
        else if (cornerOffset.equals(new Vector2(1, 1))) {
          pathNode.style.borderTopLeftRadius = String(pathWidth / 2) + "px";
        }
      }

      puzzleWindow.appendChild(pathNode);
    }

  }

  DrawPuzzleGrid();
  var puzzle = new Puzzle(numRow, numCol);
});

