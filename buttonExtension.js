///////////////////////////////////////////////////////////////////////////////
// Bryggebod.Extension.Toolbar
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace('Bryggebod.Extension');
 
Bryggebod.Extension.Toolbar = function (viewer, options) {
 
  Autodesk.Viewing.Extension.call(this, viewer, options);
 
  var _viewer = viewer;
 
  var _this = this;
 
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
      button.icon.className = 'glyphicon glyphicon-thumbs-up';
      button.icon.style = 'font-size:29px;';
 
      // Set the tooltip
 
      button.setToolTip('Info');
 
      // Only create a toggler for our button if it has an unclick operation
 
      button.onClick = function () { 
        //alert('SKÅL!'); 
        if (oViewer.getSelection().length > 0) {
           var objSelected = oViewer.getSelection()[0];
           oViewer.getProperties(objSelected, propCallback, propErrorCallback);
           
        }
        else
        {
            //Monitor Device Orientation
            if(window.DeviceOrientationEvent){
                window.addEventListener("deviceorientation", orientation, false); 

            }else{
                alert("DeviceOrientationEvent is not supported");
            }
        }
      };
 
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

  function orientation(event){

var camera = oViewer.getCamera();
var controls = new THREE.DeviceOrientationControls( camera );
    //just for demo, rephrase the data
 /*   var x = event.alpha/10; 
    var y =  event.beta/10 ;
    var z =  event.gamma/10 ;

var camera = oViewer.getCamera();


  camera.position = new THREE.Vector3(x, y, z);
  //oViewer.navigation.setWorldUpVector(camera.up);
 
  // This performs a smooth view transition (we might also use
  // setView() to get there more directly)
 
  oViewer.utilities.transitionView(
    camera.position, camera.target,
    camera.fov, camera.up, camera.up, true, camera.target
  );

   /* oViewer.setViewFromArray([
    camera.position.x,
    camera.position.y,
    camera.position.z,
    x,
    y,
    z,
    camera.up.x,
    camera.up.y,
    camera.up.z,
    camera.aspect,
    camera.fov,
    camera.orthoScale,
    camera.isPerspective
    ]);
    /*var camera = oViewer.getCamera();
    camera.x = x;
    camera.y = y;
    camera.z = z;
    oViewer.applyCamera(camera);
   /* alert('pos = ' + x + ' ' + y + ' ' + z );

    // display the value
    var thistext = x + ', '
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