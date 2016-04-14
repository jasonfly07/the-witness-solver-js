// To recap:
// Square1x1 : 3, Square2x2 : 4,
// Line1x2 : 5, Line2x1 : 6,
// Line1x3 : 7, Line3x1 : 8,
// Line1x4 : 9, Line4x1 : 10,
// L2x2_0 : 11, L2x2_90 : 12, L2x2_180 : 13, L2x2_270 : 14,
// L3x2_0 : 15, L3x2_90 : 16, L3x2_180 : 17, L3x2_270 : 18,
// L2x3_0 : 19, L2x3_90 : 20, L2x3_180 : 21, L2x3_270 : 22,

function Tetris (type) {
	this.type = type;

  // Starting from a seed, the list stores all the coord offset to construct a block
  // For example, L2x2_0 would be [0, 0], [0, 1], [1, 0]
  // (Heuristic) The order of the offsets are arranged so we always test the
  // farthest reach in the beginning, so we don't waste time growing the shape block-by-block
	this.shape = [];

	switch (type) {
	 	case BlockType.Square1x1:
      this.area = 1; this.boxArea = 1;
      this.boxRow = 1; this.boxCol = 1;
      this.shape.push(new Vector2(0, 0));
	 		break;
    case BlockType.Square2x2:
      this.area = 4; this.boxArea = 4;
      this.boxRow = 2; this.boxCol = 2;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(1, 1));
      this.shape.push(new Vector2(0, 1));
      this.shape.push(new Vector2(1, 0));
      break;

    case BlockType.Line1x2:
      this.area = 2; this.boxArea = 2;
      this.boxRow = 1; this.boxCol = 2;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(0, 1));
      break;
    case BlockType.Line1x3:
      this.area = 3; this.boxArea = 3;
      this.boxRow = 1; this.boxCol = 3;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(0, 2));
      this.shape.push(new Vector2(0, 1));
      break;
    case BlockType.Line1x4:
      this.area = 4; this.boxArea = 4;
      this.boxRow = 1; this.boxCol = 4;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(0, 3));
      this.shape.push(new Vector2(0, 1));
      this.shape.push(new Vector2(0, 2));
      break;

    case BlockType.Line2x1:
      this.area = 2; this.boxArea = 2;
      this.boxRow = 2; this.boxCol = 1;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(1, 0));
      break;
    case BlockType.Line3x1:
      this.area = 3; this.boxArea = 3;
      this.boxRow = 3; this.boxCol = 1;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(2, 0));
      this.shape.push(new Vector2(1, 0));
      break;
    case BlockType.Line4x1:
      this.area = 4; this.boxArea = 4;
      this.boxRow = 4; this.boxCol = 1;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(3, 0));
      this.shape.push(new Vector2(1, 0));
      this.shape.push(new Vector2(2, 0));
      break;

    case BlockType.L2x2_0:
      this.area = 3; this.boxArea = 4;
      this.boxRow = 2; this.boxCol = 2;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(1, 1));
      this.shape.push(new Vector2(1, 0));
      break;
    case BlockType.L2x2_90:
      this.area = 3; this.boxArea = 4;
      this.boxRow = 2; this.boxCol = 2;
      this.shape.push(new Vector2( 0, 0));
      this.shape.push(new Vector2(-1, 1));
      this.shape.push(new Vector2( 0, 1));
      break;
    case BlockType.L2x2_180:
      this.area = 3; this.boxArea = 4;
      this.boxRow = 2; this.boxCol = 2;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(1, 1));
      this.shape.push(new Vector2(0, 1));
      break;
    case BlockType.L2x2_270:
      this.area = 3; this.boxArea = 4;
      this.boxRow = 2; this.boxCol = 2;
      this.shape.push(new Vector2( 0, 0));
      this.shape.push(new Vector2(-1, 1));
      this.shape.push(new Vector2(-1, 0));
      break;

    case BlockType.L3x2_0:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 3; this.boxCol = 2;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(2, 1));
      this.shape.push(new Vector2(1, 0));
      this.shape.push(new Vector2(2, 0));
      break;
    case BlockType.L3x2_90:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 2; this.boxCol = 3;
      this.shape.push(new Vector2( 0, 0));
      this.shape.push(new Vector2(-1, 2));
      this.shape.push(new Vector2( 0, 1));
      this.shape.push(new Vector2( 0, 2));
      break;
    case BlockType.L3x2_180:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 3; this.boxCol = 2;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(2, 1));
      this.shape.push(new Vector2(0, 1));
      this.shape.push(new Vector2(1, 1));
      break;
    case BlockType.L3x2_270:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 2; this.boxCol = 3;
      this.shape.push(new Vector2( 0, 0));
      this.shape.push(new Vector2(-1, 2));
      this.shape.push(new Vector2(-1, 0));
      this.shape.push(new Vector2(-1, 1));
      break;

    case BlockType.L2x3_0:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 2; this.boxCol = 3;
      this.shape.push(Vector2(0, 0));
      this.shape.push(Vector2(1, 2));
      this.shape.push(Vector2(1, 0));
      this.shape.push(Vector2(1, 1));
      break;
    case BlockType.L2x3_90:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 3; this.boxCol = 2;
      this.shape.push(new Vector2( 0, 0));
      this.shape.push(new Vector2(-2, 1));
      this.shape.push(new Vector2( 0, 1));
      this.shape.push(new Vector2(-1, 1));
      break;
    case BlockType.L2x3_180:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 2; this.boxCol = 3;
      this.shape.push(new Vector2(0, 0));
      this.shape.push(new Vector2(1, 2));
      this.shape.push(new Vector2(0, 1));
      this.shape.push(new Vector2(0, 2));
      break;
    case BlockType.L2x3_270:
      this.area = 4; this.boxArea = 6;
      this.boxRow = 3; this.boxCol = 2;
      this.shape.push(new Vector2( 0, 0));
      this.shape.push(new Vector2(-2, 1));
      this.shape.push(new Vector2(-1, 0));
      this.shape.push(new Vector2(-2, 0));
      break;

    default:
    	throw "incorrect tetris type.";
    	break;
	}
};