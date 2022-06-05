export function isPointInsideSphere(point, sphere) {
  // we are using multiplications because is faster than calling Math.pow
  var distance = Math.sqrt(
    (point.x - sphere.x) * (point.x - sphere.x) +
      (point.y - sphere.y) * (point.y - sphere.y) +
      (point.z - sphere.z) * (point.z - sphere.z)
  );
  return distance < sphere.radius;
}

export function areSpheresCollided(sphere, other) {
  // we are using multiplications because it's faster than calling Math.pow
  var distance = Math.sqrt(
    (sphere.x - other.x) * (sphere.x - other.x) +
      (sphere.y - other.y) * (sphere.y - other.y) +
      (sphere.z - other.z) * (sphere.z - other.z)
  );
  return distance < sphere.radius + other.radius;
}
