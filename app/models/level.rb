class Level < ApplicationRecord
  def initials
    if id == 0
      '*'
    else
      name.gsub(/[^A-Z0-9]/, '')
    end
  end
end
