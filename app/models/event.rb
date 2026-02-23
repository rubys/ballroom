class Event < ApplicationRecord
  belongs_to :solo_level, class_name: "Level", optional: true
end
