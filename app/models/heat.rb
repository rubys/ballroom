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

  def dance_category
    if category == "Open"
      dance.open_category
    elsif category == "Solo"
      dance.solo_category
    elsif category == "Multi"
      dance.multi_category
    else
      dance.closed_category
    end
  end
end
