#
# RUBY CODE EDITOR
#
# Some settings that you could change if you like:
# ------------------------------------------------
#

# Initial code snippet - keep on one line!
$initCode = 'mod = Sketchup.active_model # Open model\nent = mod.entities # All entities in model\nsel = mod.selection # Current selection'

# Snippets directory name
$snippetsDirName = 'snippets'

# Set this to the base directory you want to use
$baseDir = File.dirname(__FILE__)
# Could use the SU installation directory:
# $baseDir = Sketchup.find_support_file('')

# Working directory
$workingDir = File.join( $baseDir , $snippetsDirName )
# Uncomment this line if you just want to use the default/current/latest directory:
# $workingDir = ''
# Uncomment this line if you want to use a directory on Windows (modify to suit your needs):
# $workingDir = 'D:/'