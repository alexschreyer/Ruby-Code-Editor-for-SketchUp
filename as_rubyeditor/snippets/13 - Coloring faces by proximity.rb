###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Color faces by proximity to component attractors

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

# Array with attractor center points
attractors = []

# Adjust this value to play with the scaling
max_val = 500

# Get all ComponentInstances as attractor points
sel.each { |e|
    if e.typename == 'ComponentInstance'
        attractors.push e.bounds.center
    end
}

# Iterate through objects and scale based on distance
if attractors.length > 0

    # Do this for each face
    sel.each { |e|
        if e.typename == "Face"

            # Get the center of the face
            center = e.bounds.center

            # Calculate minimum distance between face and
            # all attractors
            dist = 1000000  # Start with a large number

            # Find the smallest distance
            attractors.each { |apoint|
                dist_calc = apoint.distance center
                dist = dist_calc if dist_calc < dist
            }

            # Adjust color of face between blue and yellow
            e.material = [(dist/max_val*255).round,(dist/max_val*255).round,
              (255-dist/max_val*255).round]

        end
    }

end
