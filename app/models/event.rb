class Event < ApplicationRecord
  belongs_to :solo_level, class_name: "Level", optional: true

  def self.current
    Event.sole
  end

  def assign_judges?
    assign_judges.to_i > 0
  end
end
