export default class RoomModel extends THREE.Group{
    constructor(){
        super()

        this.material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

        this.floorGeometry = new THREE.BoxGeometry( 1000, 1, 1000 );
        this.horizontalWallGeometry = new THREE.BoxGeometry( 1000, 100, 10 );
        this.verticalWallGeometry = new THREE.BoxGeometry( 10, 100, 1000 );

        this.floor = new THREE.Mesh( this.floorGeometry, this.material );

        this.horizontalWallFront =  new THREE.Mesh( this.horizontalWallGeometry, this.material);
        this.horizontalWallFront.position.set(0,50,500)

        this.horizontalWallBack =  new THREE.Mesh( this.horizontalWallGeometry, this.material );
        this.horizontalWallBack.position.set(0,50,-500)

        this.verticalWallGeometryLeft =  new THREE.Mesh( this.verticalWallGeometry, this.material);
        this.verticalWallGeometryLeft.position.set(-500,50,0)

        this.verticalWallGeometryRight =  new THREE.Mesh( this.verticalWallGeometry, this.material );
        this.verticalWallGeometryRight.position.set(500,50,0)

        this.add(this.floor)
        this.add(this.horizontalWallFront)
        this.add(this.horizontalWallBack)
        this.add(this.verticalWallGeometryLeft)
        this.add(this.verticalWallGeometryRight)
    }
}