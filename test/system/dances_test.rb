require "application_system_test_case"

class DancesSystemTest < ApplicationSystemTestCase
  test "drag and drop reorders dances" do
    visit dances_url

    # Get initial order of first two dances
    rows = all("tbody tr[data-drag-id]")
    first_dance = rows[0].find("td:first-child a").text
    second_dance = rows[1].find("td:first-child a").text

    # Drag first dance to second position
    source = rows[0]
    target = rows[1]
    source.drag_to(target)

    # Wait for page to reload by checking the first dance changed
    assert_selector "tbody tr[data-drag-id]:first-child td:first-child a", text: second_dance
    rows = all("tbody tr[data-drag-id]")
    assert_equal first_dance, rows[1].find("td:first-child a").text
  end

  test "create, edit, and delete a dance" do
    visit dances_url
    assert_text "Dances"

    click_on "New dance"
    fill_in "Name", with: "Bolero"
    click_on "Create Dance"
    assert_text "Bolero was successfully created."

    click_on "Bolero"
    fill_in "Name", with: "Bolero Supreme"
    click_on "Update Dance"
    assert_text "Bolero Supreme was successfully updated."

    click_on "Bolero Supreme"
    accept_confirm do
      click_on "Remove this dance"
    end
    assert_text "Bolero Supreme was successfully removed."
  end
end
