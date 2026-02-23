class Studio < ApplicationRecord
  belongs_to :default_student_package, class_name: "Billable", optional: true
  belongs_to :default_professional_package, class_name: "Billable", optional: true
  belongs_to :default_guest_package, class_name: "Billable", optional: true
end
