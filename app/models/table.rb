class Table < ApplicationRecord
  belongs_to :option, class_name: "Billable", optional: true
end
