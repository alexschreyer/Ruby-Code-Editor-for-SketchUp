###############################################
#
# Script sample from Alexander C. Schreyer's book
# "Architectural Design with SketchUp"
#
###############################################
#
# Rotate-copy placement of a component

mod = Sketchup.active_model  # Open model
ent = mod.entities  # All entities in model
sel = mod.selection  # Current selection

s = 28  # x-spacing
t = 12  # z-spacing
h = 20  # number in x
v = 20  # number in z
max_deg = 90  # Max "opening" angle

# Make sure selection is a component
if (sel[0].typename == 'ComponentInstance')
    v.times { |j|
        h.times { |i|

            # Place a brick at the specified location
            t1 = Geom::Transformation.translation([i*s,0,j*t])
            instance = ent.add_instance(sel[0].definition, t1)

            # Calculate angle and rotate the brick around vertical axis
            angle = (Math::sin((i*180/h).degrees)+Math::sin((j*360/v).degrees))*max_deg/2
            t2 = Geom::Transformation.rotation instance.bounds.center, [0,0,1],
                 angle.degrees
            instance.transform! t2

        }
    }
end
