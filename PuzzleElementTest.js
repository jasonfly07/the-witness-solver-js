var assert = function(expression) {
  if (!expression) throw "error";
}

var PuzzleElementTest = function() {
  TestHashSet();
  TestPriorityQueue();
  TestVector2();
  TestSide();
  TestBlock();
  TestNodeMap();
  TestBlockMap();
  TestPuzzle();
  
  console.log("Unit Test Pass");
} 

var TestHashSet = function() {
  var vecs = new HashSet();
  vecs.add(new Vector2(1, 2));
  vecs.add(new Vector2(1, 2));
  vecs.add(new Vector2(3, 4));
  vecs.add(new Vector2(5, 6));
  vecs.add(new Vector2(5, 6));
  vecs.add(new Vector2(6, 5));
  vecs.remove(new Vector2(1, 2));
  vecs.remove(new Vector2(2, 1));
  assert(vecs.size() == 3);

  // var ht = new Hashtable();
  // ht.put(1, "one");
  // ht.put(2, "two");
  // ht.put(3, "three");
  // console.log(ht.buckets);
}

var TestPriorityQueue = function() {
  var queue = new PriorityQueue({ comparator: function(a, b) { return a - b; }});
  queue.queue(5);
  queue.queue(3);
  queue.queue(2);
  var lowest = queue.dequeue();
  assert(lowest == 2);
}

var TestVector2 = function() {
  var v1 = new Vector2(1, 2);
  var v2 = new Vector2(3, 4);
  var v3 = v1.add(v2).mul(10).sub(new Vector2(10, 10));
  assert(v3.equals(new Vector2(30, 50)));
  assert(v1.distTo(v2) == 4);
}

var TestSide = function() {
  var side1 = new Side(new Vector2(1, 2), new Vector2(2, 2));
  var side2 = new Side(new Vector2(2, 2), new Vector2(1, 2));
  var sides = new HashSet();
  sides.add(side1);
  sides.add(side1);
  assert(sides.contains(side1));
  assert(sides.contains(new Side(new Vector2(2, 2), new Vector2(1, 2))));
  assert(sides.size() == 1);
}

var TestBlock = function() {
  var block1 = new Block(new Vector2(1, 2));
  block1.blockType = BlockType.Black;
  block1.visited = true;

  var block2 = new Block(block1);
  assert(block2.coord.equals(new Vector2(1, 2)));
  assert(block2.blockType == BlockType.Black);
  assert(block2.visited == true);
}

var TestNodeMap = function() {
  var nm1 = new NodeMap(4, 5);
  var node1 = nm1.getNode(new Vector2(1, 1));
  var node2 = nm1.getNode(new Vector2(1, 0));
  assert(node1.neighborOffsets.size() == 4);
  assert(node2.neighborOffsets.size() == 3);
  nm1.cutTie(node2.coord, node1.coord);
  assert(node1.neighborOffsets.size() == 3);
  assert(node2.neighborOffsets.contains(new Vector2(-1, 0)));
  assert(node2.neighborOffsets.contains(new Vector2(1, 0)));
}

var TestBlockMap = function() {
  var bm1 = new BlockMap(3, 4);
  bm1.cutTie(new Vector2(1, 0), new Vector2(1, 1));
  bm1.cutTie(new Vector2(2, 0), new Vector2(2, 1));
  bm1.cutTie(new Vector2(0, 1), new Vector2(1, 1));
  bm1.cutTie(new Vector2(0, 1), new Vector2(0, 2));
  var segment1 = bm1.segment(new Vector2(1, 2));
  var segment2 = bm1.segment(new Vector2(0, 0));
  assert(segment1.size() == 8);
  assert(segment2.size() == 4);

  // At this point all blocks in bm1 are visited, so we can't perform segment()
  // on bm2. Just a reminder.
  var bm2 = new BlockMap(bm1);
  assert(bm2.getBlock(new Vector2(0, 1)).visited);
  assert(bm2.getBlock(new Vector2(0, 1)).coord.equals(new Vector2(0, 1)));
}

var TestPuzzle = function() {
  var p1 = new Puzzle(3, 4);
  p1.addHead(new Vector2(0, 0));
  p1.addHead(new Vector2(0, 3));
  p1.addTail(new Vector2(2, 2));
  p1.addTail(new Vector2(0, 3));
  p1.addEssentialNode(new Vector2(1, 0));
  p1.addObstacleSide(new Vector2(1, 0), new Vector2(2, 0));
  p1.addEssentialSide(new Vector2(2, 0), new Vector2(1, 0));
  p1.addSpecialBlock(new Vector2(0, 0), BlockType.White);
  p1.addSpecialBlock(new Vector2(0, 0), BlockType.Black);
  p1.addSpecialBlock(new Vector2(0, 1), BlockType.White);
  p1.addSpecialBlock(new Vector2(0, 2), BlockType.Square1x1);
  p1.addSpecialBlock(new Vector2(0, 2), BlockType.Black);
  p1.regenerate();
  assert(p1.nodeTails.size() == 2);
  assert(p1.getNode(new Vector2(0, 0)).isHead);
  assert(p1.getNode(new Vector2(0, 3)).isTail);
  assert(p1.sideObstacles.size() == 0);
  assert(p1.sideEssentials.size() == 3);
  assert(p1.sideEssentials.contains(new Side(new Vector2(1, 0), new Vector2(2, 0))));
  assert(p1.getBlock(new Vector2(0, 0)).blockType == BlockType.Black);
  assert(p1.hasBlackWhite);
  assert(!p1.hasTetris);
}
