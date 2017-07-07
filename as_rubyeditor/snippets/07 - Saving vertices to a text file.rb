###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Write all ungrouped vertices in selection to file

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Empty array for vertices
verts = []

# Iterate over the selection and store vertices
sel.each do |e|

  # Only consider edges
  if e.typename == "Edge"
    # Add vertices to array
    verts.push e.vertices
  end
  
end

# Remove any sub-arrays (if necessary)
verts.flatten!
# Remove duplicates in array
verts.uniq!

# Ask for export file
filename = UI.openpanel 'Text file for vertex coordinates'

# Write vertices to file
if filename
    f = File.open(filename, 'w')
    # Write x,y,z coordinates in default units (inches)
    verts.each { |v|
        f.print v.position.x.to_inch,',',v.position.y.to_inch,',',v.position.z.to_inch,"\n"
    }
    f.close
end
