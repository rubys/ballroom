class Judge < ApplicationRecord
  belongs_to :person
  alias_attribute :sort_order, :sort
end
