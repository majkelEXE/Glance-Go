export default function translateZPrediction(quaternion, distance, position) {

    console.log(quaternion, distance, position)

    let v = new THREE.Vector3()

    console.log(v)

    v.copy(new THREE.Vector3(0, 0, 1)).applyQuaternion(quaternion)

    //

    console.log(v)

    let v2 = v.multiplyScalar(distance)

    console.log(v2)

    position.x += v2.x;
    position.y += v2.y;

   return position
}