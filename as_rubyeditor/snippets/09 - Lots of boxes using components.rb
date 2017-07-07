###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Creates lots of boxes using components.

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

s = 100  # Spacing
w = 10  # Box width
n = 10  # Number of boxes

# First create a component of a box
group = ent.add_group
face = group.entities.add_face [0,0,0],[w,0,0],[w,w,0],[0,w,0]
face.pushpull -w
comp = group.to_component

# Iterate in all three dimensions
(0..n).each { |i|
  (0..n).each { |j|
    (0..n).each { |k|
    
       # Now place copies at final locations using transformation
       transformation = Geom::Transformation.new([i*s,j*s,k*s])
       ent.add_instance(comp.definition, transformation)
       
    }
  }
}
