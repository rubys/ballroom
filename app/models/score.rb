class Score < ApplicationRecord
  belongs_to :judge, class_name: "Person"
  belongs_to :heat, optional: true
  belongs_to :person, optional: true
end
