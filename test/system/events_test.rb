require "application_system_test_case"

class EventsSystemTest < ApplicationSystemTestCase
  test "root page renders" do
    visit root_url
    assert_text "Studios"
  end
end
