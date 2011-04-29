=begin

Copyright 2010-2011, Alexander C. Schreyer
All rights reserved

THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE.

License:        GPL (http://www.gnu.org/licenses/gpl.html)

Author :        Alexander Schreyer, www.alexschreyer.net, mail@alexschreyer.net
Website:        http://www.alexschreyer.net/projects/sketchup-ruby-code-editor

Name :          Ruby Code Editor
Version:        2.0
Date :          4/12/2011

Description :   Adds a Ruby code editor to the SketchUp WINDOWS menu. This
                editor was built based on Jim Folz's WebConsole but offers many
                new features.
Usage :         Just click on the menu item and edit away.

History:        1.0 (2/3/2010):
                    - first version
                1.1 (2/22/2010):
                    - Changed webdialog internal name for compatibility
                    - Better looking dropdowns under IE Win
                    - Fixed save filename preselect problem
                    - Better code execution and error catching (thanks to Dan Rathbun)
                    - Faster file loading for large files
                    - Added cookie-based saving of preferences (expires after 365 days)
                    - Added changeable user interface
                    - Modified some references
                1.1.1 (2/25/2010):
                    - Safari-related fixes (cookies, text insert, removed back button)
                1.1.2 (3/8/2010)
                    - Removed nav buttons also for IE because they disabled execution after a while
                    - Renamed some code elements
                    - Added wrapper module
                1.2 (4/13/2010)
                    - Updated jQuery UI to v. 1.8
                    - Added object explorer button to show current selection details
                    - Added attribute explorer button for selection attributes
                    - Added button to show Ruby console
                    - Modified code a bit
                    - Changed buttons to images for space reasons
                    - Fixed keyboard access (Alt+...)
                    - Added pages to browser: Edges to Rubies, Ruby core and Google search
                    - Added basic update checking
                    - Enabled browser buttons again - except for Safari
                    - Waiting icon shown while code executes
                2.0 (4/12/2011)
                    - Switched editor to use CodeMirror - sooo much better!
                    - Added code coloring for several languages (Ruby, HTML, CSS, JavaScript, XML, C/Java)
                    - Can handle large files easily
                    - Added bracket matching
                    - Added coloring changer
                    - Disabling run button if code is not Ruby
                    - Added some more options
                    - Added option to disable single undo
                    - Added color coding for SU classes
                    - Fixed problem with loading/saving slashes in files
                    - Updated jQuery and jQuery UI
                    - Results window is now continuous and scrolls
                    - Added some more code snippets to dropdown
                    - Added toolbar item
                    - Moved menu item to "Windows" menu
                    - Added settings file for modifications
                    - Added code printing
                    
                    
To-Do List:     - Highlighting for color light schemes
                - Multiple files
                - Autocomplete (soon!)
                
Isues:          - Page zoom does not work well in reference browser - just use this as a backup if the font is unreadable
                - Doesn't like to work when other code editors are running in SketchUp - Just restart SketchUp
                - Coloring sometimes needs text change to update
                
                
=================================================================

This plugin was originally based on Jim Foz's Web Console:

webconsole.rb Copyright (C) 2006 jim.foltz@gmail.com

This software is free to use, copy, modify and disribute, but
if you do, I'd like to know about it.
This software comes with no warranty.

=================================================================

This plugin uses CodeMirror 2:
http://codemirror.net/

Copyright (C) 2011 by Marijn Haverbeke <marijnh@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

=================================================================

=end


require 'sketchup'


# Check for platform first
AS_SU_OS = (Object::RUBY_PLATFORM =~ /mswin/i) ? :windows :
  ((Object::RUBY_PLATFORM =~ /darwin/i) ? :mac : :other)
# Then get support file
as_rce_settingsFile = File.dirname(__FILE__).split("/").join("\\") + "\\" + 'as_rubyeditor_settings.rb'
if AS_SU_OS != 'windows'
  as_rce_settingsFile = as_rce_settingsFile.split("\\").join("/")
end
load as_rce_settingsFile


module AS_RubyEditor


  # Creates new class
  class RubyEditor < UI::WebDialog


      # Initialize class and callbacks
      def initialize
      
      
        # Some variables
        @rceVersion = "2.0"
        @initCode = $initCode
        @snip_dir = $workingDir
        @snip_dir = @snip_dir.split("/").join("\\") + "\\"
        if AS_SU_OS != 'windows'
          @snip_dir = @snip_dir.split("\\").join("/") + "/"
        end
        
        
        # Moved these to setup file
        # @initCode = 'mod = Sketchup.active_model # Open model\nent = mod.entities # All entities in model\nsel = mod.selection # Current selection'
        # @snip_dir = File.join( File.dirname(__FILE__), $snippetsDirName)

        super "Ruby Code Editor", false, "RubyCodeEditor", 800, 700, 100, 100, true
        set_file( File.join( File.dirname(__FILE__), "ui.html") )


        # Callback to execute Ruby code in SketchUp
        add_action_callback("exec") do |dlg, params|
          dlg.execute_script("$('#results').append('Running the code...<br>')")
          dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
          v = dlg.get_element_value('console').strip
          # puts v
          r = nil
          begin
            # Should we wrap everything in an undo?
            if params == 'true'
              Sketchup.active_model.start_operation "RubyEditor"
            end
            begin # evaluation
              r = eval v
            rescue => e
              r = e
              raise # pass to outer rescue clause
            end # evaluation
          rescue
            Sketchup.active_model.abort_operation
            r = 'Run aborted (error has occurred)'
          else # only do if NO errors
            if params == 'true'
              Sketchup.active_model.commit_operation
            end
          ensure # always do this
            r!=nil ? r = r.to_s : r='Nil result (no result returned or run failed)'
            p r
            r.gsub!(/ /, "&nbsp;")
            r.gsub!(/\n/, "<br>")
            r.gsub!(/'/, "&rsquo;")
            r.gsub!(/`/, "&lsquo;")
            r.gsub!(/</, "&lt;")
            dlg.execute_script("$('#results').append('Done. Feedback from Ruby: <span class=\\'hl\\'>#{r}</span><br>')")
            dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
          end
        end # callback


        # Callback to clear editor
        add_action_callback("new") do |dlg, params|
          # Use only single quotes here!
          script = 'editor.setValue(\''+@initCode+'\')'
          dlg.execute_script(script)
          dlg.execute_script("$('#results').append('Cleared the editor<br>')")
          dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
          dlg.execute_script("$('#save_name').text('untitled.rb')")
          dlg.execute_script("$('#save_filename').val('untitled.rb')")
          dlg.execute_script("c = false;")
        end # callback


        # Callback to load a file into the editor
        add_action_callback("load") do |dlg, params|
          p @snip_dir
          file = UI.openpanel("Open File", @snip_dir, "*.*")
          return unless file
          name = File.basename(file)
          extension = File.extname(file)
          @file = file
          dlg.execute_script("$('#save_name').text('#{name}')")
          dlg.execute_script("$('#save_filename').val('#{name}')")
          if params != "true"
            dlg.execute_script(%/document.getElementById('console').value=""/)
          end
          f = File.new(file,"r")
          text = f.readlines.join

          # Encode backward slashes and single quotes in Ruby
          text.gsub!('\\', "<84JSed>")
          text.gsub!('\'', "<25SKxw>")
          text.gsub!(/\n/, "\\n")
          text.gsub!(/\r/, "\\r")
          text.gsub!(/'\'/, '\\')
          # Not needed now:
          # text.gsub!(/'/, "\\\\'")
          # Use only single quotes here!

          # Load text into variable in JS and unencode the slashes and quotes
          dlg.execute_script("tmp = '#{text}'")
          dlg.execute_script("tmp = tmp.replace(/<84JSed>/g,'\\\\')")
          dlg.execute_script("tmp = tmp.replace(/<25SKxw>/g,'\\'')")
          script = 'editor.setValue(tmp)'
          dlg.execute_script(script)
          
          # Not needed now:
          # script = 'editor.setValue(\''+text+'\')'
          # dlg.execute_script(script)
          dlg.execute_script("$('#results').append('File loaded: #{name}<br>')")
          dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
        end # callback


        # Callback to save a file (and create a backup)
        add_action_callback("save") do |dlg, params|
          filename = dlg.get_element_value("save_filename")
          file = UI.savepanel("Save File", @snip_dir, filename)
          return if file.nil?
          name = File.basename(file)
          extension = File.extname(file)
          # Add RB extension if nothing is there
          if extension == ""
            name = name+".rb"
            file = file+".rb"
          end
          str=dlg.get_element_value("console")
          str.gsub!(/\r\n/, "\n")
          # Not needed now:
          # str.gsub!(/'\'/, "\\")
          # Save backup as well if file exists
          if File.exist?(file) and params == 'true'
            f = File.new(file,"r")
            oldfile = f.readlines
            File.open(file+".bak", "w") { |f| f.puts oldfile }
          end
          File.open(file, "w") { |f| f.puts str }
          dlg.execute_script("$('#save_name').text('#{name}')")
          dlg.execute_script("$('#save_filename').val('#{name}')")
          dlg.execute_script("c = false;")
          dlg.execute_script("$('#results').append('File saved: #{name}<br>')")
          dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
        end # callback


        # Callback to close the dialog
        add_action_callback("quit") { |dlg, params|
          dlg.execute_script("$('#results').append('Closing editor...<br>')")
          dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
          dlg.close
        }


        # Callback to undo the last grouped code execution
        add_action_callback("undo") do |dlg, params|
          Sketchup.undo
          dlg.execute_script("$('#results').append('Last step undone<br>')")
          dlg.execute_script("$('#results').attr({ scrollTop: $('#results').attr('scrollHeight') })")
        end # callback
        
        
        # Callback to explore current selection
        add_action_callback("sel_explore") do |dlg, params|
          sel = Sketchup.active_model.selection
          mes = ""
          mes += "#{sel.length} "
          mes += sel.length == 1 ? "entity" : "entities"
          mes += " selected\n\n"
          sel.each_with_index { |item,i|
            mes += "Entity: #{sel[i].to_s}\n"
            mes += "Type: #{sel[i].typename}\n"
            mes += "ID: #{sel[i].entityID}\n"
            if sel[i].typename == "ComponentInstance"
              mes += "Definition name: #{sel[i].definition.name}\n"
            end
            mes += "Parent: #{sel[i].parent}\n"
            mes += "Layer: #{sel[i].layer.name}\n"
            mes += "Center location: #{sel[i].bounds.center}\n"
            mes += "\n"
          }
          UI.messagebox mes , MB_MULTILINE, "Explore Current Selection"
        end # callback
        
        
        # Callback to explore current selection's attributes
        add_action_callback("att_explore") do |dlg, params|
          sel = Sketchup.active_model.selection
          mes = ""
          mes += "#{sel.length} "
          mes += sel.length == 1 ? "entity" : "entities"
          mes += " selected\n\n"
          sel.each_with_index { |item,i|
            mes += "Entity: #{sel[i].to_s}\n"
            if sel[i].attribute_dictionaries
              mes += "Attribute dictionaries:\n"
              names = ""
              sel[i].attribute_dictionaries.each {|dic|
                mes += "  Dictionary name: #{dic.name}\n"
                dic.each { | key, value |
                  mes += "    " + key.to_s + '=' + value.to_s + "\n"
                }
              }
            else
              mes += "No attributes defined\n"
            end
            mes += "\n"
          }
          UI.messagebox mes , MB_MULTILINE, "Explore Current Selection's Attributes"
        end # callback
        
        
        # Callback to show Ruby console
        add_action_callback("show_console") do |dlg, params|
          Sketchup.send_action "showRubyPanel:"
        end # callback


        # Show the dialog and insert sample code
        show do
          script = 'editor.setValue(\''+@initCode+'\')'
          execute_script(script)
          # execute_script("document.getElementById('console').value=''")
        	# execute_script("editor.setValue('#{@initCode}')")
        	# Set version number in dialog
        	execute_script("rceVersion = #{@rceVersion}")
        end # show dialog


     end # initialize
     
     
  end # class RubyEditor


end # module AS_RubyEditor


# Register plugin and create menu items / toolbars


# Get file name of this file
file = File.basename(__FILE__)

unless file_loaded?(file)
  # Add menu item
  UI.menu("Window").add_item("Ruby Code Editor") { editordlg = AS_RubyEditor::RubyEditor.new }

  # Add toolbar
  as_rce_tb = UI::Toolbar.new "Ruby Code Editor"
  as_rce_cmd = UI::Command.new("Ruby Code Editor") { editordlg = AS_RubyEditor::RubyEditor.new }
  as_rce_cmd.small_icon = "img/rce_1_16.png"
  as_rce_cmd.large_icon = "img/rce_1_24.png"
  as_rce_cmd.tooltip = "Ruby Code Editor"
  as_rce_cmd.menu_text = "Ruby Code Editor"
  as_rce_tb = as_rce_tb.add_item as_rce_cmd
  as_rce_tb.show

  # Tell SU that we loaded this file
  file_loaded file
end