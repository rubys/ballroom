class Entry < ApplicationRecord
  belongs_to :lead, class_name: "Person"
  belongs_to :follow, class_name: "Person"
  belongs_to :instructor, class_name: "Person", optional: true
  belongs_to :age
  belongs_to :level
  belongs_to :studio, optional: true
end
