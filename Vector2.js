function Vector2 (r, c) {
  // this.r = r || 0;
  // this.c = c || 0;
  this.r = r;
  this.c = c;
};

Vector2.prototype.add = function (other) {
  return new Vector2(this.r + other.r, this.c + other.c);
};

Vector2.prototype.sub = function (other) {
  return new Vector2(this.r - other.r, this.c - other.c);
};

Vector2.prototype.mul = function (m) {
  return new Vector2(this.r * m, this.c * m);
};

// Manhattan distance
Vector2.prototype.distTo = function (other) {
  return Math.abs(this.r - other.r) + Math.abs(this.c - other.c);
};

Vector2.prototype.equals = function (other) {
  return (this.r == other.r && this.c == other.c);
};

Vector2.prototype.toString = function () {
  return "[" + String(this.r) + ", " + String(this.c) + "]";
};

Vector2.prototype.hashCode = function() {
  return this.toString();
};

Vector2.prototype.clone = function() {
  return new Vector2(this.r, this.c);
}

Vector2.prototype.print = function() {
  console.log(this.toString());
}
