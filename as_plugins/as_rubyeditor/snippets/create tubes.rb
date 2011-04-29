# This code draws a few tubes spaced in a sinus wave

model = Sketchup.active_model
entities = model.active_entities
centerpoint = Geom::Point3d.new
vector = Geom::Vector3d.new 0,0,1
vector2 = vector.normalize!

(0..10).each do |i|
 # Create a circle perpendicular to the normal or Z axis
 centerpoint = [i*5,Math.sin(i)*10,0]
 edges = entities.add_circle centerpoint, vector2, 2
 face = entities.add_face(edges)
 face.pushpull -i*10
end
