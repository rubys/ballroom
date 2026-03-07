class Billable < ApplicationRecord
  self.inheritance_column = nil

  scope :ordered, -> { order(arel_table[:order]) }
end
