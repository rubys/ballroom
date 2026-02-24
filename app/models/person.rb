class Person < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :studio, optional: true
  belongs_to :level, optional: true
  belongs_to :age, optional: true
  belongs_to :exclude, class_name: "Person", optional: true
  belongs_to :invoice_to, class_name: "Person", optional: true
  belongs_to :package, class_name: "Billable", optional: true
  belongs_to :table, optional: true

  has_one :judge

  scope :by_name, -> { order(:name) }

  def display_name
    name && name.split(/,\s*/).rotate.join(" ")
  end

  def present?
    judge ? judge.present : true
  end
end
