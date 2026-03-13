require "application_system_test_case"

class EventsSystemTest < ApplicationSystemTestCase
  test "root page renders" do
    visit root_url
    assert_text "Studios"
  end

  test "summary page renders" do
    visit summary_event_index_url
    assert_text "Event Summary"
    assert_text "People"
    assert_text "See also"
  end

  test "settings page renders" do
    visit settings_event_index_url
    assert_text "Event Settings"
    assert_text "Description"
    assert_text "Options"
    assert_text "Scoring"
  end

  test "settings page updates event" do
    visit settings_event_index_url
    fill_in "Name", with: "Updated Showcase"
    choose "Two ballrooms (split)"
    check "Use back numbers?"
    uncheck "Include pro heats?"
    click_button "Save Settings"
    assert_text "Settings were successfully updated."
    assert_field "Name", with: "Updated Showcase"
  end
end
