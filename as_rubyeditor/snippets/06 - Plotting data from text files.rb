###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# This code asks for a file, loads 3D point data and
# draws a construction point for each imported point.
# Data must be in the format x,y,z per line in your file,
# otherwise modify this script for your case.

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Starts at line zero, modify if you have a header line
startline = 0

# Use the openpanel to get the file name
filename = UI.openpanel 'Select Data File'

# Iterate through all lines in the file and plot the cpoints
if filename != nil
  file = File.open(filename)
  file.each { |line|
    if file.lineno >= startline
      pointXYZ = line.strip.split(",")
      ent.add_cpoint [pointXYZ[0].to_f,pointXYZ[1].to_f,pointXYZ[2].to_f]
    end
  }
  file.close
end
