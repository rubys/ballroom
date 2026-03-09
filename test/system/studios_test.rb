require "application_system_test_case"

class StudiosSystemTest < ApplicationSystemTestCase
  test "pair and unpair studios" do
    studio = studios(:one)

    visit edit_studio_url(studio)
    assert_text "Associated studios"
    assert_text "Two"

    select "Three", from: "Pair"
    click_on "Update Studio"
    assert_text "One was successfully updated."

    click_on "Edit this studio"
    assert_text "Associated studios"
    assert_text "Three"
    assert_text "Two"

    find("li.group", match: :first).hover
    click_on "Unpair", match: :first
    within("ul.list-disc") do
      assert_no_text "Three"
      assert_text "Two"
    end
  end

  test "create, edit, and delete a studio" do
    visit root_url
    click_on "Studios"
    assert_text "Studios"

    click_on "New studio"
    fill_in "Name", with: "Galaxy Dance"
    click_on "Create Studio"
    assert_text "Galaxy Dance was successfully created."

    click_on "Edit this studio"
    fill_in "Name", with: "Galaxy Ballroom"
    click_on "Update Studio"
    assert_text "Galaxy Ballroom was successfully updated."

    click_on "Edit this studio"
    accept_confirm do
      click_on "Remove this studio"
    end
    assert_text "Galaxy Ballroom was successfully removed."
  end
end
