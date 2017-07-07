###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Randomly extrudes all selected faces

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Iterate through selection
sel.each do |e|

  # First check if this is a face
  if e.typename == "Face"
  
    # Then extrude it
    e.pushpull rand(100)
    
  end
  
end
