class Heat < ApplicationRecord
  belongs_to :dance
  belongs_to :entry

  def number
    value = super
    value = 0 if value.nil?
    value.to_i == value ? value.to_i : value
  end

  def subject
    entry.subject
  end
end
