require "application_system_test_case"

class EventsSystemTest < ApplicationSystemTestCase
  test "root page renders" do
    unless Event.exists?
      Event.create!(name: "Test Showcase", date: "2026-03-01", location: "Main Hall")
    end

    visit root_url
    assert_text "Studios"
  end
end
