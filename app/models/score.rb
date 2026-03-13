class Score < ApplicationRecord
  belongs_to :judge, class_name: "Person"
  belongs_to :heat, optional: true
  belongs_to :person, optional: true

  def display_value
    return unless value
    if value.start_with?("{")
      parts = []
      JSON.parse(value).each_pair { |k, v| parts << "#{k}: #{v}" }
      parts.join(", ")
    else
      value
    end
  end

  def category_score?
    heat_id&.negative?
  end

  def per_heat_score?
    heat_id&.positive?
  end

  def actual_category_id
    -heat_id if category_score?
  end

  def actual_category
    Category.find(actual_category_id) if category_score?
  end

  def actual_heat
    Heat.find(heat_id) if per_heat_score?
  end
end
