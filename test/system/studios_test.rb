require "application_system_test_case"

class StudiosSystemTest < ApplicationSystemTestCase
  test "create, edit, and delete a studio" do
    visit root_url
    click_on "Studios"
    assert_text "Studios"

    click_on "New studio"
    fill_in "Name", with: "Galaxy Dance"
    click_on "Create Studio"
    assert_text "Galaxy Dance"
    assert_text "Showing studio"

    click_on "Edit this studio"
    fill_in "Name", with: "Galaxy Ballroom"
    click_on "Update Studio"
    assert_text "Galaxy Ballroom"
    assert_text "Showing studio"

    accept_confirm do
      click_on "Destroy this studio"
    end
    assert_text "Studios"
    assert_text "New studio"
  end
end
