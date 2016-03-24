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


  // Testing Side
  var vec1 = new Vector2(9, 3);
  var vec2 = new Vector2(9, 2);
  var side1 = new Side(vec1, vec2);
  var vec3 = new Vector2(9, 3);
  var vec4 = new Vector2(9, 4);
  var side2 = new Side(vec3, vec4);
  console.log(side1.equal(side2));
  console.log(side1.isHorizontal());

  return "herp derp";
} 
