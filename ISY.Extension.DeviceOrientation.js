var _viewer;
var _rotInterval = {lastx:0,lasty:90,lastz:0}; 

var _navapi;
var _camera;
var _isXUp =false ;
var _isYUp =true ;
var _isZUp =false ;

var _deviceOrientationVR = null;

function ISYExtensionDeviceOrientation(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);

  _viewer = viewer;
  
  _navapi =_viewer.navigation;
  _camera =_navapi.getCamera();

  _isXUp = (_camera.worldup && _camera.worldup.x === 1);
  _isYUp = (_camera.worldup && _camera.worldup.y === 1);
  _isZUp = (_camera.worldup && _camera.worldup.z === 1);
}

ISYExtensionDeviceOrientation.prototype = Object.create(Autodesk.Viewing.Extension.prototype);

ISYExtensionDeviceOrientation.prototype.load = function () {
  console.log('ISYExtensionDeviceOrientation loaded');

  if(window.DeviceOrientationEvent){
      _rotInterval = {lastx:0,lasty:90,lastz:0}; 
    //  window.addEventListener("deviceorientation", orientationListener, false); 
    _deviceOrientationVR = new THREE.DeviceOrientationControls();
    _deviceOrientationVR.connect();

    window.addEventListener('deviceorientation', orientationListener2, true);
  }else
  {
      alert("DeviceOrientationEvent is not supported");
  }

  return true;
}

ISYExtensionDeviceOrientation.prototype.unload = function () {
  console.log('ISYExtensionDeviceOrientation unloaded');

  //window.removeEventListener('deviceorientation', orientationListener);

  _deviceOrientationVR.disconnect();
  _deviceOrientationVR = null;
  window.removeEventListener('deviceorientation', orientationListener2);

  return true;
}

 function orientationListener2(event){
    //rotInterval = {lastx:0,lasty:0,lastz:0}; 

   // window.removeEventListener('deviceorientation', orientationListener, true);
      if (!_deviceOrientationVR)
          return false;

      // Get the current device orientation quaternion.
      // The quaternion can be applied to the current camera but that will *not* update
      // the target value nor handle world UP differences.  Therefore we need to also
      // update those values.
      var qOrientation = _deviceOrientationVR.update();
      if (!qOrientation)
          return false;

      if(_camera.dirty)
        return false;
      //qOrientation.rotation.reorder( "YXZ" );

      // For Z-Up models we need to re-orient YZ values.
      if (_isZUp) {
          var t = qOrientation.z;
          qOrientation.z = qOrientation.y;
          qOrientation.y = -t;
      }

      // Models can have different up vectors.  Adjust for that.
      var lookAtDir = _isZUp ? new THREE.Vector3( 0, 1, 0 ) : new THREE.Vector3( 0, 0, -1 );

      // The LMV camera still uses the old target value which threejs no longer uses.
      // Therefore we need to set it so the view changes.
      var newTargetDir = lookAtDir.clone().applyQuaternion( qOrientation );

      // Distance to current target
      var dist = _camera.target.clone().sub(_camera.position).length();

      // then update the target
      _navapi.setTarget(_camera.position.clone().add(newTargetDir.multiplyScalar(dist)));

      _camera.dirty = true;
 }

 function orientationListener(event){
    //rotInterval = {lastx:0,lasty:0,lastz:0}; 


    var alpha = parseInt(event.alpha);
    var beta = parseInt(event.beta);
    var gamma = parseInt(event.gamma);

    document.getElementById("alpha").innerHTML="Alpha="+alpha;
    document.getElementById("beta").innerHTML="Beta="+beta;

    // get camera
    var cam = _viewer.getCamera();

    newx = event.alpha;
    newy = event.beta;
    newz = event.gamma;  

    //rotate the camera
    var localCam = cam.clone();
    var newPosition = localCam.position;
    var newTarget = localCam.target;
    var directionFwd = cam.target.clone().sub(cam.position);
    var directionRight = directionFwd.clone().cross(cam.up).normalize();

    //rotate around up vector
    var yawX = new THREE.Quaternion();
    var changed = ( Math.abs(newx-_rotInterval.lastx) >1 );
    if(changed) 
      yawX.setFromAxisAngle(localCam.up, 2*Math.PI*(newx-_rotInterval.lastx)/360);

    //rotate around right vector
    var yawY= new THREE.Quaternion();
    changed = ( Math.abs(newy-_rotInterval.lasty) >1 );
    if(changed) 
      yawY.setFromAxisAngle(directionRight, 2*Math.PI*(newy-_rotInterval.lasty)/360);

    var yawQ = new THREE.Quaternion();
    yawQ.multiply(yawX).multiply(yawY);//.multiply(yawZ);

    directionFwd.applyQuaternion(yawQ);
    localCam.up.applyQuaternion(yawQ);
    var _navapi = _viewer.navigation;
    newTarget = newPosition.clone().add(directionFwd);
    _navapi.setView(newPosition, newTarget);
    _navapi.orientCameraUp(); 

    _rotInterval = {lastx:newx,lasty:newy,lastz:newz};  

    // get position
/*        var vecPos = cam.position;

    // get view vector
    var vecViewDir = new THREE.Vector3();
    vecViewDir.subVectors(cam.target,cam.position);

    // get length of view vector
    var length = vecViewDir.length();

    // rotate alpha
    var vec = new THREE.Vector3();
    vec.y = length;
    var zAxis = new THREE.Vector3(0,0,1);
    vec.applyAxisAngle(zAxis,THREE.Math.degToRad(alpha));

    // rotate beta
    var vec2 = new THREE.Vector3(vec.x,vec.y,vec.z);
    vec2.normalize();
    vec2.negate();
    vec2.cross(zAxis);
    vec.applyAxisAngle(vec2,THREE.Math.degToRad(beta) + Math.PI / 2);

    // add to camera
    cam.target.addVectors(vecPos,vec);
    _viewer.applyCamera(cam,false);*/
}


Autodesk.Viewing.theExtensionManager.registerExtension('ISYExtensionDeviceOrientation', ISYExtensionDeviceOrientation);