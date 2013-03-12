//=======================================
//
//  Javascript file for Ruby Code Editor
//  by Alexander Schreyer
//  www.alexschreyer.net
//  See main plugin file for license
//
//=======================================



// Initialize version number - updated from Ruby file
var rceVersion = "unknown";

// Initialize temporary variable
var tmp = '';



//========== SKETCHUP CALLBACKS ========================



// Generic callback function
function cb(name, args) {
  window.location='skp:'+name+'@'+args;
}


// Initialize callback
function cb_initialize() {
  window.location = "skp:new";
}


// New file callback
function cb_new() {
  // Clear editor and load default snippet
  var a = true
  if (!editor.isClean()) {
    a = confirm("Changes will be lost. Clear editor?");
  }
  if (a) window.location = "skp:new";
}


// Open file callback
function cb_open() {
  // Load a file into the editor
  var a = true
  if (!editor.isClean()) {
    a = confirm('Changes have not been saved. Load a file?')
  }
  if (a) window.location = 'skp:load';
}


// Save file callback
function cb_save() {
  // First save to textbox
  editor.save();
  // Set to true if backup option is checked
  window.location = "skp:save@"+$('#savebackup').is(':checked');
}


// Execute callback
function cb_exec() {
  // First save to textbox
  editor.save();
  $('#runbutton').hide();
  $('#running').show();
  window.location = "skp:exec@"+$('#doundo').is(':checked');
  $('#runbutton').show();
  $('#running').hide();
}


// Quit dialog callback
function cb_quit() {
  // var a = true
  // if (!editor.isClean()) {
  //   a = confirm("Changes have not been saved. Quit this editor?")
  // }
  // if (a) window.location = "skp:quit";

  // Closing handled by Ruby side now
  window.location = "skp:quit@"+editor.isClean();
}


// Close window function
window.onbeforeunload = function(e){
  // q();
  // This doesn't seem to work in SU - works fine in IE
  // return 'Your changes may not have been saved. Do you really wish to close this editor window?';
}


// Add content to the results area and scroll upward
function addResults(txt) {
  $('#results').append('<p>' + txt + '</p>');
  // Scroll to some very large number to move bottom upward
  $('#results').scrollTop(9999);
}



//========== jQuery FUNCTIONS - LOAD AT STARTUP ========================


