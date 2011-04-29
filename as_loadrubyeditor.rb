# Loader for as_plugins/as_rubyeditor/as_rubyeditor.rb

require 'sketchup.rb'
require 'extensions.rb'

as_rubyeditor = SketchupExtension.new "Ruby Code Editor", "as_plugins/as_rubyeditor/as_rubyeditor.rb"
as_rubyeditor.copyright= 'Copyright 2010 Alexander C. Schreyer'
as_rubyeditor.creator= 'Alexander C. Schreyer, www.alexschreyer.net'
as_rubyeditor.version = '1.2'
as_rubyeditor.description = "This code editor allows creating and modifying Ruby scripts within SketchUp. These scripts can be used to create geometry, add functionality or add data within the SketchUp 3D modeling environment."
Sketchup.register_extension as_rubyeditor, true
