require "application_system_test_case"

class EventsSystemTest < ApplicationSystemTestCase
  test "root page renders" do
    visit root_url
    assert_text "Studios"
  end

  test "settings page renders" do
    visit settings_events_url
    assert_text "Event Settings"
    assert_text "Description"
    assert_text "Options"
    assert_text "Scoring"
  end
end
