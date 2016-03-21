$(document).ready(function() {
  var output = foo();
  console.log(output);
});

var foo = function() {
  var node1 = new Node(3, 3);
  node1.neighborOffsets.push(new Vector2(0, 1));
  node1.neighborOffsets.push(new Vector2(1, 0));
  node1.neighborOffsets.push(new Vector2(0, -1));
  
  var neighbors = node1.getNeighborCoords();
  for (i = 0; i < neighbors.length; i++) {
    var n = neighbors[i];
    console.log(n.r, n.c);
    console.log(n);
  }

  console.log(node1.isHead);
  console.log(node1.coord.r, node1.coord.c);

  return "herp derp";
} 
