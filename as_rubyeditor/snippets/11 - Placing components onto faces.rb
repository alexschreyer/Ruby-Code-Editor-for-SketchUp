###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Use this to map a component onto the center of all selected faces.
# Select one component and several faces to begin.

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Get the single component's definition first
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

        # Now scale objects by some criteria (z-height in this case))
        new.transform! Geom::Transformation.scaling center,
          center.z/100

        # Explode it so that we can remove the face afterwards
        new.explode

    end
}
