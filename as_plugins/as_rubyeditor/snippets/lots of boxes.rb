# Creates a 3D grid of boxes

entities = Sketchup.active_model.entities

n = 5
s = 100 
w = 20

(0..n-1).each { |i|
  (0..n-1).each { |j|
    (0..n-1).each { |k|
      face = entities.add_face [i*s,j*s,k*s],[i*s,j*s+w,k*s],[i*s+w,j*s+w,k*s],[i*s+w,j*s,k*s]
      face.pushpull -w
    }
  }
}
