Ruby Code Editor for SketchUp
=============================

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

History:       

                1.0 (2/3/2010):
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
                    
                    
To-Do List:

                - Highlighting for color light schemes
                - Multiple files
                - Autocomplete (soon!)
                
Isues: 

                - Page zoom does not work well in reference browser - just use this as a backup if the font is unreadable
                - Doesn't like to work when other code editors are running in SketchUp - Just restart SketchUp
                - Coloring sometimes needs text change to update

How to install this plugin in SketchUp:
=======================================

Download the ZIP file and unzip its contents into the SketchUp plugin directory
(usually at C:\Program Files\Google\SketchUp\Plugins\ in Windows
or /Library/Application Support/Google SketchUp/SketchUp/Plugins/ on the Mac).

Keep the folder structure as it is in the ZIP file. Make sure the file called
as_loadrubyeditor.rb ends up in the SketchUp Plugins directory.
Then re-start SketchUp and look for the new menu item in the Windows menu.
If you are updating, just overwrite the old version of this plugin.

SketchUp file structure after installation:

/SketchUp Directory/
      /Plugins/
            as_loadrubyeditor.rb
            /as_plugins/
                   /as_rubyeditor/
                        /codemirror/
                        /img/
                        /jquery-ui/
                        /snippets/
                        as_rubyeditor.rb
                        as_rubyeditor_settings.rb
                        ui.html
                        ui.js
                        ui_p.css
            
