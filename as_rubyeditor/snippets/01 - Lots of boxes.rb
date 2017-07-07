###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Creates a 3D grid of similar boxes.

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

n = 5  # Number of boxes
s = 100  # Spacing
w = 20  # Box width

# Iterate in all three dimensions
(0..n-1).each { |i|
  (0..n-1).each { |j|
    (0..n-1).each { |k|
    
      # add a face first
      face = ent.add_face [i*s,j*s,k*s],[i*s,j*s+w,k*s],[i*s+w,j*s+w,k*s],[i*s+w,j*s,k*s]
      # then pushpull it to get a box
      face.pushpull -w
      
    }
  }
}
