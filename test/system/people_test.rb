require "application_system_test_case"

class PeopleSystemTest < ApplicationSystemTestCase
  test "students page shows only students" do
    visit students_people_url
    assert_text "Students"
    assert_no_text "Event Participants"
    assert_text "Doe, Jane"
  end

  test "backs page renders" do
    visit backs_people_url
    assert_text "Back Numbers"
  end
end
