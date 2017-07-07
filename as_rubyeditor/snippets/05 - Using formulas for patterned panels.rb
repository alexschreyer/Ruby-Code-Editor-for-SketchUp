###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Creates a square panel with a sinusoidal hole pattern

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

width = 36  # Width of panel
n = 10  # Number of circles in each direction
s = width / (n+1).to_f  # Spacing of circles

# add the square base for the panel
ent.add_face [0,0,0],[width,0,0],[width,width,0],[0,width,0]

# Iterate in the panel plane
(0..n-1).each { |i|
  (0..n-1).each { |j|

    # add the circles
    radius = Math::sin(i/(n-1).to_f*1*Math::PI)*s/5.0+Math::sin(j/(n-1).to_f*1*Math::PI)*s/5.0
    ent.add_circle [s+i*s,s+j*s,0], [0,0,1], radius

  }
}
