class Age < ApplicationRecord
  has_one :costs, class_name: "AgeCost", dependent: :destroy
end
