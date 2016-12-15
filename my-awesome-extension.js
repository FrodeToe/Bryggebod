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
 
      button.setToolTip('Press to skål');
 
      // Only create a toggler for our button if it has an unclick operation
 
      button.onClick = function () { alert('SKÅÅÅÅL!'); };
 
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
  'MyAwesomeExtension',
  Bryggebod.Extension.Toolbar
);