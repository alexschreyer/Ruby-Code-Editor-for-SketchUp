###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Scale groups by proximity to component attractors

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Array with attractor center points
attractors = []

# Adjust this value to adjust the proximity influence
max_val = 200

# Get all attractor points from groups in selection
sel.each { |e|
    if e.typename == 'Group'
        attractors.push e.bounds.center
    end
}

# Iterate through components and scale based on distance
if attractors.length > 0

    # Do this for each group
    sel.each { |e|
        if e.typename == "ComponentInstance"

            # Get the center of the group
            center = e.bounds.center
            # Set the y-value to zero so that we
            # scale "outward"
            center.y=0

            # Calculate minimum distance between face and
            # all attractors
            dist = 1000000  # Start with a large number

            # Find the smallest distance
            attractors.each { |apoint|
                dist_calc = apoint.distance center
                dist = dist_calc if dist_calc < dist
            }

            # Calculate scale
            scale = (dist/max_val)**2
            t = Geom::Transformation.scaling center, 1, scale, 1
            e.transform! t

        end
    }

end
