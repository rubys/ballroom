class Billable < ApplicationRecord
  self.inheritance_column = nil

  has_many :package_includes, dependent: :destroy, class_name: "PackageInclude", foreign_key: :package_id

  scope :ordered, -> { order(arel_table[:order]) }
end
