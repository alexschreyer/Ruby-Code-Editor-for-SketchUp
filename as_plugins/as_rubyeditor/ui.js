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

// Set editor as unchanged on startup
var c = false;

// Initialize temporary variable
var tmp = '';

//========== SKETCHUP CALLBACKS ========================

// Generic callback function
function cb(name, args) {
  window.location='skp:'+name+'@'+args;
}

// New file callback
function cb_new() {
  var a = confirm("Changes will be lost. Clear editor?");
  if (a) window.location = "skp:new";
  // Copy console content to editor
  // editor.setValue($('#console').val());
}

// Open file callback
function cb_open() {
// Load a file into the editor
  if (c) {
    var a = confirm('Changes have not been saved. Load a file?')
    if (a) window.location = 'skp:load';
  }
  else window.location = 'skp:load';
  // Copy console content to editor
  // editor.setValue($('#console').val());
}

// Save file callback
function cb_save() {
  // First save to textbox
  editor.save();
  // if (c) window.location = "skp:save";
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

// TODO: Can this go?
function inc_rows(id, v) {
  var c = document.getElementById(id)
    var rows = c.rows
    c.rows = c.rows + v
}

// Quit dialog callback
function cb_quit() {
  if (c) {
    var a = confirm("Changes have not been saved. Quit this editor?")
      if (a) window.location = "skp:quit";
  }
  else window.location = "skp:quit";
}

// Close window function
window.onbeforeunload = function(){
  // q();
  // This doesn't seem to work in SU - works fine in IE
  // return 'Your changes may not have been saved. Do you really wish to close this editor window?';
}

//========== jQuery FUNCTIONS - LOAD AT STARTUP ========================

$(document).ready(function(){

  //========== INITIALIZE ELEMENTS ON STARTUP ========================

  // Create page tabs using jQuery UI
  $('#tabs').tabs();

  // Style all buttons using jQuery UI
  $(".button").button();

  // Fix editor gap issue at top of IE editor
  $(".CodeMirror div pre:first").css("position","absolute");

  // Initialize selections from cookies
  if ($.cookie('fontsize')!= null) {
    var newsize = $.cookie('fontsize');
    $('.CodeMirror').css('font-size' , newsize+'pt');
    $('#fontsize').val(newsize);
  };

  if ($.cookie('tabsize')!= null) {
    var newsize = $.cookie('tabsize');
    $('#tabsize').val(newsize);
  };

  if ($.cookie('indentmode')!= null) {
    var newsize = $.cookie('indentmode');
    $('#indentmode').val(newsize);
  };

  // TODO: This doesn't seem to work
  if ($.cookie('linenum')!= null) {
    if ($.cookie('linenum') == 'false') {
      $('#linenum').attr('checked',false);
      $('.CodeMirror-gutter').hide();
   } else {
      $('#linenum').attr('checked',true);
      $('.CodeMirror-gutter').show();
    }
  };

  if ($.cookie('savebackup')!= null) {
    $('#savebackup').val($.cookie('savebackup'));
    if ($.cookie('savebackup') == 'false')
      $('#savebackup').attr('checked',false)
    else
      $('#savebackup').attr('checked',true)
  };

  // TODO: Still some issues with this...
  if ($.cookie('doundo')!= null) {
    $('#doundo').val($.cookie('doundo'));
    if ($.cookie('doundo') == 'false')
      $('#doundo').attr('checked',false)
    else
      $('#doundo').attr('checked',true)
  };

  if ($.cookie('css')!= null) {
    newcss = $.cookie("css");
    $('link.switcher').attr('href',newcss);
    $("#stylesheet").val(newcss);
  };

  // Initialize window element sizes on start
  newheight = $(window).height()-270;
  $('.CodeMirror').css('height',newheight);
  newheight = $(window).height()-100;
  $('.webbox').css('height',newheight);

  // Resize elements on window resize
  $(window).resize(function() {
    newheight = $(window).height()-270;
    $('.CodeMirror').css('height',newheight);
    newheight = $(window).height()-100;
    $('.webbox').css('height',newheight);
  });

  // Set back/forward buttons in browser different for Safari
  var browser;
  if($.browser.safari) {
    $('#backbutton').css('display','none');
    $('#nextbutton').css('display','none');
  };

  //========== INTERACTIVE ELEMENTS ========================

  // Change iFrame url location dropdown
  $('#browselinks').change(function(objEvent){
    var loc = $('#browselinks').val();
    $('#ibrowser').attr("src",loc);
  });

  // Change font size dropdown
  $('#fontsize').change(function(objEvent){
    var size = $('#fontsize').val();
    $('.CodeMirror').css('font-size',size+'pt');
    $.cookie('fontsize', size, { path: '/', expires: 365 });
  });

  // Save tab size dropdown
  $('#tabsize').change(function(objEvent){
    $.cookie('tabsize', $('#tabsize').val(), { path: '/', expires: 365 });
    editor.setOption('indentUnit',$('#tabsize').val());
  });

  // Indent on enter dropdown
  $('#indentmode').change(function(objEvent){
    $.cookie('indentmode', $('#indentmode').val(), { path: '/', expires: 365 });
    editor.setOption('enterMode',$('#indentmode').val());
  });

  // Show line numbers checkbox
  $('#linenum').click(function() {
    $.cookie('linenum', $('#linenum').is(':checked'), { path: '/', expires: 365 });
    if ($('#linenum').is(':checked')) {
      $('.CodeMirror-gutter').show();
    } else {
      $('.CodeMirror-gutter').hide();
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
  $('#pzoom').change(function(objEvent){
    var newzoom = $('#pzoom').val()+'%';
    $('#ibrowser').css('zoom',newzoom);
  });

  // Change stylesheets dropdown
  $("#stylesheet").change(function(objEvent) {
    css_url = $("#stylesheet").val();
    $("link.switcher").attr("href",css_url);
    $.cookie('css',css_url, { path: '/' , expires: 365 });
  });

  // Change editor code languages dropdown
  $("#lang").change(function(objEvent) {
    editor.setOption('mode', $("#lang").val());
    // Disable run buttons if it's not Ruby
    if ($("#lang").val() == "ruby") {
      $( "#exec_area a" ).button( "option", "disabled", false );
    } else {
      $( "#exec_area a" ).button( "option", "disabled", true );
    };
    // Refresh the editor so that the color changes take effect immediately
    editor.refresh();
    editor.undo();
    editor.redo();
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
            msg += "You have the latest version.";
        }
        alert(msg);
    });

  });

  //========== TEXT INSERTION / AUTOCOMPLETE ========================

  // Insert snippets at cursor
  $('#snippets').change(function(objEvent){
    field = $('#snippets');
    editor.replaceSelection(field.val());
    // Reset dropdown to first option
    field.val($('option:first', field).val());
  });

});

//========== Print code ========================

function printMe(container) {
  var DocumentContainer = document.getElementById(container);
  var WindowObject = window.open("","PrintWindow","width=500,height=500,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
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