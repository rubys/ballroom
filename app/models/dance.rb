class Dance < ApplicationRecord
  normalizes :name, with: ->(name) { name.strip }

  scope :ordered, -> { order(arel_table[:order]) }

  belongs_to :open_category, class_name: "Category", optional: true
  belongs_to :closed_category, class_name: "Category", optional: true
  belongs_to :solo_category, class_name: "Category", optional: true
  belongs_to :multi_category, class_name: "Category", optional: true
  belongs_to :pro_open_category, class_name: "Category", optional: true
  belongs_to :pro_closed_category, class_name: "Category", optional: true
  belongs_to :pro_solo_category, class_name: "Category", optional: true
  belongs_to :pro_multi_category, class_name: "Category", optional: true

  has_many :heats, dependent: :destroy
  has_many :songs, dependent: :destroy

  validates :name, presence: true
  validates :order, presence: true, uniqueness: true

  validate :name_unique

  def name_unique
    return if order.nil? || order < 0
    return unless name.present?
    return unless Dance.where(name: name, order: 0...).where.not(id: id).exists?
    errors.add(:name, "already exists")
  end

  def freestyle_category
    open_category || closed_category || multi_category ||
    pro_open_category || pro_closed_category || pro_multi_category
  end

  def effective_limit
    return 1 if semi_finals?
    limit || Event.current.dance_limit
  end
end
