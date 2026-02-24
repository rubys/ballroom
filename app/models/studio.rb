class Studio < ApplicationRecord
  belongs_to :default_student_package, class_name: "Billable", optional: true
  belongs_to :default_professional_package, class_name: "Billable", optional: true
  belongs_to :default_guest_package, class_name: "Billable", optional: true

  has_many :studio1_pairs, class_name: "StudioPair", foreign_key: "studio2_id", dependent: :destroy
  has_many :studio1s, through: :studio1_pairs, source: :studio1, class_name: "Studio"
  has_many :studio2_pairs, class_name: "StudioPair", foreign_key: "studio1_id", dependent: :destroy
  has_many :studio2s, through: :studio2_pairs, source: :studio2, class_name: "Studio"

  normalizes :name, with: ->(name) { name.strip }

  scope :by_name, -> { order(:name) }

  validates :name, presence: true, uniqueness: true

  def pairs
    ids = studio1_pairs.pluck(:studio1_id) + studio2_pairs.pluck(:studio2_id)
    Studio.where(id: ids)
  end
end
