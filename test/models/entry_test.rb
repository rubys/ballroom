require "test_helper"

class EntryTest < ActiveSupport::TestCase
  # student_pro: Student lead (student_lead) + Professional follow (pro_follow)
  # pro_student: Professional lead (two) + Student follow (one)

  test "subject returns student when lead is Professional" do
    entry = entries(:pro_student)
    assert_equal people(:one), entry.subject
  end

  test "subject returns lead when lead is Student" do
    entry = entries(:student_pro)
    assert_equal people(:student_lead), entry.subject
  end

  test "partner returns the other person" do
    entry = entries(:student_pro)
    assert_equal people(:pro_follow), entry.partner(people(:student_lead))
    assert_equal people(:student_lead), entry.partner(people(:pro_follow))
  end

  test "pro returns true when subject is Professional" do
    entry = entries(:one)
    # entry one: lead=Student, follow=Student, so subject=lead (Student)
    assert_not entry.pro
  end

  test "pro returns false when subject is Student" do
    entry = entries(:student_pro)
    assert_not entry.pro
  end

  test "subject_category returns L when follow is Professional" do
    entry = entries(:student_pro)
    result = entry.subject_category()
    assert_equal "L - #{entry.age.category}", result
  end

  test "subject_category returns F when lead is Professional" do
    entry = entries(:pro_student)
    result = entry.subject_category()
    assert_equal "F - #{entry.age.category}", result
  end

  test "subject_category without ages" do
    entry = entries(:student_pro)
    assert_equal "L", entry.subject_category(false)
  end

  test "subject_category returns dash for pro entries" do
    entry = entries(:one)
    entry.lead.type = "Professional"
    entry.follow.type = "Professional"
    result = entry.subject_category()
    assert_equal "-", result
  end

  test "subject_lvlcat includes level initials" do
    entry = entries(:student_pro)
    result = entry.subject_lvlcat()
    expected = "L - #{entry.level.initials} - #{entry.age.category}"
    assert_equal expected, result
  end

  test "subject_lvlcat without ages" do
    entry = entries(:student_pro)
    expected = "L - #{entry.level.initials}"
    assert_equal expected, entry.subject_lvlcat(false)
  end

  test "subject_lvlcat returns PRO for pro entries" do
    entry = entries(:one)
    entry.lead.type = "Professional"
    entry.follow.type = "Professional"
    result = entry.subject_lvlcat()
    assert_equal "- PRO -", result
  end

  test "level_name returns level name for student entries" do
    entry = entries(:student_pro)
    assert_equal entry.level.name, entry.level_name
  end

  test "level_name returns Professional for pro entries" do
    entry = entries(:one)
    entry.lead.type = "Professional"
    entry.follow.type = "Professional"
    assert_equal "Professional", entry.level_name
  end

  test "age_category returns age category for student entries" do
    entry = entries(:student_pro)
    assert_equal entry.age.category, entry.age_category
  end

  test "age_category returns dash for pro entries" do
    entry = entries(:one)
    entry.lead.type = "Professional"
    entry.follow.type = "Professional"
    assert_equal "-", entry.age_category
  end
end