$(document).ready(function(){



  //========== INITIALIZE ELEMENTS ON STARTUP ========================


  // Initialize code autocompletion
  CodeMirror.commands.autocomplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.surubyHint);
  }


  // Start the CodeMirror editor and attach it to text area
  editor = CodeMirror.fromTextArea(document.getElementById("console"), {
    mode: 'ruby',
    theme: 'ambiance',
    tabindex: 1,
    smartIndent: false,
    lineNumbers: true,
    autofocus: 'true',
    highlightSelectionMatches: true,
    matchBrackets: true,
    styleActiveLine: true,
    extraKeys: {
      'Ctrl-Space' : 'autocomplete',
      'Tab' : 'indentMore',
      'Shift-Tab' : 'indentLess'
    }
  });


  // What to do when the editor's content changes
  editor.on("change", function() {
    c = true
  });


  // Initialize the editor
  cb_initialize();
  editor.focus();
  c = false;


  // Straighten out window element sizes
  function sizeWin() {
    newheight = $(window).height()-270;
    $('.CodeMirror').css('height',newheight);
    newheight = $(window).height()-100;
    $('.webbox').css('height',newheight);
  }


  // Create page tabs using jQuery UI
  $('#tabs').tabs();


  // Fix editor refresh and sizing when tabs are changed
  $('#tabs').on("tabsactivate", function( event, ui ) {
    // editor.setSize(null,'100%');
    // sizeWin();
    editor.refresh();
  });


  // Style all buttons using jQuery UI
  $(".button").button();


  // Initialize window element sizes on start
  sizeWin();


  // Resize elements on window resize
  $(window).resize(function() {
    sizeWin();
  });



  //========== INITIALIZE OPTIONS ON STARTUP ========================


  // Initialize editor font size
  if ($.cookie('fontsize')!= null) {
    var newsize = $.cookie('fontsize');
    $('.CodeMirror').css('font-size' , newsize+'pt');
    $('#fontsize').val(newsize);
  };


  // Indent with tabs option
  if ($.cookie('indentWithTabs')!= null) {
    if ($.cookie('indentWithTabs') == 'false') {
      $('#indentWithTabs').attr('checked',false);
      editor.setOption("indentWithTabs", false);
   } else {
      $('#indentWithTabs').attr('checked',true);
      editor.setOption("indentWithTabs", true);
    }
  };


  // Initialize indent unit
  if ($.cookie('tabsize')!= null) {
    var newsize = $.cookie('tabsize');
    $('#tabsize').val(newsize);
    editor.setOption('indentUnit',parseInt(newsize));
    editor.setOption('tabSize',parseInt(newsize));
  };


  // SmartIndent option
  if ($.cookie('smartIndent')!= null) {
    if ($.cookie('smartIndent') == 'false') {
      $('#smartIndent').attr('checked',false);
      editor.setOption("smartIndent", false);
   } else {
      $('#smartIndent').attr('checked',true);
      editor.setOption("smartIndent", true);
    }
  };


  // Initialize line numbers
  if ($.cookie('linenum')!= null) {
    if ($.cookie('linenum') == 'false') {
      $('#linenum').attr('checked',false);
      editor.setOption("lineNumbers", false);
   } else {
      $('#linenum').attr('checked',true);
      editor.setOption("lineNumbers", true);
    }
  };


  // Initialize backup option
  if ($.cookie('savebackup')!= null) {
    $('#savebackup').val($.cookie('savebackup'));
    if ($.cookie('savebackup') == 'false')
      $('#savebackup').attr('checked',false)
    else
      $('#savebackup').attr('checked',true)
  };


  // Initialize single undo option
  if ($.cookie('doundo')!= null) {
    $('#doundo').val($.cookie('doundo'));
    if ($.cookie('doundo') == 'false')
      $('#doundo').attr('checked',false)
    else
      $('#doundo').attr('checked',true)
  };


  // Initialize style sheet
  if ($.cookie('stylesheet')!= null) {
    newcss = $.cookie("stylesheet");
    if (newcss == "dark") {
      editor.setOption("theme", "ambiance");
      css_url = "jquery-ui/ui-darkness/jquery-ui.css";
    } else if (newcss == "light"){
      editor.setOption("theme", "eclipse");
      css_url = "jquery-ui/ui-lightness/jquery-ui.css";
    } else {
      editor.setOption("theme", "eclipse");
      css_url = "jquery-ui/redmond/jquery-ui.css";
    };
    $("link.switcher").attr("href",css_url);
    $("#stylesheet").val(newcss);
  };


  // Set back/forward buttons in browser different for Safari
  // jQuery.browser deprecated - use .support instead.
  /*
  var browser;
  if($.browser.safari) {
    $('#backbutton').css('display','none');
    $('#nextbutton').css('display','none');
  };
  */


  //========== INTERACTIVE ELEMENTS ========================


  // Tab 1:


  // Insert snippets from dropdown at cursor
  $('#snippets').change(function(){
    field = $('#snippets');
    pos = editor.getCursor();
    editor.replaceSelection(field.val());
    // Put cursor at beginning of snippet again
    editor.setCursor(pos);
    // Reset dropdown to first option
    field.val($('option:first', field).val());
  });


  // Change editor code languages dropdown
  $("#lang").change(function() {
    editor.setOption('mode', $("#lang").val());
    // Disable run buttons if it's not Ruby
    if ($("#lang").val() == "ruby") {
      $( "#exec_area a" ).button( "option", "disabled", false );
    } else {
      $( "#exec_area a" ).button( "option", "disabled", true );
    };
    // Refresh the editor so that the color changes take effect immediately
    editor.refresh();
    // editor.undo();
    // editor.redo();
  });


  // Tab 2:


  // Change iFrame url location dropdown
  $('#browselinks').change(function(){
    var loc = $('#browselinks').val();
    $('#ibrowser').attr("src",loc);
  });


  // Tab 3:


  // Change font size dropdown
  $('#fontsize').change(function(){
    var size = $('#fontsize').val();
    $('.CodeMirror').css('font-size',size+'pt');
    $.cookie('fontsize', size, { path: '/', expires: 365 });
  });


  // Indent tabs switch checkbox
  $('#indentWithTabs').click(function() {
    $.cookie('indentWithTabs', $('#indentWithTabs').is(':checked'), { path: '/', expires: 365 });
    editor.setOption('indentWithTabs', $('#indentWithTabs').is(':checked'));
  });


  // Save tab size dropdown
  $('#tabsize').change(function(){
    $.cookie('tabsize', $('#tabsize').val(), { path: '/', expires: 365 });
    editor.setOption('indentUnit',parseInt($('#tabsize').val()));
    editor.setOption('tabSize',parseInt($('#tabsize').val()));
  });


  // Smart indent switch checkbox
  $('#smartIndent').click(function() {
    $.cookie('smartIndent', $('#smartIndent').is(':checked'), { path: '/', expires: 365 });
    editor.setOption('smartIndent', $('#smartIndent').is(':checked'));
  });


  // Show line numbers checkbox
  $('#linenum').click(function() {
    $.cookie('linenum', $('#linenum').is(':checked'), { path: '/', expires: 365 });
    if ($('#linenum').is(':checked')) {
      editor.setOption("lineNumbers", true);
      sizeWin();
    } else {
      editor.setOption("lineNumbers", false);
      sizeWin();
    };
  });


  // Save backup checkbox
  $('#savebackup').click(function() {
    $.cookie('savebackup', $('#savebackup').is(':checked'), { path: '/', expires: 365 });
    $('#savebackup').val($('#savebackup').is(':checked'));
  });


  // Do undo checkbox
  $('#doundo').click(function() {
    $.cookie('doundo', $('#doundo').is(':checked'), { path: '/', expires: 365 });
    $('#doundo').val($('#doundo').is(':checked'));
  });


  // Change iFrame zoom dropdown
  $('#pzoom').change(function(){
    var newzoom = $('#pzoom').val();
    $('#ibrowser').removeClass().addClass(newzoom);
  });


  // Change stylesheets dropdown
  $("#stylesheet").change(function() {
    if ($("#stylesheet").val() == "dark") {
      editor.setOption("theme", "ambiance");
      css_url = "jquery-ui/ui-darkness/jquery-ui.css";
    } else if ($("#stylesheet").val() == "light"){
      editor.setOption("theme", "eclipse");
      css_url = "jquery-ui/ui-lightness/jquery-ui.css";
    } else {
      editor.setOption("theme", "eclipse");
      css_url = "jquery-ui/redmond/jquery-ui.css";
    };
    $("link.switcher").attr("href",css_url);
    $.cookie('stylesheet',$("#stylesheet").val(), { path: '/' , expires: 365 });
  });



  //========== UPDATE CHECKING ========================
  // Now uses www.sketchupplugins.com data


  $('#updatecheck').click(function(){
    // # Use correct plugin ID below
    var plugin_id = '22';
    // Check via JSON
    $.getJSON('http://sketchupplugins.com/get/single.php?callback=?',
      { id : plugin_id},
      function(data) {
        var msg = "Ruby Code Editor - Update Check\n\n";
        if (data.version[0] > rceVersion) {
            msg += "New version available! (" + data.version[0] + ")";
        } else {
            msg += "You have the latest version (" + rceVersion + ")";
        }
        alert(msg);
    });
  });


}); // END jQuery.ready



//========== Print code ========================


function printMe(container) {
  var DocumentContainer = document.getElementById(container);
  var WindowObject = window.open("","PrintWindow","width=500,height=500,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes","false");
  // TODO: Doesn't create plain text on mac:
  WindowObject.document.open("text/plain");
  WindowObject.document.writeln("FILE NAME: "+$('#save_filename').val());
  WindowObject.document.writeln("====================================");
  WindowObject.document.writeln("");
  WindowObject.document.writeln(editor.getValue().replace(/\r?\n|\r/g, "\r\n"));
  WindowObject.document.close();
  WindowObject.focus();
  WindowObject.print();
  WindowObject.close();
};