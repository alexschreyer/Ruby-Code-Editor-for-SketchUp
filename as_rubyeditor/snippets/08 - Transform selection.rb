###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Test transformations on selected object

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Get the center of the selected object
center = sel[0].bounds.center

# Define all possible translations
t1 = Geom::Transformation.new([100,0,0])
t2 = Geom::Transformation.translation([100,0,0])
t3 = Geom::Transformation.rotation(center, [1,0,0], 45.degrees)
t4 = Geom::Transformation.scaling(center, 2)

# Choose one of them — for now
t = t2

# Transform first object in selection
ent.transform_entities(t, sel[0])
