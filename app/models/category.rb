class Category < ApplicationRecord
  normalizes :name, with: ->(name) { name.strip }

  # Rails 8.0 compatible ordering scope
  scope :ordered, -> { order(arel_table[:order]) }

  has_many :open_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :open_category_id
  has_many :closed_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :closed_category_id
  has_many :solo_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :solo_category_id
  has_many :multi_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :multi_category_id

  has_many :pro_open_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :pro_open_category_id
  has_many :pro_closed_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :pro_closed_category_id
  has_many :pro_solo_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :pro_solo_category_id
  has_many :pro_multi_dances, dependent: :nullify,
    class_name: "Dance", foreign_key: :pro_multi_category_id

  validates :name, presence: true
  validates :order, presence: true, uniqueness: true

  def part
    nil
  end

  def base_category
    self
  end
end
