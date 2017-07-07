//=======================================
//
//  Javascript file for Ruby Code Editor
//  by Alexander Schreyer, www.alexschreyer.net
//  See main plugin file for license etc.
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
function cb_open( loc ) {

  // Load a file into the editor
  var a = true
  if (!editor.isClean()) {
    a = confirm('Changes have not been saved. Load a file?')
  }
  if (a) window.location = 'skp:load@'+loc;
  
}


// Save As file callback
function cb_save_as() {

  // First save to textbox
  editor.save();
  // Set to true if backup option is checked
  window.location = "skp:save@"+$('#savebackup').is(':checked')+','+'true';
  
}


// Save file callback
function cb_save() {

  // First save to textbox
  editor.save();
  // Set to true if backup option is checked
  window.location = "skp:save@"+$('#savebackup').is(':checked')+','+'false';
  
}


// Execute callback
function cb_exec() {

  // First save to textbox
  editor.save();
  
  // Need to add timeouts so that everything show up and hides properly
  window.setTimeout ( function() {
    $('.controlgroup').controlgroup( "disable" );
    $('#running').show();
  } , 10 );
  window.setTimeout ( function() {
    // Execute the code
    window.location = "skp:exec@"+$('#doundo').is(':checked');
    $('#running').hide();
    $('.controlgroup').controlgroup( "enable" );
  } , 20 );
  
}


// Quit dialog callback
function cb_quit() {

  // Closing handled by Ruby side now
  window.location = "skp:quit@"+editor.isClean();
  
}


// Add content to the results area and scroll upward
function addResults(txt) {

  $('#results').append('<p>' + txt + '</p>');
  // Scroll to some very large number to move bottom upward
  $('#results').scrollTop(9999);
  
}


// Add file names to MRU
function updateMRU() {

  $("#mru").empty();
  for (i = 0; i < 5; i++) {
    $("#mru").append("<li><a href='#' title='" + arguments[i] + "' onClick=\"cb_open('" + arguments[i] + "');\">" + arguments[i].replace(/^.*[\\\/]/, '') + "</a></li>"); 
  };
  $( "#menu" ).menu( "refresh" );
  
}



//========== jQuery FUNCTIONS - LOAD AT STARTUP ========================


