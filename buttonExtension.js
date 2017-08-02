///////////////////////////////////////////////////////////////////////////////
// Bryggebod.Extension.Toolbar
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace('Bryggebod.Extension');
 
Bryggebod.Extension.Toolbar = function (viewer, options) {
 
  Autodesk.Viewing.Extension.call(this, viewer, options);
 
  var _viewer = viewer;
 
  var _this = this;

  var originalTarget;
 
  _this.load = function () {
 
    createToolbar();
 
    console.log('Bryggebod.Extension.Toolbar loaded');
 
    return true;
  };
 
  _this.unload = function () {
 
    deleteToolbar();
 
    console.log('Bryggebod.Extension.Toolbar unloaded');
 
    return true;
  };
 
  function createToolbar() {
 
    var toolbar = new Autodesk.Viewing.UI.ToolBar('toolbar-TtIf');
 
    var ctrlGroup = new Autodesk.Viewing.UI.ControlGroup(
      'Bryggebod.Extension.Toolbar.ControlGroup'
    );
 
    ctrlGroup.addClass('toolbar-vertical-group');
 
    // Names, icons and tooltips for our toolbar buttons
 


      // Start by creating the button
 
    var button = new Autodesk.Viewing.UI.Button(
        'Bryggebod.Extension.Toolbar.Skaal'
      );
 
      // Assign an icon
      button.icon.className = 'glyphicon glyphicon-globe';
      button.icon.style = 'font-size:29px;';
 
      // Set the tooltip
 
      button.setToolTip('Info');
 
      // Only create a toggler for our button if it has an unclick operation

      button.onClick = createToggler(button, click, unclick);
 
     // button.onClick = function () { 
     //   oViewer.loadExtension('ISYExtensionDeviceOrientation',{});
        //alert('SKÅL!'); 
        /*if (oViewer.getSelection().length > 0) {
           var objSelected = oViewer.getSelection()[0];
           oViewer.getProperties(objSelected, propCallback, propErrorCallback);
           
        }
        else
        {
          originalTarget = oViewer.getCamera().target;
          var cam = oViewer.getCamera();
            //Monitor Device Orientation
            if(window.DeviceOrientationEvent){
                window.addEventListener("deviceorientation", orientation, false); 

            }else{
                alert("DeviceOrientationEvent is not supported");
            }
        }*/
      //};
 
      ctrlGroup.addControl(button);

    toolbar.addControl(ctrlGroup);
 
    var toolbarDivHtml = '<div id="divToolbar"> </div>';
 
    $(_viewer.container).append(toolbarDivHtml);
 
    // We want our toolbar to be centered vertically on the page
 
    toolbar.centerToolBar = function () {
      $('#divToolbar').css({
        'top': 'calc(50% + ' + toolbar.getDimensions().height / 2 + 'px)'
      });
    };
 
    toolbar.addEventListener(
      Autodesk.Viewing.UI.ToolBar.Event.SIZE_CHANGED,
      toolbar.centerToolBar
    );
 
    // Start by placing our toolbar off-screen (top: 0%)
 
    $('#divToolbar').css({
      'top': '0%',
      'left': '0%',
      'z-index': '100',
      'position': 'absolute'
    });
 
    $('#divToolbar')[0].appendChild(toolbar.container);
 
    // After a delay we'll center it on screen
 
    setTimeout(function () { toolbar.centerToolBar(); }, 100);
  }

  function click(){
    oViewer.loadExtension('ISYExtensionDeviceOrientation',{});
  }

  function unclick(){
    oViewer.unloadExtension('ISYExtensionDeviceOrientation',{});
  }

  function orientation(event){

    //just for demo, rephrase the data
    var x = parseInt(event.alpha); 
    var y =  parseInt(event.beta) ;
    var z =  parseInt(event.gamma) ;
/*var axis = new THREE.Vector3(0,0,1);
var vec = originalTarget;
vec.applyAxisAngle ( axis, THREE.Math.degToRad(x) );
*/


    var cam = oViewer.getCamera();
 var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis
//    oViewer.utilities.transitionView(cam.position,vec,cam.fov,cam.up,cam.up,false,cam.target);
var euler = new THREE.Euler();
//euler.set( THREE.Math.degToRad(event.alpha), THREE.Math.degToRad(event.beta), - THREE.Math.degToRad(event.gamma), 'XYZ' );
euler.set( THREE.Math.degToRad(event.alpha), 0, 0, 'XYZ' );
cam.rotation = euler;
cam.quaternion.setFromEuler( euler );
cam.quaternion.multiply( q1 ); // camera looks out the back of the device, not the top
cam.quaternion.multiply( q0.setFromAxisAngle( zee, - event.orient ) ); // adjust for screen orientation

oViewer.applyCamera(cam,false);
   // alert('pos = ' + x + ' ' + y + ' ' + z );

    // display the value
   /* var thistext = x + ', '
        + y + ', '
        + z;
    $('#gyrobig').text(thistext);

    //avoid frequent emmit
     var tol = 2;
    if(Math.abs(r-lastr ) >tol|| Math.abs(g-lastg ) >tol || Math.abs(b-lastb ) >tol)
    {
        //element ID has not been used by this demo yet. reserve for future
        var IoTJson = {elementID:'183911',GyroData:{alpha:x,beta:y,gamma:z}};
        socket.emit('au_Gyro',JSON.stringify(IoTJson)); 
    }*/
}

  function propCallback(data) {

    // Check if we got properties. 
    if ((data.properties == null) || (data.properties.length == 0)) {
        str = "no properties";
        return;
    }

    // Iterate over properties and put together 
    // a list of property's name/value pairs to diplay. 
    
    var propSize = data.properties.length;

    var type = '';
    var area = '';
    var slope = '';
    var length = '';
    for (var i = 0; i < propSize; i++) {
        var obj = data.properties[i];
        if(obj.displayName === 'Type Name')
          type = obj.displayValue;
        if(obj.displayName == 'Area')
          area = obj.displayValue;
        if(obj.displayName == 'Length')
          length = obj.displayValue;
        if(obj.displayName == 'Slope')
          slope = obj.displayValue;
      //  str += obj.displayName + ": " + obj.displayValue + "\n";
    }

    var str = 'Type: ';
    if(type != '')
      str += type;
    if(area != '')
      str += '\nArea: ' + area.toFixed(2);
    if(length != '')
      str += '\nLength: ' + length.toFixed(2);
    if(slope != '')
      str += '\nSlope: ' + slope.toFixed(2);
    alert(str);
}

function propErrorCallback(data) {
    var txtArea = document.getElementById("TextAreaResult");
    txtArea.value = "error in getProperties.";
}
 
  function deleteToolbar() {
    $('#divToolbar').remove();
  }
 
  function createToggler(button, click, unclick) {
    return function () {
      var state = button.getState();
      if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {
        button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        click();
      } else if (state === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        unclick();
      }
    };
  }
 
  function setVisibility(panel, flag) {
    if (panel)
      panel.setVisible(flag);
  }
 
  var css = [
 
    '.myicon {',
      'font-size: 20px;',
      'padding-top: 1px !important;',
    '}',
 
    '.toolbar-vertical-group > .adsk-button > .adsk-control-tooltip {',
      'left: 120%;',
      'bottom: 25%;',
    '}'
  ].join('\n');
 
  $('<style type="text/css">' + css + '</style>').appendTo('head');
};
 
 
Bryggebod.Extension.Toolbar.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);
 
Bryggebod.Extension.Toolbar.prototype.constructor =
  Bryggebod.Extension.Toolbar;
 
Autodesk.Viewing.theExtensionManager.registerExtension(
  'buttonExtension',
  Bryggebod.Extension.Toolbar
);