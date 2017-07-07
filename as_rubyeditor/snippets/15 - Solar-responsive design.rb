###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Maps a component onto the center of all selected faces and
# scales based on south orientation

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Get the one component's definition
comp = nil
sel.each { |e|
    if e.typename == "ComponentInstance"
        comp = e.definition
    end
}

# Iterate through all ungrouped faces
sel.each { |e|
    if e.typename == "Face"

        # Place a copy at the center of the bounding box
        center = e.bounds.center
        t = Geom::Transformation.new center, e.normal
        new = ent.add_instance comp, t

        # Now scale objects by south orientation
        scale = 1-[(e.normal.angle_between [0,-1,0]),0.2].max
        new.transform! Geom::Transformation.scaling center, scale, scale, scale*2

        # Explode it so that we can remove the face afterwards
        new.explode

    end
}