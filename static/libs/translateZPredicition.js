export default function translateZPrediction(quaternion, distance, position) {
  let v = new THREE.Vector3();

  v.copy(new THREE.Vector3(0, 0, 1)).applyQuaternion(
    new THREE.Quaternion(
      quaternion._x,
      quaternion._y,
      quaternion._z,
      quaternion._w
    )
  );

  let v2 = v.multiplyScalar(distance);

  position.x += v2.x;
  position.z += v2.z;

  return position;
}
