###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Creates a small random city

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

n = 10  # number of buildings
s = 100.feet  # spacing
w = 60.feet  # base width

# Iterate over ground (x and y)
(0..n-1).each { |i|
    (0..n-1).each { |j|
    
        # add a face first
        face = ent.add_face [i*s,j*s,0],[i*s,j*s+w,0],[i*s+w,j*s+w,0],[i*s+w,j*s,0]
        
        # then pushpull it to get a box
        height = 100.feet + rand(100).feet
        face.pushpull -height
        
    }
}