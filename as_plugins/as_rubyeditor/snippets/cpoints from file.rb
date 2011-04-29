# This code asks for a file, loads 3D point data and
# draws a construction point for each imported point.
# Data must be in format x,y,z per line in file

filename = UI.openpanel 'Open File'
if filename != nil 
  file = File.open(filename)
  file.each { |line|
    pointXYZ = line.strip.split(",")
    Sketchup.active_model.entities.add_cpoint [pointXYZ[0].to_f,pointXYZ[1].to_f,pointXYZ[2].to_f]
  }
  file.close
end
