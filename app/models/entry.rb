class Entry < ApplicationRecord
  has_many :heats, dependent: :destroy
  belongs_to :lead, class_name: "Person"
  belongs_to :follow, class_name: "Person"
  belongs_to :instructor, class_name: "Person", optional: true
  belongs_to :age
  belongs_to :level
  belongs_to :studio, optional: true

  def subject
    if lead.type == "Professional"
      follow
    elsif lead.id == 0
      follow
    else
      lead
    end
  end

  def partner(person)
    follow == person ? lead : follow
  end

  def pro
    subject.type != "Student"
  end

  def subject_category(show_ages = true)
    return "-" if pro

    if show_ages
      if follow.type == "Professional"
        "L - #{age.category}"
      elsif lead.type == "Professional"
        "F - #{age.category}"
      else
        "AC - #{age.category}"
      end
    else
      if follow.type == "Professional"
        "L"
      elsif lead.type == "Professional"
        "F"
      else
        "AC"
      end
    end
  end

  def subject_lvlcat(show_ages = true)
    return "- PRO -" if pro

    if show_ages
      if follow.type == "Professional"
        "L - #{level.initials} - #{age.category}"
      elsif lead.type == "Professional"
        "F - #{level.initials} - #{age.category}"
      else
        "AC - #{level.initials} - #{age.category}"
      end
    else
      if follow.type == "Professional"
        "L - #{level.initials}"
      elsif lead.type == "Professional"
        "F - #{level.initials}"
      else
        "AC - #{level.initials}"
      end
    end
  end

  def level_name
    if pro
      "Professional"
    else
      level.name
    end
  end

  def age_category
    pro ? "-" : age.category
  end
end