$(document).ready(function(){


  //========== INITIALIZE ELEMENTS ON STARTUP ========================
  
  
  // Set the menu up at the top of the page
  $( "#menu" ).menu({position: {at: "left bottom"}}); 
  
  
  // Set up jQuery UI About dialog        
  $( "#about-dlg" ).dialog({ 
    autoOpen: false,
    modal: true, 
    buttons: { Ok: function() { $( this ).dialog( "close" ); }
    }
  });


  // Set up jQuery UI About dialog        
  $( "#shorts-dlg" ).dialog({ 
    autoOpen: false,
    modal: true, 
    buttons: { Ok: function() { $( this ).dialog( "close" ); }
    }
  });
    
  
  // Set up jQuery UI Preferences dialog
  $( "#option-dlg" ).dialog({ 
    width: 500,
    height: 500,
    autoOpen: false,
    modal: true, 
    buttons: { Ok: function() { $( this ).dialog( "close" ); }
    }
  });  
  
  
  // Create page tabs using jQuery UI
  $('#tabs').tabs(); 
 
  
  // Style the button row as a control group
  $(".controlgroup").controlgroup();     


  // Start the CodeMirror editor and attach it to text area
  // Also set up key shortcuts
  editor = CodeMirror.fromTextArea(document.getElementById("console"), {
    mode: 'ruby',
    theme: 'eclipse',
    tabindex: 1,
    smartIndent: false,
    lineNumbers: true,
    autofocus: 'true',
    highlightSelectionMatches: true,
    matchBrackets: true,
    styleActiveLine: true,
    scrollbarStyle: "simple",
    extraKeys: {
      'Ctrl-Space' : 'autocomplete',
      'Tab' : 'indentMore',
      'Shift-Tab' : 'indentLess',
      "Alt-F" : "findPersistent",
      'Ctrl-N' : function(cm) { cb_new() },
      'Ctrl-O' : function(cm) { cb_open() },
      'Ctrl-S' : function(cm) { cb_save() },
      'Ctrl-P' : function(cm) { printEditor() },
      'Ctrl-R' : function(cm) { cb_exec() },
      'Ctrl-U' : function(cm) { cb('undo') },
      'Ctrl-X' : function(cm) { cb_quit() }
    }
  });
  

  // Initialize code autocompletion
  CodeMirror.commands.autocomplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.surubyHint);
  }  


  // What to do when the editor's content changes
  editor.on("change", function() {
    c = true
  });


  // Blur the menu when editor gets focus
  editor.on("focus", function() {
    $( "#menu" ).menu( "collapseAll", null, true );
  });


  // Initialize the editor
  cb_initialize();
  editor.focus();
  c = false;


  // Straighten out window element sizes
  function sizeWin() {
    newheight = $(window).height()-235;
    $('.CodeMirror').css('height',newheight);
  }


  // Fix editor refresh and sizing when tabs are changed
  $('#tabs').on("tabsactivate", function( event, ui ) {
    editor.refresh();
  });


  // Initialize window element sizes on start
  sizeWin();


  // Resize elements on window resize
  $(window).resize(function() {
    sizeWin();
  });


  //========== SET OR INITIALIZE OPTIONS ========================


  // STYLE SHEETS:
  function changeTheme( color ) {
    if (color == "dark") {
      editor.setOption("theme", "ambiance");
      css_url = "jquery-ui/dark/jquery-ui.css";
    } else {
      editor.setOption("theme", "eclipse");
      css_url = "jquery-ui/light/jquery-ui.css";
    };
    $("link.switcher").attr("href", css_url);
  };
  // Initialize style sheet
  if ($.cookie('stylesheet')!= null) {
    var newcss = $.cookie("stylesheet");
    changeTheme( newcss );
    $("#stylesheet").val( newcss );
  };
  // Change stylesheets dropdown
  $("#stylesheet").change(function() {
    var newcss = $("#stylesheet").val();
    changeTheme( newcss );
    $.cookie('stylesheet', newcss , { path: '/' , expires: 365 });   
  });


  // FONT SIZE:
  // Initialize editor font size
  if ($.cookie('fontsize')!= null) {
    var newsize = $.cookie('fontsize');
    $('.CodeMirror').css('font-size' , newsize+'pt');
    $('#fontsize').val(newsize);
  };
  // Change font size dropdown
  $('#fontsize').change(function(){
    var size = $('#fontsize').val();
    $('.CodeMirror').css('font-size',size+'pt');
    $.cookie('fontsize', size, { path: '/', expires: 365 });
  });  


  // TABS:
  // Initialize tabs option
  if ($.cookie('indentWithTabs')!= null) {
    if ($.cookie('indentWithTabs') == 'false') {
      $('#indentWithTabs').attr('checked',false);
      editor.setOption("indentWithTabs", false);
   } else {
      $('#indentWithTabs').attr('checked',true);
      editor.setOption("indentWithTabs", true);
    }
  };
  // Indent tabs switch checkbox
  $('#indentWithTabs').click(function() {
    $.cookie('indentWithTabs', $('#indentWithTabs').is(':checked'), { path: '/', expires: 365 });
    editor.setOption('indentWithTabs', $('#indentWithTabs').is(':checked'));
  });  
  

  // TAB SIZE:
  // Initialize indent unit
  if ($.cookie('tabsize')!= null) {
    var newsize = $.cookie('tabsize');
    $('#tabsize').val(newsize);
    editor.setOption('indentUnit',parseInt(newsize));
    editor.setOption('tabSize',parseInt(newsize));
  };
  // Save tab size dropdown
  $('#tabsize').change(function(){
    $.cookie('tabsize', $('#tabsize').val(), { path: '/', expires: 365 });
    editor.setOption('indentUnit',parseInt($('#tabsize').val()));
    editor.setOption('tabSize',parseInt($('#tabsize').val()));
  }); 
  

  // SMART INDENT:
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
  // Smart indent switch checkbox
  $('#smartIndent').click(function() {
    $.cookie('smartIndent', $('#smartIndent').is(':checked'), { path: '/', expires: 365 });
    editor.setOption('smartIndent', $('#smartIndent').is(':checked'));
  });  
  

  // LINENUMBERS:
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


  // BACKUP:
  // Initialize backup option
  if ($.cookie('savebackup')!= null) {
    $('#savebackup').val($.cookie('savebackup'));
    if ($.cookie('savebackup') == 'false')
      $('#savebackup').attr('checked',false)
    else
      $('#savebackup').attr('checked',true)
  };
  // Save backup checkbox
  $('#savebackup').click(function() {
    $.cookie('savebackup', $('#savebackup').is(':checked'), { path: '/', expires: 365 });
    $('#savebackup').val($('#savebackup').is(':checked'));
  });
  

  // SINGLE UNDO:
  // Initialize single undo option
  if ($.cookie('doundo')!= null) {
    $('#doundo').val($.cookie('doundo'));
    if ($.cookie('doundo') == 'false')
      $('#doundo').attr('checked',false)
    else
      $('#doundo').attr('checked',true)
  };
  // Do undo checkbox
  $('#doundo').click(function() {
    $.cookie('doundo', $('#doundo').is(':checked'), { path: '/', expires: 365 });
    $('#doundo').val($('#doundo').is(':checked'));
  });
  

  // LOAD PATHS:
  // Initialize load paths
  if ($.cookie('loadpath1')!= null) {
    $('#loadpath1').val($.cookie('loadpath1'));
  };
  if ($.cookie('loadpath2')!= null) {
    $('#loadpath2').val($.cookie('loadpath2'));
  };
  // Load paths
  $('#loadpath1').change(function() {
    $.cookie('loadpath1', $('#loadpath1').val(), { path: '/', expires: 365 });
  });
  $('#loadpath2').change(function() {
    $.cookie('loadpath2', $('#loadpath2').val(), { path: '/', expires: 365 });
  });  


  //========== INTERACTIVE ELEMENTS ========================


  // Insert snippets from dropdown at cursor
  $('#snippets').change(function(){
  
    field = $('#snippets');
    pos = editor.getCursor();
    editor.replaceSelection(field.val());
    // Put cursor at beginning of snippet again
    editor.setCursor(pos);
    // Reset dropdown to first option
    field.val($('option:first', field).val());
    editor.focus();
    
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
    
  });  


}); // END jQuery.ready



//========== Print code ========================


function printEditor() {

  // Render the entire code temporarily so that we can print it.
  var currMargin = editor.getOption( 'viewportMargin' );
  var currWrap = editor.getOption( 'lineWrapping' );
  editor.setOption( 'viewportMargin' , Infinity );
  editor.setOption( 'lineWrapping' , true );
  editor.refresh();
  
  window.print();
  
  // Reset temporary options
  editor.setOption( 'viewportMargin' , currMargin );
  editor.setOption( 'lineWrapping' , currWrap );
  editor.refresh();
  
};