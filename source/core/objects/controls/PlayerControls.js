import {Group, Vector3, Vector2, Object3D, Matrix4, Quaternion} from "three";
import {Program} from "../Program.js";
import {Mouse} from "../../input/Mouse.js";
import {Keyboard} from "../../input/Keyboard.js";

/**
 * Controls for FPS players with collisions
 * 
 * @class PlayerControls
 * @extends {Group}
 * @module Controls
 */
var PlayerControls = function (acceleration)
{
    Group.call(this);
    
    this.name = "player";
	this.type = "PlayerControls";
    
    this.mouse = null;
    this.keyboard = null;
    
    this.moveLeft = false
    this.moveBackward = false;
    this.moveRight = false;
    this.moveForward = false;
    this.canJump = false;
    this.walking = false;
    this.updateCube = true;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.originalY;

	// Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians
    
    this.euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
	this.PI_2 = Math.PI / 2;
    this.vec = new THREE.Vector3();
    
    this.acceleration = acceleration;

    // this.controls = new PointerLockControls(this.camera, node.renderer.domElement);
}

PlayerControls.prototype = Object.create(Group.prototype);


PlayerControls.prototype.initialize = function()
{
    Object3D.prototype.initialize.call(this);
    
    var node = this;
    while (node.parent !== null)
    {
        node = node.parent;
    
        if (node instanceof Program)
        {
            this.program = node;
            this.mouse = node.mouse;
            this.keyboard = node.keyboard;
            this.canvas = node.canvas;
            this.camera = this.program.scene.getObjectByName("camera");;
            this.player = this.program.scene.getObjectByName("player-body");
            // this.debug = this.program.scene.getObjectByName("debug");

            this.canvas.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
            this.canvas.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        }
    }
};

PlayerControls.prototype.onMouseDown = function( event ) {
    if(this.mouseCallback){
        this.canvas.removeEventListener( 'mousemove', this.mouseCallback, false );
    }
    this.mouseCallback = this.onMouseMove.bind(this);
    this.canvas.addEventListener( 'mousemove', this.mouseCallback, false );
}
PlayerControls.prototype.onMouseUp = function( event ) {
    this.canvas.removeEventListener( 'mousemove', this.mouseCallback, false );
    this.mouseCallback = null;
}

PlayerControls.prototype.onMouseMove = function( event ) {

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.euler.setFromQuaternion( this.camera.quaternion );

    this.euler.x -= movementY * 0.002;
    this.euler.y -= movementX * 0.002;

    this.euler.x = Math.max( this.PI_2 - this.maxPolarAngle, Math.min( this.PI_2 - this.minPolarAngle, this.euler.x ) );

    this.camera.quaternion.setFromEuler( this.euler );
}

PlayerControls.prototype.movePlayerForward = function ( distance ) {

    // move forward parallel to the xz-plane
    // assumes camera.up is y-up

    this.vec.setFromMatrixColumn( this.camera.matrix, 0 );
    this.vec.crossVectors( this.camera.up, this.vec );

    // this.target = distance * this.vec;
    console.log(this.vec);

    this.player.body.velocity.x = distance * this.vec.x;
    this.player.body.velocity.z = distance * this.vec.z;
    this.player.body.velocity.y = 0;

    // this.camera.position.addScaledVector( this.vec, distance );
};

PlayerControls.prototype.movePlayerRight = function ( distance ) {

    this.vec.setFromMatrixColumn( this.camera.matrix, 0 );

    // this.target = distance * this.vec;
    
    console.log(this.vec);

    this.player.body.velocity.x = distance * this.vec.x;
    this.player.body.velocity.z = distance * this.vec.z;
    this.player.body.velocity.y = 0;

    // this.camera.position.addScaledVector( this.vec, distance );
};

PlayerControls.prototype.update = function(delta){
    Object3D.prototype.update.call(this, delta);
    
    // up
    if (this.keyboard.keyPressed(Keyboard.W) || this.keyboard.keyPressed(Keyboard.UP)){
        this.moveForward = true;
        this.walking = false;
    }else{
        this.moveForward = false;
    }
    // left
    if (this.keyboard.keyPressed(Keyboard.A) || this.keyboard.keyPressed(Keyboard.LEFT)){
        this.moveLeft = true;
        this.walking = false;
    }else{
        this.moveLeft = false;
    }
    // down
    if (this.keyboard.keyPressed(Keyboard.S) || this.keyboard.keyPressed(Keyboard.DOWN)){
        this.moveBackward = true;
        this.walking = false;
    }else{
        this.moveBackward = false;
    }
    // right
    if (this.keyboard.keyPressed(Keyboard.D) || this.keyboard.keyPressed(Keyboard.RIGHT)){
        this.moveRight = true;
        this.walking = false;
    }else{
        this.moveRight = false;
    }

    // this.debug.quaternion.setFromAxisAngle(new Vector3(0,1,0), this.camera.rotation.y);

    // keyboard move
	if(this.moveForward || this.moveBackward || this.moveLeft || this.moveRight){
					
		this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
		this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
		this.direction.normalize(); // this ensures consistent movements in all directions
        
        this.target.x = 0;
        this.target.z = 0;
        this.target.y = 0;
        
        if(this.moveLeft){
            this.target.x = -this.acceleration;
        }
        if(this.moveRight){
            this.target.x = this.acceleration;
        }
        if(this.moveForward){
            this.target.z = -this.acceleration;
        }
        if(this.moveBackward){
            this.target.z = this.acceleration;
        }

        var quaternion = new Quaternion();
        this.camera.rotation.order = 'YXZ';
        quaternion.setFromAxisAngle( new Vector3(0,1,0), this.camera.rotation.y );
        this.target.applyQuaternion(quaternion);

        this.player.body.velocity.x = this.target.x;
        this.player.body.velocity.z = this.target.z;
        
	}else{
        // console.log('reset');
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.target.x = 0;
        this.target.z = 0;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.z = 0;
    }

    this.camera.position.copy(this.player.body.position);

};


PlayerControls.prototype.toJSON = function(meta){
	var data = Object3D.prototype.toJSON.call(this, meta);

	data.object.acceleration = this.acceleration;
	data.object.maxVelocity = this.maxVelocity;

	return data;
};
export {PlayerControls};
