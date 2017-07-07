###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Creates a 3D grid of colored boxes.

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

n = 6  # Number of boxes in each direction
s = 100  # Spacing
w = 50  # Box width

# Iterate in all three dimensions
(0..n-1).each { |i|
  (0..n-1).each { |j|
    (0..n-1).each { |k|

      # Create a group for each box
      group = ent.add_group
      # Add the face to the group's entities
      face = group.entities.add_face [i*s,j*s,k*s],[i*s,j*s+w,k*s],[i*s+w,j*s+w,k*s],[i*s+w,j*s,k*s]
      # Add a material (an RGB color)
      face.back_material = [(255/(n-1)*i).round,(255/(n-1)*j).round,(255/(n-1)*k).round]
      # Now extrude the box
      face.pushpull -w

    }
  }
}
