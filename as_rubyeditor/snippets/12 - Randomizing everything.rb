###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Apply randomized rotation and scaling to components in selection

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

max_rotation_angle = 90  # Only rotate max. 90 degrees
size_var = 0.5  # Size variations. Keep below 1

# Iterate through selection
sel.each { |e|

    # Apply only to component instances
    if e.typename == "ComponentInstance"

        # Get the center of the selected object
        center = e.bounds.center
        # Als get the base center for scaling
        base = center.clone
        z_height = (e.bounds.max.z - e.bounds.min.z)
        base.z = base.z - z_height/2

        # Transform this object
        t1 = Geom::Transformation.rotation(center , [0,0,1],
            (rand * max_rotation_angle).degrees)
        t2 = Geom::Transformation.scaling base,
            1 - size_var/2 + rand*size_var
        # Combine transformations
        t = t1 * t2

        e.transform! t

    end

}
