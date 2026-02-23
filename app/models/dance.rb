class Dance < ApplicationRecord
  belongs_to :open_category, class_name: "Category", optional: true
  belongs_to :closed_category, class_name: "Category", optional: true
  belongs_to :solo_category, class_name: "Category", optional: true
  belongs_to :multi_category, class_name: "Category", optional: true
  belongs_to :pro_open_category, class_name: "Category", optional: true
  belongs_to :pro_closed_category, class_name: "Category", optional: true
  belongs_to :pro_solo_category, class_name: "Category", optional: true
  belongs_to :pro_multi_category, class_name: "Category", optional: true
end
